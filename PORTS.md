# Ports — Per-Port Verification

The 7 polyformalism ports, with their individual canary verification commands.

## Port 1: Python (reference)

```bash
cd ../polyvocoder/polyvocoder && python3 canary.py
```

Expected: `✓ Fleet canary verified: 0x024a555471370b18d`

Implementation:
- `canary.py` — 6-line FNV-1a
- Reference for all other ports

## Port 2: TypeScript

```bash
cd ../polyvocoder-bindings && npx -y tsx canary.ts
```

Expected: `fnv1a-64('café Δ 日本語') = 0x24a555471370b18d`

Implementation:
- `canary.ts` — BigInt-based FNV-1a
- Schema-parity types via `serde` aliases

## Port 3: Rust

```bash
cd ../polyvocoder-rust && ./target/release/canary
```

Expected: `fnv1a-64('café Δ 日本語') = 0x24a555471370b18d`

Implementation:
- `src/bin/canary.rs` — native u64 + wrapping_mul
- 5 unit tests in `src/lib.rs`

To rebuild:
```bash
cd ../polyvocoder-rust && cargo build --release
```

## Port 4: Bash

Bash doesn't have native 64-bit math. The verification bridges through Python:

```bash
python3 -c "
s = 'café Δ 日本語'
h = 0xcbf29ce484222325
for b in s.encode('utf-8'):
    h = h ^ b
    h = (h * 0x100000001b3) & 0xffffffffffffffff
print(f'0x{h:016x}')
"
```

Expected: `0x024a555471370b18d`

Sufficient for cron-style verification scripts.

## Port 5: JavaScript ESM

Browser-side, no build step required:

```javascript
const string = 'café Δ 日本語';
const bytes = new TextEncoder().encode(string);
let h = 0xcbf29ce484222325n;
const prime = 0x100000001b3n;
const mask = (1n << 64n) - 1n;
for (const b of bytes) {
  h ^= BigInt(b);
  h = (h * prime) & mask;
}
console.log('0x' + h.toString(16).padStart(16, '0'));
```

Expected: `0x024a555471370b18d`

## Port 6: C#/.NET 9

```bash
cd ../polyvocoder-csharp && dotnet run
```

Expected: `fnv1a-64('café Δ 日本語') = 0x24a555471370b18d`

Implementation:
- `Program.cs` — `Encoding.UTF8.GetBytes()` + `unchecked()` arithmetic
- Cross-platform: Linux, macOS, Windows

## Port 7: SQL (SQLite)

```bash
cd ../polyvocoder-sql && python3 canary.py
```

SQLite has no native 64-bit arithmetic, so the SQL port uses a Python helper
that wraps FNV-1a in SQLite-compatible math identities (XOR via `(a|b)-(a&b)`).

The helper demonstrates that the SQL port's `canon_archive.db` contains
FNV-1a hashes computed via the same algorithm.

## Adding a new port

To add port 8 (Go, Swift, Kotlin, etc.):

```bash
mkdir ../polyvocoder-<lang>
cd ../polyvocoder-<lang>
# Implement fnv1a_64
# Verify the canary hash
# Add a binary/CLI/script that prints "0x..." for the canary string
# Update PORTS.md and verify_canary.sh
```

The polyformalism doctrine applies to **any** deterministic algorithm with
**any** language binding. FNV-1a + UTF-8 + 64-bit unsigned arithmetic is
one example. SHA-256 + JSON + UTF-8 would be another.

