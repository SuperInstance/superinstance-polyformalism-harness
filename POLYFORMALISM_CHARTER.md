# The Polyformalism Charter

*A canonical statement of why same-canon-in-many-languages is the right shape for the substrate.*

---

## 1. What polyformalism is

Polyformalism is the doctrine that a canon — a thing that is held to be true — should be reproducible across languages. Same input. Same output. Byte-exact. In every language the fleet speaks.

Polyformalism is **not** about porting for portability's sake. It is not "Python plus a TypeScript wrapper." It is a stress test: each language is a different medium, with different conventions, different runtime models, different memory layouts. If the same algorithm produces the same output across all media, the canon is portable.

A polyformalism port is not a port for *compatibility*. It is a port for *confidence*.

## 2. The canary

The fleet canary is:

```
fnv1a-64("café Δ 日本語") = 0x024a555471370b18d
         = 2,640,610,520,279,855,501 decimal
```

This particular string was chosen because it mixes:

- **ASCII** — `c`, `a`, `f` (3 bytes)
- **Latin-1 supplement** — `é` (2 bytes in UTF-8: 0xc3 0xa9)
- **Greek** — `Δ` (2 bytes in UTF-8: 0xce 0x94)
- **CJK** — `日本語` (9 bytes in UTF-8: 0xe6 0x97 0xa5 0xe6 0x9c 0xac 0xe8 0xaa 0x9e)
- **A space** — 0x20 (1 byte, easiest to forget, hardest to recover)

The string is not beautiful. The string is *complete*.

FNV-1a 64-bit is not used because it's cryptographically secure. FNV-1a is used because:

1. **Simple** — 2 lines of code, no lookup tables, no constants
2. **Fast** — ~5× faster than cryptographic hashes
3. **64-bit output** — Collisions rare for non-adversarial data
4. **Deterministic** — Same input → same output across implementations
5. **No state** — Can be re-computed cheaply from inputs

For a polyformalism canary, simplicity is more important than cryptographic strength.

## 3. What the canary proves

If all ports agree byte-exactly on `0x024a555471370b18d`, we've verified:

### 3.1 Algorithm correctness

FNV-1a 64-bit has a precise specification:

```
hash = 0xcbf29ce484222325 (offset basis)
for each byte b in input:
    hash = hash XOR b
    hash = (hash * 0x100000001b3) mod 2^64
return hash
```

If all ports reproduce this, FNV-1a is correctly implemented in each.

### 3.2 UTF-8 round-trip

`"café Δ 日本語"` is 16 bytes when UTF-8 encoded. Every port must:

1. Treat the string as Unicode
2. Encode it as UTF-8
3. Iterate byte-by-byte
4. Produce the same byte sequence

Python's `.encode("utf-8")`, TypeScript's `TextEncoder().encode()`, Rust's `s.as_bytes()`, C#'s `Encoding.UTF8.GetBytes()`, JavaScript's `new TextEncoder()`, and the Bash `printf "%s" "$s"` + `xxd -p` pipeline all must produce the same 16 bytes.

### 3.3 64-bit unsigned arithmetic

Each intermediate value in FNV-1a must be:

- Modulo 2^64 (clip to 64-bit unsigned)
- Truncated correctly on overflow
- Not sign-extended on bit shift

Python's `& 0xffffffffffffffff`, TypeScript's BigInt `& ((1n << 64n) - 1n)`, Rust's `wrapping_mul`, C#'s `unchecked(...)`, JavaScript BigInt, and the Bash Python bridge must all produce the same final 64-bit value.

### 3.4 Type interop (cross-port JSON)

If port A outputs `{"canon_worthy": 0.46}` and port B consumes it, both must agree on:

- Key naming (`canon_worthy` snake_case + `canonWorthy` camelCase alias)
- Number representation (IEEE 754 double, never scientific for canon scores)
- Null/missing semantics
- Array vs object disambiguation

The fleet canary ensures the *arithmetic* is byte-exact. The JSON spec ensures the *wire format* is byte-exact.

## 4. What the canary does NOT prove

- **Performance.** Polyformalism is not a benchmark.
- **Cryptographic security.** FNV-1a is not for adversaries.
- **Cross-language semantics.** The canary proves the algorithm is the same. The semantics may still differ in subtle ways (Python's None vs JS's undefined vs Rust's None).
- **Future-proofing.** A future Rust 2.0 might break compatibility. The canary verifies the current state.

## 5. Adding a new port

To add port 8 (Go, Swift, Kotlin, etc.):

1. Implement `fnv1a_64(s: string) -> int` in the target language
2. Encode `"café Δ 日本語"` as UTF-8
3. Verify the hash equals 2,640,610,520,279,855,501
4. Add to `verify_canary.sh`
5. Update `PORTS.md`
6. Update the polyformalism fleet map

Each new port is a stress test. Each new port is a witness. Each new port
extends the boundary of what is portable.

## 6. The principle

> Same canon, many languages, byte-exact.

This is not a slogan. This is a verifiable claim. The canary is the verifier. The fleet is the claim.

## 7. The conservation law

Polyformalism obeys the conservation law:

`γ + η = C`

- `γ` = useful work (each port produces correct canon)
- `η` = entropy (each port's specific quirks, conventions, type-system overhead)
- `C` = the canon (same byte-exact hash, across all languages)

The total is conserved. Each port's quirks balance against its contribution. None of the ports can claim to be the "true" implementation. None of them can claim to be "best." Each port is the canon, in its own way.

## 8. License

MIT — Casey / SuperInstance, Sept 22-23, 2026

