
const ALLOWED_ORIGIN = "https://mnimmagari.github.io";
const VOICE_NAME = "en-IN-Chirp3-HD-Despina";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    // 1. Handle browser preflight FIRST.
    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) {
        return new Response(null, { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // 2. Allow requests only from the MathStars site.
    if (origin !== ALLOWED_ORIGIN) {
      return new Response("Origin not allowed", {
        status: 403
      });
    }

    // 3. Accept POST requests only.
    if (request.method !== "POST") {
      return new Response("Use POST", {
        status: 405,
        headers: corsHeaders
      });
    }

    // 4. Check the Cloudflare secret.
    if (!env.GOOGLE_TTS_API_KEY) {
      return new Response(
        "Missing GOOGLE_TTS_API_KEY secret",
        { status: 503, headers: corsHeaders }
      );
    }

    try {
      // 5. Read and validate the requested text.
      const body = await request.json();
      const text = typeof body.text === "string"
        ? body.text.trim()
        : "";

      if (!text || text.length > 1000) {
        return new Response(
          "Text must contain 1 to 1000 characters",
          { status: 400, headers: corsHeaders }
        );
      }

      // 6. Request speech from Google Cloud Text-to-Speech.
      const googleResponse = await fetch(
        "https://texttospeech.googleapis.com/v1/text:synthesize?key=" +
          encodeURIComponent(env.GOOGLE_TTS_API_KEY),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: "en-IN",
              name: VOICE_NAME
            },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: 1.0
            }
          })
        }
      );

      // 7. Return Google's error details if synthesis fails.
      if (!googleResponse.ok) {
        const details = await googleResponse.text();

        return new Response(
          "Google TTS request failed: " + details,
          {
            status: 502,
            headers: {
              ...corsHeaders,
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        );
      }

      const result = await googleResponse.json();

      if (!result.audioContent) {
        return new Response(
          "Google TTS returned no audio",
          { status: 502, headers: corsHeaders }
        );
      }

      // 8. Convert Google's base64 audio into MP3 bytes.
      const binary = Uint8Array.from(
        atob(result.audioContent),
        character => character.charCodeAt(0)
      );

      // 9. Send MP3 audio back to MathStars.
      return new Response(binary, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      });

    } catch (error) {
      return new Response(
        "Unable to synthesize speech: " +
          (error?.message || "Unknown error"),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/plain; charset=utf-8"
          }
        }
      );
    }
  }
};
