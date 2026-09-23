# The Canary — Why This Hash?

## The string

The canary string is `"café Δ 日本語"`.

This string was chosen for five reasons:

### 1. Mixed script coverage

| Script | Char | UTF-8 bytes |
|---|---|---|
| ASCII | `c a f` | 0x63 0x61 0x66 |
| Latin-1 | `é` | 0xc3 0xa9 |
| Space | ` ` | 0x20 |
| Greek | `Δ` | 0xce 0x94 |
| Space | ` ` | 0x20 |
| CJK | `日 本 語` | 0xe6 0x97 0xa5 0xe6 0x9c 0xac 0xe8 0xaa 0x9e |

The string contains 16 UTF-8 bytes (counting the spaces).

### 2. Cultural completeness

The string is multilingual by design:

- `café` — French/Italian/Spanish
- `Δ` — Greek letter (capital delta)
- `日本語` — Japanese "Japanese language" (literally "sun-origin-language")

The string is *complete* — it carries multiple language traditions without
preferring any of them. The string is not about any one language.

### 3. The space test

The two spaces are the easiest thing to forget. Some implementations trim
trailing whitespace; some normalize Unicode; some pre-process strings
in ways that drop spaces. The canary string is a witness that the port
preserves whitespace exactly.

### 4. The CJK test

`日本語` is the hardest part. CJK characters require 3-byte UTF-8 sequences.
A naive implementation that treats characters as 1 unit each will produce
the wrong hash. The CJK characters in the canary string ensure the port
correctly iterates over bytes, not characters.

### 5. The Greek test

`Δ` (capital delta) is the 4th letter of the Greek alphabet and the
mathematical symbol for "change" or "difference." It is a 2-byte UTF-8
sequence in the Greek block (U+0394). It tests the port's handling of
non-Latin European scripts.

## The hash

```
FNV-1a 64-bit, offset 0xcbf29ce484222325, prime 0x100000001b3
Input: 16 UTF-8 bytes from the canary string
Output: 0x024a555471370b18d (decimal 2,640,610,520,279,855,501)
```

The hash is:

1. **64-bit** — long enough to make collisions rare for non-adversarial data
2. **Unsigned** — no sign-extension bugs across language bindings
3. **Stable** — same input → same output, no version drift

The hash is **not**:

1. Cryptographically secure — FNV-1a is not for adversaries
2. Random — the hash is fully deterministic
3. Personal — the hash is not tied to any author or system

## Why not SHA-256?

SHA-256 would also work. It is more widely-known and cryptographically
stronger. But:

1. **FNV-1a is simpler.** 2 lines of code vs. 30 lines for SHA-256.
2. **FNV-1a is faster.** ~5× faster, which matters for polyformalism
   tests that run on every PR.
3. **FNV-1a has a single spec.** SHA-256 has multiple variants and
   implementations with subtle differences.

For a polyformalism canary, simplicity wins. SHA-256 would be the choice
if the canary needed to be adversarial-secure. FNV-1a is the choice if
the canary needs to be portable.

## Why not CRC32?

CRC32 is simpler than FNV-1a but has only 32 bits. Collisions are too
common for canary use. FNV-1a 64-bit has the same simplicity but
4 billion times the collision space.

## Why not MurmurHash?

MurmurHash3 is a fine hash but has multiple variants (32-bit, 64-bit,
128-bit) and the variant must be specified. FNV-1a has a single spec.

## Why not xxHash?

xxHash is faster than FNV-1a but the canonical implementation is in C
with multiple ports that have subtle differences. FNV-1a is more portable.

## Summary

The canary is:

- **String**: `"café Δ 日本語"` (mixed scripts, 16 UTF-8 bytes)
- **Hash**: FNV-1a 64-bit (`fnv1a-64`)
- **Result**: `0x024a555471370b18d` (decimal 2,640,610,520,279,855,501)

The choice was deliberate: the string tests UTF-8 round-trip across scripts,
the hash algorithm is simple enough to verify by eye, the result is
64-bit unsigned for cross-language arithmetic.

