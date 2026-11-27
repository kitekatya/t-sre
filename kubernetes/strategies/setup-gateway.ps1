$ErrorActionPreference = 'Stop'
$version = 'v1.10.0'
kubectl apply --server-side -f "https://github.com/envoyproxy/gateway/releases/download/$version/install.yaml"
kubectl wait --timeout=300s -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available
kubectl apply -f "$PSScriptRoot/gateway.yaml"
kubectl get gateway task-eg
kubectl get svc -n envoy-gateway-system
