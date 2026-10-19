{{/*
Expand the name of the chart.
*/}}
{{- define "stormbpmn.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
Truncated at 63 chars (DNS naming spec).
If release name contains chart name it is used as a full name.
*/}}
{{- define "stormbpmn.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Chart name + version (used as helm.sh/chart label).
*/}}
{{- define "stormbpmn.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels (applied to every resource).
*/}}
{{- define "stormbpmn.labels" -}}
helm.sh/chart: {{ include "stormbpmn.chart" . }}
{{ include "stormbpmn.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: stormbpmn
{{- end }}

{{/*
Selector labels (must remain stable across upgrades — do NOT add chart version here).
*/}}
{{- define "stormbpmn.selectorLabels" -}}
app.kubernetes.io/name: {{ include "stormbpmn.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
ServiceAccount name.
*/}}
{{- define "stormbpmn.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "stormbpmn.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Full image reference: <registry>/<repository>:<tag>
Falls back to .Chart.AppVersion when image.tag is empty.
*/}}
{{- define "stormbpmn.image" -}}
{{- $registry := .Values.image.registry -}}
{{- $repository := .Values.image.repository -}}
{{- $tag := default .Chart.AppVersion .Values.image.tag -}}
{{- if $registry -}}
{{- printf "%s/%s:%s" $registry $repository $tag -}}
{{- else -}}
{{- printf "%s:%s" $repository $tag -}}
{{- end -}}
{{- end }}

{{/*
Name of the Secret with sensitive ENV (either created by the chart, or referenced via existingSecret).
*/}}
{{- define "stormbpmn.secretName" -}}
{{- if .Values.existingSecret -}}
{{- .Values.existingSecret -}}
{{- else -}}
{{- printf "%s-secret" (include "stormbpmn.fullname" .) -}}
{{- end -}}
{{- end }}

{{/*
Name of the ConfigMap with public ENV.
*/}}
{{- define "stormbpmn.configMapName" -}}
{{- printf "%s-config" (include "stormbpmn.fullname" .) -}}
{{- end }}

{{/*
storm-des: имя ресурсов, selector-лейблы и образ (registry и tag по умолчанию — как у приложения).
*/}}
{{- define "stormbpmn.desName" -}}
{{- printf "%s-des" (include "stormbpmn.fullname" . | trunc 59 | trimSuffix "-") -}}
{{- end }}

{{- define "stormbpmn.desSelectorLabels" -}}
app.kubernetes.io/name: {{ include "stormbpmn.name" . }}-des
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "stormbpmn.desImage" -}}
{{- $registry := default .Values.image.registry .Values.des.image.registry -}}
{{- $tag := default .Chart.AppVersion .Values.des.image.tag -}}
{{- if $registry -}}
{{- printf "%s/%s:%s" $registry .Values.des.image.repository $tag -}}
{{- else -}}
{{- printf "%s:%s" .Values.des.image.repository $tag -}}
{{- end -}}
{{- end }}
