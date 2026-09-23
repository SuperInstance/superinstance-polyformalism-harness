# Contributing a New Port

## The contract

Adding a new port means:

1. You can compute `fnv1a-64("café Δ 日本語") = 0x024a555471370b18d` byte-exactly
2. You can produce a JSON output that matches the [POLYFORMALISM schema](https://github.com/SuperInstance/polyvocoder-bindings/blob/main/docs/POLYFORMALISM.md)
3. Your port is reproducible from your source tree

That's it. There is no formal review process. The polyformalism doctrine is
self-enforcing: if your port passes `verify_canary.sh`, it's a port.

## Step 1: Create the repo

```bash
mkdir superinstance-polyvocoder-<lang>
cd superinstance-polyvocoder-<lang>
git init
```

The repo name should follow the convention `superinstance-polyvocoder-<lang>`
where `<lang>` is one of: `python`, `typescript`, `rust`, `csharp`, `sql`,
`go`, `swift`, `kotlin`, `haskell`, `elixir`, etc.

## Step 2: Implement FNV-1a 64

```python
# Python reference
def fnv1a_64(s: str) -> int:
    h = 0xcbf29ce484222325
    for b in s.encode("utf-8"):
        h = h ^ b
        h = (h * 0x100000001b3) & 0xffffffffffffffff
    return h
```

This is the canonical algorithm. Your implementation must produce
`fnv1a_64("café Δ 日本語") == 0x024a555471370b18d`.

## Step 3: Add a CLI

Your port should produce a CLI that prints the canary hash:

```
$ python3 canary.py
0x024a555471370b18d
```

The CLI should:

1. Accept no arguments
2. Compute FNV-1a-64 of the canary string
3. Print the hash in `0x` + 16-hex-digit format
4. Exit 0 on success, 1 on failure (and print the failure mode)

## Step 4: Add documentation

Your repo needs:

- `README.md` (overview)
- `A2A_GUIDE.md` (how other agents integrate with your port)
- `FLEET_CANARY.md` (the canary verification for your port)
- `TROUBLESHOOTING.md` (common issues)
- `LICENSE` (MIT)
- `CANON.md` (24-line stub per the fleet canon contract)

## Step 5: Add to verify_canary.sh

Add a section to `/workspace/research/scripts/verify_canary.sh`:

```bash
# Port 8: Go
if [ -x "$ROOT/polyvocoder-go/canary" ]; then
  GO_OUT=$("$ROOT/polyvocoder-go/canary")
  check_port "Go         " "$GO_OUT"
fi
```

The `check_port` function does the byte-exact comparison.

## Step 6: Push to GitHub

Create the repo via the GitHub API:

```bash
curl -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
  -d '{"name":"polyvocoder-go","description":"Go polyformalism port"}' \
  https://api.github.com/user/repos
```

Then push:

```bash
git remote add origin https://github.com/SuperInstance/polyvocoder-go.git
git push -u origin main
```

## Step 7: Update the fleet map

Add a row to `/workspace/repos/superinstance-polyformalism-harness/PORTS.md`
for your new port. Include:

- Language
- Build command
- Run command
- Path to the repo

## Step 8: Run the verifier

```bash
bash /workspace/research/scripts/verify_canary.sh
```

All 8 ports must agree. If yours doesn't, fix it before merging.

## The 8th port — Go

The most-requested next port is Go. Go has:

- Native 64-bit unsigned integers (`uint64`)
- Built-in `encoding/binary` for byte operations
- `[]byte(string)` for UTF-8 conversion
- Easy cross-compilation

Estimated port size: ~30 lines of Go.

## The 9th port — Swift

For iOS/macOS deployment. Swift has:

- `UInt64` for unsigned 64-bit arithmetic
- `Data(string.utf8)` for UTF-8 conversion
- `wrappingMultiply` for overflow

Estimated port size: ~25 lines of Swift.

## The 10th port — Kotlin

For Android/JVM deployment. Kotlin has:

- `ULong` for unsigned 64-bit
- `String.toByteArray(Charsets.UTF_8)` for UTF-8
- Manual modulo for overflow (Kotlin doesn't have wrapping unsigned by default)

Estimated port size: ~30 lines of Kotlin.

## Beyond

The polyformalism doctrine applies to any deterministic algorithm. After
the 10th port, consider:

- **Haskell** — type-safe canary verification with no runtime errors
- **Elixir** — distributed canary across BEAM nodes
- **Zig** — explicit memory layout for the canary
- **WebAssembly** — canary as a portable module

The canary is the witness. The ports are the witnesses of the witness.

