#!/usr/bin/env python3
"""
Storm BPM -- DES Engine Verification & Validation Suite
========================================================

This script provides independent mathematical verification of the
Storm BPM discrete-event simulation engine. Every formula is derived
from first principles and referenced to standard queueing theory
textbooks.

== What This Script Does ==

It reads JSON output files produced by the DES engine and compares
every metric against the EXACT analytical solution predicted by
queueing theory. If the DES engine is correct, all metrics must
fall within the expected tolerance of the analytical value.

== Verification Levels ==

Level 1: Point verification (single rho)
  -> Does DES output match the formula at a specific load level?

Level 2: Sensitivity sweep (multiple rho values)
  -> Does DES track the formula across the ENTIRE load range?

Level 3: Multi-replication confidence intervals
  -> Does the 95% CI from 10 replications contain the analytical value?

Level 4: Distribution verification (KS-test)
  -> Are random numbers truly drawn from the declared distribution?

== Supported Scenarios ==
  mm1, mm1k, mmc, tandem, md1

== References ==
  [1] Gross, Shortle et al. "Fundamentals of Queueing Theory" 5th ed.
  [2] Kleinrock, "Queueing Systems, Vol. 1: Theory" (Wiley)
  [3] Law, "Simulation Modeling and Analysis" 5th ed. (McGraw-Hill)
  [4] Wikipedia: M/M/1, Erlang C, Pollaczek-Khinchine, Jackson network

Usage:
  python verify_des.py <scenario> <output.json>
  python verify_des.py --compute-only <scenario> [--rho <value>]
  python verify_des.py --sweep <scenario> <directory>
  python verify_des.py --ci <scenario> <directory>
  python verify_des.py --ks <samples.json>
"""

import math
import json
import sys
import os

# ================================================================
# SECTION 1: ANALYTICAL FORMULAS
# ================================================================
# Each function is self-contained, documented with formula derivation,
# and returns a dict of all expected metric values.


def mm1_analytics(lambda_rate, mu_rate):
    """
    M/M/1 Queue -- Single Server, Poisson Arrivals, Exponential Service

    This is the most fundamental model in queueing theory.

    Notation:
      lambda (lambda_rate) = arrival rate (customers per second)
      mu     (mu_rate)     = service rate (customers per second)
      rho    = lambda/mu   = server utilization (must be < 1 for stability)

    Derivation:
      The system is a birth-death process with birth rate lambda and
      death rate mu. In steady state, the probability of n customers
      in the system is: p_n = (1-rho) * rho^n

      From this geometric distribution:
        L  = sum(n * p_n) = rho / (1-rho)         ... avg customers in system
        Lq = L - rho = rho^2 / (1-rho)            ... avg customers in queue
        W  = L / lambda = 1 / (mu - lambda)        ... avg time in system (Little's Law)
        Wq = Lq / lambda = rho / (mu * (1-rho))   ... avg time waiting in queue

    Reference: [1] Chapter 2, [2] Chapter 3
    """
    rho = lambda_rate / mu_rate
    if rho >= 1.0:
        raise ValueError(f"M/M/1 requires rho < 1, got rho={rho:.4f}")

    L = rho / (1 - rho)
    Lq = rho ** 2 / (1 - rho)
    W = 1.0 / (mu_rate - lambda_rate)
    Wq = rho / (mu_rate * (1 - rho))
    service_mean = 1.0 / mu_rate

    return {
        "rho": rho,
        "L": L,
        "Lq": Lq,
        "W": W,
        "Wq": Wq,
        "service_mean": service_mean,
        "lambda": lambda_rate,
        "mu": mu_rate,
        "throughput": lambda_rate,  # all arrivals are served in stable M/M/1
    }


def mm1k_analytics(lambda_rate, mu_rate, K):
    """
    M/M/1/K Queue -- Finite Capacity K

    Same as M/M/1 but the system can hold at most K customers
    (including the one being served). Arrivals when system is full
    are REJECTED (lost).

    Key difference from M/M/1:
      - System is ALWAYS stable (even when rho >= 1)
      - Some arrivals are lost (rejection/blocking probability)
      - Effective arrival rate lambda_eff = lambda * (1 - p_K) < lambda

    State probabilities:
      p_n = (1-rho) * rho^n / (1 - rho^(K+1))     for rho != 1
      p_n = 1/(K+1)                                 for rho = 1

    Metrics:
      P_reject = p_K                     ... probability of rejection
      L = sum(n=0..K) n * p_n            ... avg system size
      lambda_eff = lambda * (1 - p_K)    ... effective arrival rate
      W = L / lambda_eff                 ... avg time in system

    Reference: [1] Chapter 2.5
    """
    rho = lambda_rate / mu_rate

    if abs(rho - 1.0) < 1e-10:
        # Special case: rho = 1
        p = [1.0 / (K + 1)] * (K + 1)
    else:
        # General case
        denom = 1.0 - rho ** (K + 1)
        p = [(1.0 - rho) * rho ** n / denom for n in range(K + 1)]

    P_reject = p[K]
    L = sum(n * p[n] for n in range(K + 1))
    lambda_eff = lambda_rate * (1.0 - P_reject)
    W = L / lambda_eff if lambda_eff > 1e-15 else float('inf')
    Lq = L - (1.0 - p[0])  # Lq = L - (1 - p_0) where (1-p_0) = avg in service
    Wq = Lq / lambda_eff if lambda_eff > 1e-15 else float('inf')

    return {
        "rho": rho,
        "K": K,
        "P_reject": P_reject,
        "L": L,
        "Lq": Lq,
        "W": W,
        "Wq": Wq,
        "lambda_eff": lambda_eff,
        "lambda": lambda_rate,
        "mu": mu_rate,
        "throughput": lambda_eff,
        "state_probs": p,
    }


def mmc_analytics(lambda_rate, mu_rate, c):
    """
    M/M/c Queue -- Multiple Servers (Erlang C)

    c identical servers, single FIFO queue. A customer waits only
    when all c servers are busy.

    The Erlang C formula gives P(wait):
      a = lambda/mu (offered load in Erlangs)
      rho = a/c = lambda/(c*mu) (per-server utilization, must be < 1)

      C(c,a) = [a^c / c! * 1/(1-rho)] /
               [sum(k=0..c-1) a^k/k! + a^c/c! * 1/(1-rho)]

    Metrics:
      P(wait) = C(c,a)                   ... prob. of waiting
      Wq = C(c,a) / (c*mu - lambda)      ... avg wait time
      W  = Wq + 1/mu                     ... avg time in system
      L  = lambda * W                    ... avg system size (Little's Law)
      Lq = lambda * Wq                   ... avg queue length

    Reference: [1] Chapter 3, Erlang C formula
    """
    a = lambda_rate / mu_rate  # offered load
    rho = a / c               # per-server utilization

    if rho >= 1.0:
        raise ValueError(f"M/M/c requires rho < 1, got rho={rho:.4f}")

    # Compute sum of a^k/k! for k=0..c-1
    sum_terms = 0.0
    for k in range(c):
        sum_terms += a ** k / math.factorial(k)

    # Last term: a^c / c! * 1/(1-rho)
    last_term = (a ** c / math.factorial(c)) * (1.0 / (1.0 - rho))

    # Erlang C formula
    C_erlang = last_term / (sum_terms + last_term)

    Wq = C_erlang / (c * mu_rate - lambda_rate)
    W = Wq + 1.0 / mu_rate
    L = lambda_rate * W
    Lq = lambda_rate * Wq
    service_mean = 1.0 / mu_rate

    return {
        "rho": rho,
        "c": c,
        "a": a,
        "C_erlang": C_erlang,
        "Wq": Wq,
        "W": W,
        "L": L,
        "Lq": Lq,
        "service_mean": service_mean,
        "lambda": lambda_rate,
        "mu": mu_rate,
        "throughput": lambda_rate,
    }


def tandem_analytics(lambda_rate, mu1_rate, mu2_rate):
    """
    Tandem Queue (Jackson Network) -- Two Queues in Series

    Jackson's theorem (1957): In an open network of M/M/c queues
    with Poisson external arrivals, each queue behaves as an
    INDEPENDENT M/M/c queue with its own arrival rate.

    For a simple tandem (series):
      Queue 1: arrival rate = lambda, service rate = mu1
      Queue 2: arrival rate = lambda (departure from Q1 = Poisson by Burke's theorem)

    Total metrics:
      W_total = W1 + W2 = 1/(mu1-lambda) + 1/(mu2-lambda)
      L_total = L1 + L2 = lambda*W1 + lambda*W2 = lambda*W_total

    Reference: [1] Chapter 6 (Networks of Queues), Jackson (1957)
    """
    rho1 = lambda_rate / mu1_rate
    rho2 = lambda_rate / mu2_rate

    if rho1 >= 1.0:
        raise ValueError(f"Queue 1 requires rho1 < 1, got rho1={rho1:.4f}")
    if rho2 >= 1.0:
        raise ValueError(f"Queue 2 requires rho2 < 1, got rho2={rho2:.4f}")

    # Each queue is independent M/M/1
    q1 = mm1_analytics(lambda_rate, mu1_rate)
    q2 = mm1_analytics(lambda_rate, mu2_rate)

    W_total = q1["W"] + q2["W"]
    L_total = q1["L"] + q2["L"]
    Wq_total = q1["Wq"] + q2["Wq"]
    Lq_total = q1["Lq"] + q2["Lq"]

    return {
        "rho1": rho1,
        "rho2": rho2,
        "W1": q1["W"],
        "W2": q2["W"],
        "W_total": W_total,
        "Wq1": q1["Wq"],
        "Wq2": q2["Wq"],
        "Wq_total": Wq_total,
        "L1": q1["L"],
        "L2": q2["L"],
        "L_total": L_total,
        "Lq_total": Lq_total,
        "lambda": lambda_rate,
        "mu1": mu1_rate,
        "mu2": mu2_rate,
        "throughput": lambda_rate,
    }


def md1_analytics(lambda_rate, mu_rate):
    """
    M/D/1 Queue -- Deterministic Service Time

    Arrivals are Poisson (exponential inter-arrival) but service time
    is CONSTANT (deterministic). This is a special case of M/G/1.

    The Pollaczek-Khinchine (P-K) formula for M/G/1:
      Wq = (lambda * E[S^2]) / (2 * (1-rho))

    For deterministic service (variance = 0):
      E[S^2] = E[S]^2 + Var[S] = E[S]^2 + 0 = (1/mu)^2
      Wq = (lambda / mu^2) / (2*(1-rho)) = rho / (2*mu*(1-rho))

    Key insight: Wq(M/D/1) = Wq(M/M/1) / 2
      This is because eliminating service time variability halves
      the average waiting time. This is a powerful result that
      shows the impact of variability on performance.

    Reference: [2] Chapter 5 (M/G/1), Pollaczek-Khinchine formula
    """
    rho = lambda_rate / mu_rate
    if rho >= 1.0:
        raise ValueError(f"M/D/1 requires rho < 1, got rho={rho:.4f}")

    service_mean = 1.0 / mu_rate
    Wq = rho / (2.0 * mu_rate * (1.0 - rho))
    W = Wq + service_mean
    Lq = lambda_rate * Wq
    L = lambda_rate * W

    # For comparison: M/M/1 Wq would be twice as large
    Wq_mm1 = rho / (mu_rate * (1.0 - rho))

    return {
        "rho": rho,
        "L": L,
        "Lq": Lq,
        "W": W,
        "Wq": Wq,
        "Wq_mm1": Wq_mm1,
        "Wq_ratio": Wq / Wq_mm1 if Wq_mm1 > 0 else 0,  # should be 0.5
        "service_mean": service_mean,
        "lambda": lambda_rate,
        "mu": mu_rate,
        "throughput": lambda_rate,
    }


# ================================================================
# SECTION 2: KOLMOGOROV-SMIRNOV TEST
# ================================================================


def ks_test_exponential(samples, expected_rate):
    """
    Kolmogorov-Smirnov test for exponential distribution.

    Tests H0: samples ~ Exp(rate)

    The KS statistic is: D_n = max|F_n(x) - F(x)|
    where F_n(x) = empirical CDF, F(x) = 1 - e^(-rate*x)

    Critical value at alpha=0.05: D_crit ~ 1.358/sqrt(n)

    PASS if D_n < D_crit (we cannot reject H0)
    """
    n = len(samples)
    if n == 0:
        return {"D": float('inf'), "D_crit": 0.0, "passed": False, "n": 0}

    sorted_samples = sorted(samples)
    D = 0.0

    for i, x in enumerate(sorted_samples):
        # Theoretical CDF: F(x) = 1 - exp(-rate * x)
        F_x = 1.0 - math.exp(-expected_rate * x)
        # Empirical CDF steps at i/n and (i+1)/n
        F_n_before = i / n
        F_n_after = (i + 1) / n
        D = max(D, abs(F_n_after - F_x), abs(F_n_before - F_x))

    D_crit = 1.358 / math.sqrt(n)

    return {
        "D": D,
        "D_crit": D_crit,
        "passed": D < D_crit,
        "n": n,
    }


def ks_test_deterministic(samples, expected_value, tolerance=0.01):
    """
    Verify that all samples are equal to the expected constant value.

    For deterministic distributions, we don't use KS test --
    instead we verify that ALL values equal the declared duration.
    """
    n = len(samples)
    if n == 0:
        return {"passed": False, "n": 0, "max_deviation": float('inf')}

    max_dev = max(abs(s - expected_value) for s in samples)
    rel_dev = max_dev / expected_value if expected_value > 0 else max_dev

    return {
        "passed": rel_dev < tolerance,
        "n": n,
        "max_deviation": max_dev,
        "relative_deviation": rel_dev,
        "expected": expected_value,
    }


# ================================================================
# SECTION 3: CONFIDENCE INTERVAL
# ================================================================

# Student's t-distribution critical values for 95% CI (two-tailed)
# t(alpha/2, df) where alpha=0.05
# Pre-computed for common degrees of freedom (df = n - 1)
T_CRITICAL = {
    1: 12.706,
    2: 4.303,
    3: 3.182,
    4: 2.776,
    5: 2.571,
    6: 2.447,
    7: 2.365,
    8: 2.306,
    9: 2.262,   # 10 replications -> df=9
    10: 2.228,
    14: 2.145,
    19: 2.093,
    29: 2.045,
    49: 2.010,
    99: 1.984,
}


def t_critical(df):
    """
    Look up t-critical value for given degrees of freedom.
    Uses exact values for common df, linear interpolation otherwise.
    """
    if df in T_CRITICAL:
        return T_CRITICAL[df]

    # Find bracketing values
    keys = sorted(T_CRITICAL.keys())
    if df < keys[0]:
        return T_CRITICAL[keys[0]]
    if df > keys[-1]:
        return 1.96  # approximate with z for large df

    for i in range(len(keys) - 1):
        if keys[i] <= df <= keys[i + 1]:
            lo, hi = keys[i], keys[i + 1]
            frac = (df - lo) / (hi - lo)
            return T_CRITICAL[lo] + frac * (T_CRITICAL[hi] - T_CRITICAL[lo])

    return 1.96


def compute_ci_95(values):
    """
    Compute 95% confidence interval using Student's t-distribution.

    CI = x_bar +/- t(alpha/2, n-1) * s / sqrt(n)

    Returns dict with mean, std, ci_low, ci_high, half_width.
    """
    n = len(values)
    if n < 2:
        return {
            "mean": values[0] if n == 1 else float('nan'),
            "std": 0.0,
            "ci_low": float('-inf'),
            "ci_high": float('inf'),
            "half_width": float('inf'),
            "n": n,
        }

    mean = sum(values) / n
    variance = sum((x - mean) ** 2 for x in values) / (n - 1)
    std = math.sqrt(variance)

    t_crit = t_critical(n - 1)
    half_width = t_crit * std / math.sqrt(n)

    return {
        "mean": mean,
        "std": std,
        "ci_low": mean - half_width,
        "ci_high": mean + half_width,
        "half_width": half_width,
        "n": n,
        "t_critical": t_crit,
    }


def check_ci_contains(values, analytical_value, metric_name="metric"):
    """
    Check if the 95% CI from replications contains the analytical value.

    Returns (passed, ci_info_dict).
    """
    ci = compute_ci_95(values)
    passed = ci["ci_low"] <= analytical_value <= ci["ci_high"]

    return passed, {
        "metric": metric_name,
        "analytical": analytical_value,
        "sample_mean": ci["mean"],
        "sample_std": ci["std"],
        "ci_95_low": ci["ci_low"],
        "ci_95_high": ci["ci_high"],
        "half_width": ci["half_width"],
        "n": ci["n"],
        "passed": passed,
        "relative_error_pct": abs(ci["mean"] - analytical_value) / analytical_value * 100
        if analytical_value != 0 else float('inf'),
    }


# ================================================================
# SECTION 4: JSON PARSING
# ================================================================


def extract_metrics(result_json):
    """
    Extract key metrics from SimulationResultV2 JSON.

    Maps DES output fields to queueing theory notation:
      W  = avgTimeInSystemSeconds
      Wq = avgTotalWaitTimeSeconds
      ES = avgProcessingTimeSeconds
      throughput = totalProcessed / virtualTimeSeconds
    """
    overview = result_json.get("overview", {})
    validation = result_json.get("validation", {})
    resources = result_json.get("resources", {})
    buffers = result_json.get("buffers", {})

    # Basic time metrics
    W = overview.get("avgTimeInSystemSeconds", 0)
    Wq = overview.get("avgTotalWaitTimeSeconds", 0)
    ES = overview.get("avgProcessingTimeSeconds", 0)

    # Volume metrics
    total_created = overview.get("totalCreated", 0)
    total_processed = overview.get("totalProcessed", 0)
    total_dropped = overview.get("totalDropped", 0)
    virtual_time = overview.get("virtualTimeSeconds", 1)

    # Resource utilization (first resource)
    stats = resources.get("statistics", [])
    rho_observed = 0.0
    if stats:
        occupancy = stats[0].get("occupancy", {})
        rho_observed = occupancy.get("mean", 0)

    # Little's Law
    littles = validation.get("littlesLaw", {})
    L_observed = littles.get("observedL", 0)

    # Buffer rejection
    P_reject_observed = total_dropped / total_created if total_created > 0 else 0

    # Throughput
    throughput = total_processed / virtual_time if virtual_time > 0 else 0

    return {
        "W": W,
        "Wq": Wq,
        "ES": ES,
        "L": L_observed,
        "rho": rho_observed,
        "total_created": total_created,
        "total_processed": total_processed,
        "total_dropped": total_dropped,
        "P_reject": P_reject_observed,
        "throughput": throughput,
        "virtual_time": virtual_time,
    }


# ================================================================
# SECTION 5: COMPARISON AND REPORTING
# ================================================================


def compare_metric(name, observed, expected, tolerance=0.15):
    """Compare a single metric with tolerance. Returns (passed, info_dict)."""
    if expected == 0:
        abs_err = abs(observed)
        passed = abs_err < tolerance
        rel_err = float('inf') if expected == 0 and observed != 0 else 0
    else:
        abs_err = abs(observed - expected)
        rel_err = abs_err / abs(expected)
        passed = rel_err <= tolerance

    return passed, {
        "metric": name,
        "observed": observed,
        "expected": expected,
        "abs_error": abs_err,
        "rel_error_pct": rel_err * 100,
        "tolerance_pct": tolerance * 100,
        "passed": passed,
    }


def verify_scenario(scenario, result_json, params, tolerance=0.15):
    """
    Verify a single scenario result against analytical formulas.

    Args:
        scenario: one of 'mm1', 'mm1k', 'mmc', 'tandem', 'md1'
        result_json: parsed SimulationResultV2 JSON
        params: dict with scenario parameters (lambda, mu, K, c, etc.)
        tolerance: relative tolerance (default 15%)

    Returns:
        (all_passed, list_of_results)
    """
    metrics = extract_metrics(result_json)
    checks = []

    if scenario == "mm1":
        expected = mm1_analytics(params["lambda"], params["mu"])
        checks.append(compare_metric("W (avg time in system)", metrics["W"], expected["W"], tolerance))
        checks.append(compare_metric("Wq (avg wait time)", metrics["Wq"], expected["Wq"], tolerance))
        checks.append(compare_metric("rho (utilization)", metrics["rho"], expected["rho"], tolerance))

    elif scenario == "mm1k":
        expected = mm1k_analytics(params["lambda"], params["mu"], params["K"])
        checks.append(compare_metric("W (avg time in system)", metrics["W"], expected["W"], tolerance))
        checks.append(compare_metric("P_reject (rejection rate)", metrics["P_reject"], expected["P_reject"], tolerance))

    elif scenario == "mmc":
        expected = mmc_analytics(params["lambda"], params["mu"], params["c"])
        checks.append(compare_metric("W (avg time in system)", metrics["W"], expected["W"], tolerance))
        checks.append(compare_metric("Wq (avg wait time)", metrics["Wq"], expected["Wq"], tolerance))
        checks.append(compare_metric("rho (utilization)", metrics["rho"], expected["rho"], tolerance))

    elif scenario == "tandem":
        expected = tandem_analytics(params["lambda"], params["mu1"], params["mu2"])
        checks.append(compare_metric("W_total (total time in system)", metrics["W"], expected["W_total"], tolerance))

    elif scenario == "md1":
        expected = md1_analytics(params["lambda"], params["mu"])
        checks.append(compare_metric("W (avg time in system)", metrics["W"], expected["W"], tolerance))
        checks.append(compare_metric("Wq (avg wait time)", metrics["Wq"], expected["Wq"], tolerance))

    else:
        raise ValueError(f"Unknown scenario: {scenario}")

    all_passed = all(c[0] for c in checks)
    return all_passed, [c[1] for c in checks]


# ================================================================
# SECTION 6: PRETTY PRINTING
# ================================================================


def print_header(title):
    """Print a section header."""
    width = 70
    print()
    print("=" * width)
    print(f"  {title}")
    print("=" * width)


def print_analytics(scenario, params):
    """Print analytical values for a scenario."""
    if scenario == "mm1":
        a = mm1_analytics(params["lambda"], params["mu"])
        print(f"  rho = {a['rho']:.4f}")
        print(f"  L   = {a['L']:.4f}  (avg customers in system)")
        print(f"  Lq  = {a['Lq']:.4f}  (avg customers in queue)")
        print(f"  W   = {a['W']:.2f}s  (avg time in system)")
        print(f"  Wq  = {a['Wq']:.2f}s  (avg wait time in queue)")

    elif scenario == "mm1k":
        a = mm1k_analytics(params["lambda"], params["mu"], params["K"])
        print(f"  rho     = {a['rho']:.4f}")
        print(f"  K       = {a['K']}")
        print(f"  P_reject= {a['P_reject']:.6f}")
        print(f"  L       = {a['L']:.4f}")
        print(f"  W       = {a['W']:.2f}s")
        print(f"  Wq      = {a['Wq']:.2f}s")
        print(f"  lambda_eff = {a['lambda_eff']:.6f}")

    elif scenario == "mmc":
        a = mmc_analytics(params["lambda"], params["mu"], params["c"])
        print(f"  rho (per server) = {a['rho']:.4f}")
        print(f"  c (servers)      = {a['c']}")
        print(f"  C(c,a) (Erlang C)= {a['C_erlang']:.6f}")
        print(f"  L   = {a['L']:.4f}")
        print(f"  Lq  = {a['Lq']:.4f}")
        print(f"  W   = {a['W']:.2f}s")
        print(f"  Wq  = {a['Wq']:.2f}s")

    elif scenario == "tandem":
        a = tandem_analytics(params["lambda"], params["mu1"], params["mu2"])
        print(f"  rho1 = {a['rho1']:.4f},  rho2 = {a['rho2']:.4f}")
        print(f"  W1   = {a['W1']:.2f}s,  W2 = {a['W2']:.2f}s")
        print(f"  W_total = {a['W_total']:.2f}s")
        print(f"  L_total = {a['L_total']:.4f}")

    elif scenario == "md1":
        a = md1_analytics(params["lambda"], params["mu"])
        print(f"  rho     = {a['rho']:.4f}")
        print(f"  W       = {a['W']:.2f}s")
        print(f"  Wq      = {a['Wq']:.2f}s")
        print(f"  Wq(M/M/1) = {a['Wq_mm1']:.2f}s  (for comparison)")
        print(f"  Wq ratio = {a['Wq_ratio']:.4f}  (should be 0.5)")


def print_verification_results(results):
    """Print a table of verification results."""
    all_pass = True
    print()
    print(f"  {'Metric':<30} {'Observed':>12} {'Expected':>12} {'Error%':>8} {'Status':>8}")
    print(f"  {'-' * 30} {'-' * 12} {'-' * 12} {'-' * 8} {'-' * 8}")

    for r in results:
        status = "PASS" if r["passed"] else "FAIL"
        marker = "  " if r["passed"] else ">>"
        if not r["passed"]:
            all_pass = False
        print(f"{marker}{r['metric']:<30} {r['observed']:>12.4f} {r['expected']:>12.4f} "
              f"{r['rel_error_pct']:>7.1f}% {status:>8}")

    print()
    if all_pass:
        print("  RESULT: ALL CHECKS PASSED")
    else:
        print("  RESULT: SOME CHECKS FAILED")
    return all_pass


def print_ci_results(ci_results):
    """Print confidence interval results."""
    all_pass = True
    print()
    print(f"  {'Metric':<25} {'Analytical':>10} {'Mean':>10} {'CI Low':>10} {'CI High':>10} {'Status':>8}")
    print(f"  {'-' * 25} {'-' * 10} {'-' * 10} {'-' * 10} {'-' * 10} {'-' * 8}")

    for r in ci_results:
        status = "PASS" if r["passed"] else "FAIL"
        if not r["passed"]:
            all_pass = False
        print(f"  {r['metric']:<25} {r['analytical']:>10.2f} {r['sample_mean']:>10.2f} "
              f"{r['ci_95_low']:>10.2f} {r['ci_95_high']:>10.2f} {status:>8}")

    print()
    return all_pass


# ================================================================
# SECTION 7: DEFAULT PARAMETERS
# ================================================================

SERVICE_MEAN = 100.0  # 1/mu = 100 seconds
MU = 1.0 / SERVICE_MEAN


def default_params(scenario, rho=0.7, K=5, c=3, rho2=0.5):
    """Build default parameters for a given scenario."""
    if scenario == "mm1":
        lam = rho * MU
        return {"lambda": lam, "mu": MU}

    elif scenario == "mm1k":
        lam = rho * MU
        return {"lambda": lam, "mu": MU, "K": K}

    elif scenario == "mmc":
        lam = rho * c * MU
        return {"lambda": lam, "mu": MU, "c": c}

    elif scenario == "tandem":
        rho1 = 0.5
        lam = rho1 * MU  # fix rho1 at 0.5
        mu2 = lam / rho2  # vary rho2
        return {"lambda": lam, "mu1": MU, "mu2": mu2}

    elif scenario == "md1":
        lam = rho * MU
        return {"lambda": lam, "mu": MU}

    else:
        raise ValueError(f"Unknown scenario: {scenario}")


# ================================================================
# SECTION 8: MAIN ENTRY POINT
# ================================================================


def cmd_compute_only(scenario, rho=0.7, K=5, c=3, rho2=0.5):
    """Print analytical values without any DES output."""
    params = default_params(scenario, rho=rho, K=K, c=c, rho2=rho2)
    print_header(f"Analytical Values: {scenario.upper()}")
    print(f"  Parameters: {params}")
    print_analytics(scenario, params)


def cmd_verify(scenario, json_path, tolerance=0.15):
    """Verify a single DES output file."""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract parameters from the stored config
    params_data = data.get("params", {})
    result_json = data.get("result", data)  # support both wrapped and raw

    if not params_data:
        print(f"WARNING: No 'params' key in {json_path}, using defaults")
        params_data = default_params(scenario)

    print_header(f"Verification: {scenario.upper()}")
    print(f"  File: {json_path}")
    print(f"  Parameters: {params_data}")
    print()

    print("  --- Analytical Values ---")
    print_analytics(scenario, params_data)

    print()
    print("  --- DES vs Analytical ---")
    passed, results = verify_scenario(scenario, result_json, params_data, tolerance)
    print_verification_results(results)

    return passed


def cmd_sweep(scenario, directory, tolerance=0.15):
    """Verify all sweep files in a directory."""
    print_header(f"Sensitivity Sweep: {scenario.upper()}")
    all_passed = True

    prefix = f"sweep_{scenario}_"
    files = sorted(f for f in os.listdir(directory) if f.endswith('.json') and f.startswith(prefix))
    if not files:
        print(f"  No JSON files matching '{prefix}*' found in {directory}")
        return False

    for fname in files:
        fpath = os.path.join(directory, fname)
        passed = cmd_verify(scenario, fpath, tolerance)
        if not passed:
            all_passed = False

    print_header("Sweep Summary")
    print(f"  Files checked: {len(files)}")
    print(f"  Result: {'ALL PASSED' if all_passed else 'SOME FAILED'}")
    return all_passed


def cmd_ci(scenario, directory):
    """Check multi-replication confidence intervals."""
    print_header(f"Multi-Replication CI: {scenario.upper()}")

    prefix = f"{scenario}_replication_"
    files = sorted(f for f in os.listdir(directory) if f.endswith('.json') and f.startswith(prefix))
    if not files:
        print(f"  No replication files matching '{prefix}*' found in {directory}")
        return False

    # Collect W values from all replications
    W_values = []
    Wq_values = []
    for fname in files:
        fpath = os.path.join(directory, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        result_json = data.get("result", data)
        metrics = extract_metrics(result_json)
        W_values.append(metrics["W"])
        if metrics["Wq"] > 0:
            Wq_values.append(metrics["Wq"])

    # Get analytical values
    params = data.get("params", default_params(scenario))

    if scenario == "mm1":
        expected = mm1_analytics(params["lambda"], params["mu"])
    elif scenario == "mmc":
        expected = mmc_analytics(params["lambda"], params["mu"], params["c"])
    elif scenario == "md1":
        expected = md1_analytics(params["lambda"], params["mu"])
    else:
        print(f"  CI check not implemented for {scenario}")
        return False

    ci_results = []
    passed_W, info_W = check_ci_contains(W_values, expected["W"], "W (time in system)")
    ci_results.append(info_W)

    if Wq_values and "Wq" in expected:
        passed_Wq, info_Wq = check_ci_contains(Wq_values, expected["Wq"], "Wq (wait time)")
        ci_results.append(info_Wq)

    all_passed = print_ci_results(ci_results)
    return all_passed


def print_usage():
    """Print usage information."""
    print(__doc__)


def main():
    args = sys.argv[1:]

    if not args or args[0] in ("-h", "--help"):
        print_usage()
        sys.exit(0)

    if args[0] == "--compute-only":
        scenario = args[1] if len(args) > 1 else "mm1"
        rho = 0.7
        K = 5
        c = 3
        rho2 = 0.5
        i = 2
        while i < len(args):
            if args[i] == "--rho" and i + 1 < len(args):
                rho = float(args[i + 1])
                i += 2
            elif args[i] == "--K" and i + 1 < len(args):
                K = int(args[i + 1])
                i += 2
            elif args[i] == "--c" and i + 1 < len(args):
                c = int(args[i + 1])
                i += 2
            elif args[i] == "--rho2" and i + 1 < len(args):
                rho2 = float(args[i + 1])
                i += 2
            else:
                i += 1
        cmd_compute_only(scenario, rho=rho, K=K, c=c, rho2=rho2)

    elif args[0] == "--sweep":
        scenario = args[1] if len(args) > 1 else "mm1"
        directory = args[2] if len(args) > 2 else "sweep"
        passed = cmd_sweep(scenario, directory)
        sys.exit(0 if passed else 1)

    elif args[0] == "--ci":
        scenario = args[1] if len(args) > 1 else "mm1"
        directory = args[2] if len(args) > 2 else "replications"
        passed = cmd_ci(scenario, directory)
        sys.exit(0 if passed else 1)

    elif args[0] == "--ks":
        json_path = args[1] if len(args) > 1 else "ks_samples.json"
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        samples = data.get("samples", [])
        distribution = data.get("distribution", "exponential")
        if distribution == "deterministic":
            expected_value = data["expected_value"]
            result = ks_test_deterministic(samples, expected_value)
            print_header("Deterministic Consistency Check")
            print(f"  n         = {result['n']}")
            print(f"  max_dev   = {result['max_deviation']:.6f}")
            print(f"  rel_dev   = {result['relative_deviation']:.6f}")
        else:
            rate = data.get("rate", 0.01)
            result = ks_test_exponential(samples, rate)
            print_header("KS Test: Exponential Distribution")
            print(f"  n       = {result['n']}")
            print(f"  D_n     = {result['D']:.6f}")
            print(f"  D_crit  = {result['D_crit']:.6f}")
        print(f"  Result  = {'PASS' if result['passed'] else 'FAIL'}")
        sys.exit(0 if result["passed"] else 1)

    else:
        # Default: verify scenario <scenario> <json_file>
        scenario = args[0]
        json_path = args[1] if len(args) > 1 else f"scenario_{scenario}_output.json"
        tolerance = 0.15
        if "--tolerance" in args:
            idx = args.index("--tolerance")
            if idx + 1 < len(args):
                tolerance = float(args[idx + 1])
        passed = cmd_verify(scenario, json_path, tolerance)
        sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
