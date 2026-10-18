# MathStars Google Chirp 3 HD voice setup

MathStars is prepared to use Google's **`en-IN-Chirp3-HD-Despina`** female English (India) voice through a Cloudflare Worker. The Worker keeps the Google API key off the public GitHub Pages site.

## 1. Enable Google Cloud Text-to-Speech

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a Google Cloud project.
3. Enable **Cloud Text-to-Speech API** for that project.
4. Set up billing if Google requires it for your project. Check the current [Text-to-Speech pricing and free allowance](https://cloud.google.com/text-to-speech/pricing) before using it.
5. Create an API key in **APIs & Services → Credentials**. Restrict it to the Cloud Text-to-Speech API where possible. Do not add it to this repository or to `index.html`.

Google lists `en-IN-Chirp3-HD-Despina` as a female English (India) Chirp 3: HD voice. See the [official voice list](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types).

## 2. Deploy the secure Worker

1. Sign in to [Cloudflare](https://dash.cloudflare.com/) and open **Workers & Pages**.
2. Create a Worker, for example `mathstars-google-tts`.
3. Replace its starter code with the contents of [`cloudflare-worker-tts.js`](./cloudflare-worker-tts.js) in this repository, then deploy.
4. In the Worker settings, open **Settings → Variables and Secrets** (wording may vary) and add a secret:
   - Name: `GOOGLE_TTS_API_KEY`
   - Value: the Google API key you created
5. Save/deploy the Worker again if prompted.
6. Copy its public Worker URL, such as `https://mathstars-google-tts.<your-subdomain>.workers.dev`.

The Worker currently accepts browser requests only from `https://mnimmagari.github.io`. If you publish MathStars on a different custom domain, update `ALLOWED_ORIGIN` in the Worker code to that exact origin and redeploy.

## 3. Connect MathStars to the Worker

1. Open `index.html` in this repository.
2. Find this line near the speech function:

   ```js
   const GOOGLE_TTS_WORKER_URL='';
   ```

3. Put your Worker URL between the quotes, for example:

   ```js
   const GOOGLE_TTS_WORKER_URL='https://mathstars-google-tts.<your-subdomain>.workers.dev';
   ```

   Replace the example with your actual URL.
4. Commit the change and wait for GitHub Pages to publish it.
5. Open MathStars, enable **Voice**, and start a quiz. The welcome message, question introductions, questions, hints, and feedback should use the Google voice when the Worker is configured. If the service request fails, the site falls back to the browser's speech voice.

## Important notes

- Do **not** put the Google API key in `index.html`, JavaScript committed to GitHub, or a public issue.
- Chirp 3: HD is a premium Google Cloud voice; check current pricing/free quotas and set billing alerts before regular use.
- The voice is a synthetic female Indian-English voice, not a promise of an actual child's voice.
- The Worker checks text length and the requesting website origin. It does not implement per-user rate limiting, so keep an eye on API usage and quotas.
- Chirp 3: HD does not use the standard speaking-rate/pitch controls in the same way as some other voice families; the Worker uses its natural voice settings.
