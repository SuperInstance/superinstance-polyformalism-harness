# quilt-polyvocoder — Cloudflare Worker

> **Polyformalism fleet canary verification, deployed as a Cloudflare Worker.**

The fleet canary `fnv1a-64("café Δ 日本語") = 0x024a555471370b18d` running on
Cloudflare's edge network.

## Endpoints

| Path | Returns |
|---|---|
| `/health` | `"ok"` |
| `/canary` | `"0x024a555471370b18d"` |
| `/v1/features` | JSON 6-dim feature dict |
| `/v1/pipeline` | JSON full pipeline (features + polyformalism metadata) |

## Live URL

After deployment, the worker is reachable at:
- `https://polyvocoder.activeledger.ai/canary` (production)

## Deploy

```bash
ACCT="049ff5e84ecf636b53b162cbb580aae6"
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCT/workers/scripts/quilt-polyvocoder" \
  -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
  -F "metadata={\"main_module\":\"worker.mjs\"};type=application/json" \
  -F "worker.mjs=@worker.mjs;type=application/javascript+module"
```

## License

MIT — Casey / SuperInstance, Sept 23, 2026
