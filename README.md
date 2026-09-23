# superinstance-polyformalism-harness

> **Unified harness for the 7-port polyformalism fleet.**
> The same canon, byte-exact, in seven languages.

## TL;DR

```bash
bash verify_canary.sh
```

Output (all 7 ports must agree):
```
Python     : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
TypeScript : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
Rust       : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
JS ESM     : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
C#/.NET    : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
Bash (py)  : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
SQL/SQLite : ✓ 0x24a555471370b18d (decimal 2640610520279855501)
✅ All ports pass the canary
```

The canary hash is `fnv1a-64("café Δ 日本語")`.

## What this is

This repository unifies 7 polyformalism ports of the Quilt substrate walker
canon discovery system into a single byte-exact canary verification harness.

Polyformalism is the doctrine that a canon should be reproducible across
languages. The fleet canary — `fnv1a-64("café Δ 日本語") = 0x024a555471370b18d` —
is the witness of that doctrine. All ports must reproduce this hash byte-exactly.

If 7 ports produce the same hash for the same input, we've verified:

1. **Algorithm correctness** — FNV-1a 64-bit is implemented correctly in all 7 ports
2. **UTF-8 round-trip** — All 7 ports encode the same string as the same byte sequence
3. **64-bit arithmetic** — All 7 ports clip at the 2^64 boundary the same way
4. **Type interop** — JSON serialization is consistent across languages

## The 7 ports

| # | Language | Repo | Description |
|---|---|---|---|
| 1 | **Python** | [polyvocoder](../polyvocoder) | Reference. FNV-1a in 6 lines. Tiny VAE, 3 modality heads, HTTP server. |
| 2 | **TypeScript** | [polyvocoder-bindings](../polyvocoder-bindings) | Schema-parity types. BigInt for 64-bit. Browser/Node. |
| 3 | **Rust** | [polyvocoder-rust](../polyvocoder-rust) | Native u64 + wrapping_mul. 5 unit tests. WASM-ready. |
| 4 | **Bash** | [scripts/verify_canary.sh](scripts/verify_canary.sh) | Cron-friendly. Python bridge for the arithmetic. |
| 5 | **JavaScript ESM** | (inline) | Browser-side. TextEncoder, no build step. |
| 6 | **C#/.NET 9** | [polyvocoder-csharp](../polyvocoder-csharp) | Encoding.UTF8.GetBytes, `unchecked()`. Cross-platform. |
| 7 | **SQL (SQLite)** | [polyvocoder-sql](../polyvocoder-sql) | In-database canon lookups. 145 cells in canon_archive.db. |

## What this is NOT

- It is not a package. The ports are separate repos.
- It is not a framework. Each port is a standalone implementation.
- It is not a benchmark. The canary verifies byte-exact match, not performance.

It IS the witness for the polyformalism fleet. It IS the trust anchor
that lets the rest of the canon claim byte-exact behavior.

## The cross-port doctrine

Each port must:

1. Encode `"café Δ 日本語"` as UTF-8 (mixed ASCII, Latin-1, Greek, CJK)
2. Compute FNV-1a 64-bit hash with offset `0xcbf29ce484222325` and prime `0x100000001b3`
3. Clip to 64-bit unsigned at every operation
4. Produce `0x024a555471370b18d` (= 2,640,610,520,279,855,501 decimal)

If any port fails, the entire polyformalism fleet's byte-exact claim is broken.
Run the verifier on every PR to maintain the canonical witness.

## Documentation

| Doc | Purpose |
|---|---|
| [README.md](README.md) | Overview, quick start, doc index |
| [POLYFORMALISM_CHARTER.md](POLYFORMALISM_CHARTER.md) | The polyformalism doctrine, canonically |
| [PORTS.md](PORTS.md) | Per-port verification, builds, run commands |
| [CANARY.md](CANARY.md) | Why this hash? Why this string? |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Adding a new port |
| [verify_canary.sh](scripts/verify_canary.sh) | Run all 7 ports, report byte-exact match |

## Layered navigation

| Layer | Where |
|---|---|
| **CANON.md stub** | [CANON.md](CANON.md) — what this repo is, in 24 lines |
| **README** | [README.md](README.md) — quick-start, navigation |
| **Charter** | [POLYFORMALISM_CHARTER.md](POLYFORMALISM_CHARTER.md) — the doctrine |
| **Ports** | [PORTS.md](PORTS.md) — per-port reference |
| **Canary** | [CANARY.md](CANARY.md) — the hash and the string |
| **Contributing** | [CONTRIBUTING.md](CONTRIBUTING.md) — adding port 8+ |

## Quick verification

```bash
# From repo root
bash scripts/verify_canary.sh

# Or from any port
cd ../polyvocoder/polyvocoder && python3 canary.py
cd ../polyvocoder-rust && ./target/release/canary
cd ../polyvocoder-csharp && dotnet run
```

## License

MIT — Casey / SuperInstance, Sept 22-23, 2026
