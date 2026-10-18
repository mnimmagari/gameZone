// Cloudflare Worker proxy for Google Cloud Text-to-Speech.
// Set GOOGLE_TTS_API_KEY as a Worker secret. Never put the key in index.html.
// Configure the Worker route/URL in index.html as GOOGLE_TTS_WORKER_URL.
const ALLOWED_ORIGIN = "https://mnimmagari.github.io";
const VOICE_NAME = "en-IN-Chirp3-HD-Despina";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (origin !== ALLOWED_ORIGIN) {
      return new Response("Origin not allowed", { status: 403 });
    }
    if (request.method !== "POST") {
      return new Response("Use POST", { status: 405, headers: cors });
    }
    if (!env.GOOGLE_TTS_API_KEY) {
      return new Response("Google TTS is not configured on the Worker", {
        status: 503, headers: cors
      });
    }

    try {
      const body = await request.json();
      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text || text.length > 1000) {
        return new Response("Text must be between 1 and 1000 characters", {
          status: 400, headers: cors
        });
      }

      const response = await fetch(
        "https://texttospeech.googleapis.com/v1/text:synthesize?key=" +
          encodeURIComponent(env.GOOGLE_TTS_API_KEY),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: "en-IN",
              name: VOICE_NAME
            },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: 1.0,
              pitch: 1.0,
              volumeGainDb: 1.0
            }
          })
        }
      );

      if (!response.ok) {
        const detail = await response.text();
        return new Response("Google TTS request failed: " + detail.slice(0, 500), {
          status: 502, headers: cors
        });
      }
      const result = await response.json();
      if (!result.audioContent) {
        return new Response("Google TTS returned no audio", {
          status: 502, headers: cors
        });
      }

      const binary = Uint8Array.from(atob(result.audioContent), c => c.charCodeAt(0));
      return new Response(binary, {
        status: 200,
        headers: {
          ...cors,
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      });
    } catch (error) {
      return new Response("Unable to synthesize speech", {
        status: 500, headers: cors
      });
    }
  }
};
