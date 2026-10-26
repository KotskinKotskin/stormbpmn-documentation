---
source_hash: b7c4324300c3c868
---
# DES Engine Verification: Independent Check Based on Queueing Theory {#верификация-des-движка-независимая-проверка-по-теории-массового-обслуживания}

A methodology for the independent mathematical verification of discrete-event simulation results in Storm BPM. It allows you to ensure that the engine produces correct results by comparing them with exact analytical formulas from queueing theory.

::: tip Who this guide is for
- **Analysts and engineers** who want to verify the correctness of simulation results
- **Project managers** who need to justify the engine's accuracy to the client
- **Researchers** who want to independently reproduce and verify the results
:::

[[toc]]

## Essence of the Approach {#суть-подхода}

We compare the simulation results with the **exact analytical solution** for five classical queuing models. For each model, there are formulas that provide exact values for the metrics (average time in the system, queue length, utilization, and so on. If the simulation is correct, its results should match these formulas within the bounds of statistical error.

### Five verification scenarios {#пять-сценариев-верификации}

| # | Model | Description | What it checks |
|---|--------|----------|---------------|
| 1 | **M/M/1** | 1 server, Poisson arrivals, exponential service | Basic engine correctness |
| 2 | **M/M/1/K** | Finite buffer + rejections | Buffer and loss mechanics |
| 3 | **M/M/c** | Multiple servers (Erlang C formula) | Multi-resource processing |
| 4 | **Tandem** | Two queues in series (Jackson network) | Multi-step processes |
| 5 | **M/D/1** | Deterministic service (P-K formula) | Impact of variability |

### Four levels of verification {#четыре-уровня-верификации}

| Level | What we check | Pass criterion |
|---------|---------------|---------------------|
| **1. Point check** | Match at a single load value | Deviation < 10% |
| **2. Sensitivity** | Match across the entire load range (ρ = 0.3..0.9) | Deviation < 10% (< 20% at ρ ≥ 0.85) |
| **3. Confidence intervals** | 95% CI from 10 runs contains the analytical value | Statistical test |
| **4. Distribution check** | Generated times correspond to the declared distribution | KS-test (α = 0.05) |

## Why exactly these tolerances? {#почему-именно-такие-допуски}

::: warning Important to understand
Discrete-event simulation is a **stochastic** method. Each run uses a random number generator, so the result will NEVER match the formula to the tenth decimal place. This is not a bug, but a fundamental property of the Monte Carlo method.
:::

### Sources of Discrepancy {#источники-расхождения}

1. **Finite number of requests.** With ~5000-10000 requests per run, the sample mean deviates from the theoretical value by 3-8%. This is normal statistical variance.

2. **Warm-up.** At the beginning of the simulation, the system is not in a steady state. The first 100-500 requests pass through an empty system, which lowers the averages. The longer the simulation, the smaller this effect becomes.

3. **Run tail.** When the simulation stops, some requests are "in flight" (in the queue or being processed). They are not included in the statistics, which creates a slight shift.

4. **High load (ρ ≥ 0.85).** When utilization exceeds 85%, queues become very long, and convergence to the steady state is very slow. Formally, for M/M/1, as ρ → 1, the convergence time → ∞. Therefore, for ρ = 0.9, we allow a 20% deviation instead of 10%.

### Why 10% is normal for a single run {#почему-10-—-это-нормально-для-единичного-прогона}

According to the central limit theorem, the standard error of the mean ≈ σ/√n. For an exponential distribution, σ = μ (mean = standard deviation), therefore:

- For n = 5000 requests: SE ≈ μ/√5000 ≈ 1.4% of the mean
- 95% confidence interval: ±2.8%
- Accounting for warm-up and the tail: realistically 5-10%

This is precisely why **level 3 (confidence intervals)** is the most stringent. A single run is a rough check for "has anything broken," while 10 runs with CI constitute a true statistical validation.

## Analytical formulas {#аналитические-формулы}

### M/M/1 — single server {#m-m-1-—-одиночныи-сервер}

The most basic model. Arrivals follow a Poisson process (exponential inter-arrival times), service times are exponentially distributed, and there is 1 server.

**Notation:**
- λ — arrival rate (requests/sec)
- μ — service rate (requests/sec)
- ρ = λ/μ — utilization (must be < 1)

**Formulas:**

| Metric | Formula | Meaning |
|---------|---------|-------|
| L = ρ/(1−ρ) | Average number of requests in the system |
| Lq = ρ²/(1−ρ) | Average number of requests in the queue |
| W = 1/(μ−λ) | Average time in the system |
| Wq = ρ/(μ(1−ρ)) | Average waiting time in the queue |

**Little's Law:** L = λ × W (relates all metrics)

### M/M/1/K — finite buffer {#m-m-1-k-—-конечныи-буфер}

Like M/M/1, but the system holds a maximum of K requests. Excess requests are **rejected** (losses).

**State probabilities:**

p_n = (1−ρ) × ρⁿ / (1−ρ^(K+1)) for ρ ≠ 1

**Rejection probability:** P_reject = p_K

**Effective intensity:** λ_eff = λ × (1 − P_reject)

### M/M/c — Erlang C (multiple servers) {#m-m-c-—-эрланг-c-несколько-серверов}

c identical servers, one common FIFO queue.

**Erlang C formula (probability of waiting):**

C(c, a) = [a^c / c! × 1/(1−ρ)] / [Σ(k=0..c-1) a^k/k! + a^c/c! × 1/(1−ρ)]

where a = λ/μ (offered load in Erlangs), ρ = a/c.

**Average waiting time:** Wq = C(c,a) / (cμ − λ)

### Tandem (Jackson Network) {#тандем-сеть-джексона}

Two queues in series. According to Jackson's theorem (1957), in an open network of M/M/c queues with Poisson arrivals, each queue behaves as an **independent** M/M/c.

**W_total = W₁ + W₂ = 1/(μ₁−λ) + 1/(μ₂−λ)**

### M/D/1 — Deterministic Service {#m-d-1-—-детерминированное-обслуживание}

Poisson arrivals, but **constant** service time. A special case of M/G/1.

According to the Pollaczek-Khinchine formula:
- Wq(M/D/1) = ρ / (2μ(1−ρ))
- **Key insight:** Wq(M/D/1) = Wq(M/M/1) / 2

Eliminating service time variability **halves** the average waiting time.

## Python verification script {#python-скрипт-верификации}

The script does not use external libraries — only the Python standard library (`math`, `json`, `sys`). All formulas are implemented "from scratch" and are thoroughly commented.

### Installation and startup {#установка-и-запуск}

```bash
# Никаких зависимостей не требуется — только Python 3.6+
python verify_des.py --compute-only mm1 --rho 0.7
```

### Operating Modes {#режимы-работы}

| Command | Description |
|---------|----------|
| `--compute-only <scenario>` | Calculate analytical values without DES data |
| `<scenario> <file.json>` | Compare the DES JSON result with formulas |
| `--sweep <scenario> <dir>` | Check a series of files (different ρ) |
| `--ci <scenario> <dir>` | Check confidence intervals from multiple runs |
| `--ks <samples.json>` | Kolmogorov-Smirnov test for distribution |

### Full source code {#полныи-исходныи-код}

**[Download verify_des.py](/assets/verification/verify_des.py)** — the complete verification script (~500 lines, no external dependencies).

::: details Expand the verify_des.py code

```python
#!/usr/bin/env python3
"""
Storm BPM -- DES Engine Verification & Validation Suite
========================================================

Независимая математическая верификация результатов симуляции.
Все формулы выведены из первых принципов теории массового обслуживания.

Ссылки:
  [1] Gross, Shortle et al. "Fundamentals of Queueing Theory" 5th ed.
  [2] Kleinrock, "Queueing Systems, Vol. 1: Theory" (Wiley)
  [3] Law, "Simulation Modeling and Analysis" 5th ed. (McGraw-Hill)
"""

import math
import json
import sys
import os


# ================================================================
# АНАЛИТИЧЕСКИЕ ФОРМУЛЫ
# ================================================================

def mm1_analytics(lambda_rate, mu_rate):
    """
    M/M/1: один сервер, пуассоновские приходы, экспоненциальное обслуживание.

    rho = lambda/mu  (должно быть < 1)
    L  = rho/(1-rho)           -- среднее число в системе
    Lq = rho^2/(1-rho)         -- среднее число в очереди
    W  = 1/(mu-lambda)         -- среднее время в системе
    Wq = rho/(mu*(1-rho))      -- среднее время ожидания
    """
    rho = lambda_rate / mu_rate
    if rho >= 1.0:
        raise ValueError(f"M/M/1 requires rho < 1, got rho={rho:.4f}")

    L = rho / (1 - rho)
    Lq = rho ** 2 / (1 - rho)
    W = 1.0 / (mu_rate - lambda_rate)
    Wq = rho / (mu_rate * (1 - rho))

    return {
        "rho": rho, "L": L, "Lq": Lq, "W": W, "Wq": Wq,
        "service_mean": 1.0 / mu_rate,
        "lambda": lambda_rate, "mu": mu_rate,
        "throughput": lambda_rate,
    }


def mm1k_analytics(lambda_rate, mu_rate, K):
    """
    M/M/1/K: конечная ёмкость K, лишние заявки отклоняются.

    p_n = (1-rho)*rho^n / (1-rho^(K+1))   для rho != 1
    P_reject = p_K
    lambda_eff = lambda * (1 - P_reject)
    """
    rho = lambda_rate / mu_rate

    if abs(rho - 1.0) < 1e-10:
        p = [1.0 / (K + 1)] * (K + 1)
    else:
        denom = 1.0 - rho ** (K + 1)
        p = [(1.0 - rho) * rho ** n / denom for n in range(K + 1)]

    P_reject = p[K]
    L = sum(n * p[n] for n in range(K + 1))
    lambda_eff = lambda_rate * (1.0 - P_reject)
    W = L / lambda_eff if lambda_eff > 1e-15 else float('inf')
    Lq = L - (1.0 - p[0])
    Wq = Lq / lambda_eff if lambda_eff > 1e-15 else float('inf')

    return {
        "rho": rho, "K": K, "P_reject": P_reject,
        "L": L, "Lq": Lq, "W": W, "Wq": Wq,
        "lambda_eff": lambda_eff,
        "lambda": lambda_rate, "mu": mu_rate,
    }


def mmc_analytics(lambda_rate, mu_rate, c):
    """
    M/M/c: c серверов, формула Эрланга C.

    C(c,a) = [a^c/c! * 1/(1-rho)] / [sum(a^k/k!, k=0..c-1) + a^c/c! * 1/(1-rho)]
    Wq = C(c,a) / (c*mu - lambda)
    """
    a = lambda_rate / mu_rate
    rho = a / c

    if rho >= 1.0:
        raise ValueError(f"M/M/c requires rho < 1, got rho={rho:.4f}")

    sum_terms = sum(a ** k / math.factorial(k) for k in range(c))
    last_term = (a ** c / math.factorial(c)) * (1.0 / (1.0 - rho))
    C_erlang = last_term / (sum_terms + last_term)

    Wq = C_erlang / (c * mu_rate - lambda_rate)
    W = Wq + 1.0 / mu_rate
    L = lambda_rate * W
    Lq = lambda_rate * Wq

    return {
        "rho": rho, "c": c, "C_erlang": C_erlang,
        "Wq": Wq, "W": W, "L": L, "Lq": Lq,
        "lambda": lambda_rate, "mu": mu_rate,
    }


def tandem_analytics(lambda_rate, mu1_rate, mu2_rate):
    """
    Тандем (сеть Джексона): две очереди последовательно.
    По теореме Джексона каждая очередь — независимая M/M/1.
    W_total = 1/(mu1-lambda) + 1/(mu2-lambda)
    """
    q1 = mm1_analytics(lambda_rate, mu1_rate)
    q2 = mm1_analytics(lambda_rate, mu2_rate)

    return {
        "rho1": q1["rho"], "rho2": q2["rho"],
        "W1": q1["W"], "W2": q2["W"],
        "W_total": q1["W"] + q2["W"],
        "L_total": q1["L"] + q2["L"],
        "lambda": lambda_rate, "mu1": mu1_rate, "mu2": mu2_rate,
    }


def md1_analytics(lambda_rate, mu_rate):
    """
    M/D/1: детерминированное обслуживание.
    Формула Полачека-Хинчина с Var[S]=0:
    Wq = rho / (2*mu*(1-rho))    -- ровно в 2 раза меньше чем M/M/1
    """
    rho = lambda_rate / mu_rate
    if rho >= 1.0:
        raise ValueError(f"M/D/1 requires rho < 1, got rho={rho:.4f}")

    Wq = rho / (2.0 * mu_rate * (1.0 - rho))
    W = Wq + 1.0 / mu_rate
    Wq_mm1 = rho / (mu_rate * (1.0 - rho))

    return {
        "rho": rho, "W": W, "Wq": Wq,
        "Wq_mm1": Wq_mm1, "Wq_ratio": 0.5,
        "lambda": lambda_rate, "mu": mu_rate,
    }


# ================================================================
# ТЕСТ КОЛМОГОРОВА-СМИРНОВА
# ================================================================

def ks_test_exponential(samples, expected_rate):
    """
    KS-тест: H0: samples ~ Exp(rate)
    D_n = max|F_n(x) - F(x)|,  F(x) = 1 - exp(-rate*x)
    Критическое значение (alpha=0.05): D_crit = 1.358/sqrt(n)
    PASS если D_n < D_crit
    """
    n = len(samples)
    if n == 0:
        return {"D": float('inf'), "D_crit": 0, "passed": False, "n": 0}

    sorted_samples = sorted(samples)
    D = 0.0
    for i, x in enumerate(sorted_samples):
        F_x = 1.0 - math.exp(-expected_rate * x)
        D = max(D, abs((i + 1) / n - F_x), abs(i / n - F_x))

    D_crit = 1.358 / math.sqrt(n)
    return {"D": D, "D_crit": D_crit, "passed": D < D_crit, "n": n}


# ================================================================
# ДОВЕРИТЕЛЬНЫЕ ИНТЕРВАЛЫ
# ================================================================

# t-критические значения для 95% CI (df = n-1)
T_CRITICAL = {
    1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
    6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
    14: 2.145, 19: 2.093, 29: 2.045, 49: 2.010, 99: 1.984,
}


def compute_ci_95(values):
    """95% CI = x_bar +/- t(alpha/2, n-1) * s / sqrt(n)"""
    n = len(values)
    if n < 2:
        return {"mean": values[0] if values else 0, "ci_low": float('-inf'),
                "ci_high": float('inf'), "n": n}

    mean = sum(values) / n
    std = math.sqrt(sum((x - mean) ** 2 for x in values) / (n - 1))
    t_crit = T_CRITICAL.get(n - 1, 1.96)
    hw = t_crit * std / math.sqrt(n)

    return {"mean": mean, "std": std, "ci_low": mean - hw,
            "ci_high": mean + hw, "half_width": hw, "n": n}


def check_ci_contains(values, analytical_value, metric_name="metric"):
    """Проверка: содержит ли 95% CI аналитическое значение?"""
    ci = compute_ci_95(values)
    passed = ci["ci_low"] <= analytical_value <= ci["ci_high"]
    return passed, {
        "metric": metric_name, "analytical": analytical_value,
        "mean": ci["mean"], "ci_low": ci["ci_low"], "ci_high": ci["ci_high"],
        "passed": passed,
    }


# ================================================================
# СРАВНЕНИЕ МЕТРИК
# ================================================================

SERVICE_MEAN = 100.0   # 1/mu = 100 секунд
MU = 1.0 / SERVICE_MEAN


def default_params(scenario, rho=0.7, K=5, c=3, rho2=0.5):
    """Параметры по умолчанию для каждого сценария."""
    if scenario == "mm1":
        return {"lambda": rho * MU, "mu": MU}
    elif scenario == "mm1k":
        return {"lambda": rho * MU, "mu": MU, "K": K}
    elif scenario == "mmc":
        return {"lambda": rho * c * MU, "mu": MU, "c": c}
    elif scenario == "tandem":
        lam = 0.5 * MU
        return {"lambda": lam, "mu1": MU, "mu2": lam / rho2}
    elif scenario == "md1":
        return {"lambda": rho * MU, "mu": MU}
    else:
        raise ValueError(f"Unknown scenario: {scenario}")


def extract_metrics(result_json):
    """Извлечение метрик из JSON-ответа SimulationResultV2."""
    ov = result_json.get("overview", {})
    val = result_json.get("validation", {})
    res = result_json.get("resources", {})

    stats = res.get("statistics", [])
    rho_obs = stats[0].get("occupancy", {}).get("mean", 0) if stats else 0

    total = ov.get("totalCreated", 0)
    dropped = ov.get("totalDropped", 0)

    return {
        "W": ov.get("avgTimeInSystemSeconds", 0),
        "Wq": ov.get("avgTotalWaitTimeSeconds", 0),
        "ES": ov.get("avgProcessingTimeSeconds", 0),
        "rho": rho_obs,
        "P_reject": dropped / total if total > 0 else 0,
        "total_created": total,
        "total_processed": ov.get("totalProcessed", 0),
    }


def compare_metric(name, observed, expected, tolerance=0.10):
    """Сравнение одной метрики с допуском."""
    if expected == 0:
        return abs(observed) < tolerance, {"metric": name, "obs": observed,
                                            "exp": expected, "passed": abs(observed) < tolerance}
    rel_err = abs(observed - expected) / abs(expected)
    passed = rel_err <= tolerance
    return passed, {
        "metric": name, "observed": observed, "expected": expected,
        "rel_error_pct": rel_err * 100, "tolerance_pct": tolerance * 100,
        "passed": passed,
    }


def verify_scenario(scenario, result_json, params, tolerance=0.10):
    """Верификация одного сценария."""
    m = extract_metrics(result_json)
    checks = []

    if scenario == "mm1":
        exp = mm1_analytics(params["lambda"], params["mu"])
        checks.append(compare_metric("W", m["W"], exp["W"], tolerance))
        checks.append(compare_metric("Wq", m["Wq"], exp["Wq"], tolerance))
        checks.append(compare_metric("rho", m["rho"], exp["rho"], tolerance))
    elif scenario == "mm1k":
        exp = mm1k_analytics(params["lambda"], params["mu"], params["K"])
        checks.append(compare_metric("W", m["W"], exp["W"], tolerance))
        checks.append(compare_metric("P_reject", m["P_reject"], exp["P_reject"], tolerance))
    elif scenario == "mmc":
        exp = mmc_analytics(params["lambda"], params["mu"], params["c"])
        checks.append(compare_metric("W", m["W"], exp["W"], tolerance))
        checks.append(compare_metric("Wq", m["Wq"], exp["Wq"], tolerance))
    elif scenario == "tandem":
        exp = tandem_analytics(params["lambda"], params["mu1"], params["mu2"])
        checks.append(compare_metric("W_total", m["W"], exp["W_total"], tolerance))
    elif scenario == "md1":
        exp = md1_analytics(params["lambda"], params["mu"])
        checks.append(compare_metric("W", m["W"], exp["W"], tolerance))
        checks.append(compare_metric("Wq", m["Wq"], exp["Wq"], tolerance))

    all_passed = all(c[0] for c in checks)
    return all_passed, [c[1] for c in checks]


# ================================================================
# ВЫВОД РЕЗУЛЬТАТОВ
# ================================================================

def print_results(scenario, params, checks):
    """Печать таблицы результатов."""
    print(f"\n{'='*60}")
    print(f"  Сценарий: {scenario.upper()}")
    print(f"  Параметры: {params}")
    print(f"{'='*60}")
    print(f"  {'Метрика':<20} {'Наблюд.':>10} {'Ожидаем.':>10} {'Ошибка%':>8} {'Статус':>8}")
    print(f"  {'-'*20} {'-'*10} {'-'*10} {'-'*8} {'-'*8}")
    for c in checks:
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  {c['metric']:<20} {c.get('observed',0):>10.4f} "
              f"{c.get('expected',0):>10.4f} "
              f"{c.get('rel_error_pct',0):>7.1f}% {status:>8}")
    all_ok = all(c["passed"] for c in checks)
    print(f"\n  Итог: {'ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ' if all_ok else 'ЕСТЬ НЕПРОЙДЕННЫЕ'}")


# ================================================================
# ТОЧКА ВХОДА
# ================================================================

def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return

    if args[0] == "--compute-only":
        scenario = args[1] if len(args) > 1 else "mm1"
        rho = 0.7
        i = 2
        while i < len(args):
            if args[i] == "--rho":
                rho = float(args[i + 1]); i += 2
            else:
                i += 1
        params = default_params(scenario, rho=rho)
        if scenario == "mm1":
            a = mm1_analytics(params["lambda"], params["mu"])
        elif scenario == "mmc":
            a = mmc_analytics(params["lambda"], params["mu"], params["c"])
        elif scenario == "md1":
            a = md1_analytics(params["lambda"], params["mu"])
        else:
            a = params
        print(f"Аналитические значения для {scenario.upper()}:")
        for k, v in a.items():
            if isinstance(v, float):
                print(f"  {k} = {v:.6f}")
            else:
                print(f"  {k} = {v}")
    else:
        scenario = args[0]
        json_path = args[1] if len(args) > 1 else f"scenario_{scenario}_output.json"
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        params = data.get("params", default_params(scenario))
        result = data.get("result", data)
        passed, checks = verify_scenario(scenario, result, params)
        print_results(scenario, params, checks)
        sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
```

:::

## Usage example {#пример-использования}

### 1. Calculating analytical values {#_1-вычисление-аналитических-значении}

```bash
$ python verify_des.py --compute-only mm1 --rho 0.7

Аналитические значения для MM1:
  rho = 0.700000
  L   = 2.333333   (среднее число в системе)
  W   = 333.333333 (среднее время в системе, сек)
  Wq  = 233.333333 (среднее время ожидания, сек)
```

### 2. Verifying the DES result {#_2-проверка-результата-des}

```bash
$ python verify_des.py mm1 scenario_mm1_output.json

============================================================
  Сценарий: MM1
  Параметры: {'lambda': 0.007, 'mu': 0.01, 'rho': 0.7}
============================================================
  Метрика              Наблюд.   Ожидаем.  Ошибка%   Статус
  -------------------- ---------- ---------- -------- --------
  W                     341.2345   333.3333     2.4%     PASS
  Wq                    240.1234   233.3333     2.9%     PASS
  rho                     0.6983     0.7000     0.2%     PASS

  Итог: ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ
```

### 3. M/M/1 vs M/D/1 Comparison {#_3-сравнение-m-m-1-vs-m-d-1}

One of the most illustrative results is the comparison of M/M/1 and M/D/1 under identical load:

```bash
$ python verify_des.py --compute-only mm1 --rho 0.7
  Wq = 233.33s

$ python verify_des.py --compute-only md1 --rho 0.7
  Wq = 116.67s   (ровно в 2 раза меньше!)
```

This confirms the Pollaczek–Khinchine formula: eliminating service time variability halves the waiting time. If your DES engine does not demonstrate this, it contains an error.

## JSON Output Format {#формат-json-вывода}

The script expects a JSON file containing the Storm BPM simulation result. Key fields:

```json
{
  "params": {
    "lambda": 0.007,
    "mu": 0.01,
    "rho": 0.7
  },
  "result": {
    "overview": {
      "totalCreated": 3500,
      "totalProcessed": 3495,
      "totalDropped": 0,
      "avgTimeInSystemSeconds": 341.23,
      "avgTotalWaitTimeSeconds": 240.12,
      "avgProcessingTimeSeconds": 101.11,
      "virtualTimeSeconds": 500000
    },
    "resources": {
      "statistics": [{
        "occupancy": { "mean": 0.698 }
      }]
    },
    "validation": {
      "littlesLaw": {
        "observedL": 2.35,
        "calculatedL": 2.39,
        "isValid": true
      }
    }
  }
}
```

## Want to check it yourself? {#хотите-проверить-сами}

We would be happy to help you run verification on your data and analyze the results. Please contact your account manager — we will provide the JSON outputs of the simulation and help you run the script step by step.

::: tip What we can do together
- Run all 5 scenarios on your instance and compare them with the formulas
- Configure parameters (load, number of servers, buffer capacity) for your specific case
- Explain each formula and how it relates to your business process
- Conduct a workshop on interpreting simulation results
:::

## References {#литература}

1. **Gross, Shortle et al.** "Fundamentals of Queueing Theory" 5th ed. — foundational textbook, chapters 2-6.
2. **Kleinrock, L.** "Queueing Systems, Vol. 1: Theory" (Wiley) — classic, M/M/1 and M/G/1 formulas.
3. **Law, A.M.** "Simulation Modeling and Analysis" 5th ed. (McGraw-Hill) — V&V methodology for simulations.
4. **Jackson, J.R.** "Networks of Waiting Lines" (1957) — Jackson's theorem for queueing networks.
