/**
 * quilt-polyvocoder — CF Worker
 * 
 * Endpoints:
 *   GET /health      → "ok"
 *   GET /canary      → "0x024a555471370b18d"
 *   GET /v1/features → JSON 6-dim feature dict
 *   GET /v1/pipeline → JSON full pipeline
 */

function fnv1a64(s) {
  const bytes = new TextEncoder().encode(s);
  let h = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = (1n << 64n) - 1n;
  for (const b of bytes) {
    h ^= BigInt(b);
    h = (h * prime) & mask;
  }
  return h;
}

const EXPECTED_CANARY = 0x024a555471370b18dn;
const CANARY_STRING = "café Δ 日本語";

function canary() {
  return "0x" + fnv1a64(CANARY_STRING).toString(16).padStart(16, "0");
}

function features() {
  const seed = fnv1a64(CANARY_STRING);
  const features = {
    canon_worthy: 0.46 + (Number(seed & 0xffn) / 255) * 0.1,
    distinct_voice: 0.4 + (Number(seed & 0xff00n) / 65535) * 0.1,
    doctrine_anchor: 0.5 + (Number(seed & 0xff0000n) / 16777215) * 0.1,
    voice: ["cells_are_scars", "witness_log_is_prediction", "oracle_is_heard", "canon_gate_is_chord", "substrate_quantum"][Number(seed & 0xfn)],
    seed: "0x" + seed.toString(16).padStart(16, "0"),
  };
  return features;
}

function pipeline() {
  return {
    canary: canary(),
    features: features(),
    timestamp: new Date().toISOString(),
    substrate: "quilt-polyvocoder-cf-worker",
    polyformalism: {
      canary_string: CANARY_STRING,
      canary_hex: EXPECTED_CANARY.toString(16).padStart(16, "0"),
      verified: fnv1a64(CANARY_STRING) === EXPECTED_CANARY,
    },
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (path === "/health") {
      return new Response("ok", { headers: { ...corsHeaders, "content-type": "text/plain" } });
    }
    
    if (path === "/canary") {
      return new Response(canary(), { headers: { ...corsHeaders, "content-type": "text/plain" } });
    }
    
    if (path === "/v1/features") {
      return new Response(JSON.stringify(features()), {
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }
    
    if (path === "/v1/pipeline") {
      return new Response(JSON.stringify(pipeline()), {
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }
    
    return new Response("Quilt Polyvocoder Worker\n\nEndpoints:\n  /health\n  /canary\n  /v1/features\n  /v1/pipeline\n", {
      headers: { ...corsHeaders, "content-type": "text/plain" }
    });
  }
};
