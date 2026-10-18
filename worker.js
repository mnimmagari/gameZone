const ALLOWED_ORIGINS = [
  "https://mnimmagari.github.io",
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];
const VOICE_NAME = "en-IN-Chirp3-HD-Despina";
const MAX_CHARS = 1000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const originAllowed = ALLOWED_ORIGINS.includes(origin);

    const corsHeaders = {
      "Access-Control-Allow-Origin": originAllowed ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };

    const text = (body, status, extra = {}) =>
      new Response(body, {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          ...extra,
        },
      });

    // Health check: open the Worker URL in a browser to confirm this code is live.
    if (request.method === "GET") {
      return text('TTS Worker is running. Send a POST with {"text": "..."}', 200);
    }

    // Preflight
    if (request.method === "OPTIONS") {
      if (!originAllowed) return text("Origin not allowed", 403);
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only POST beyond this point
    if (request.method !== "POST") {
      return text("Use POST", 405, { Allow: "GET, POST, OPTIONS" });
    }

    // Origin check
    if (!originAllowed) {
      return text("Origin not allowed", 403);
    }

    // Secret check
    if (!env.GOOGLE_TTS_API_KEY) {
      return text("Missing GOOGLE_TTS_API_KEY secret", 503);
    }

    try {
      // Validate input
      let body;
      try {
        body = await request.json();
      } catch {
        return text("Request body must be valid JSON", 400);
      }

      const input = typeof body?.text === "string" ? body.text.trim() : "";
      if (!input || input.length > MAX_CHARS) {
        return text(`Text must contain 1 to ${MAX_CHARS} characters`, 400);
      }

      // Call Google Cloud Text-to-Speech
      const googleResponse = await fetch(
        "https://texttospeech.googleapis.com/v1/text:synthesize?key=" +
          encodeURIComponent(env.GOOGLE_TTS_API_KEY),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text: input },
            voice: { languageCode: "en-IN", name: VOICE_NAME },
            audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
          }),
        }
      );

      if (!googleResponse.ok) {
        const details = await googleResponse.text();
        return text("Google TTS request failed: " + details, 502);
      }

      const result = await googleResponse.json();
      if (!result.audioContent) {
        return text("Google TTS returned no audio", 502);
      }

      // Decode base64 MP3
      const binary = Uint8Array.from(atob(result.audioContent), (c) =>
        c.charCodeAt(0)
      );

      // Return audio
      return new Response(binary, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      return text(
        "Unable to synthesize speech: " + (error?.message || "Unknown error"),
        500
      );
    }
  },
};
