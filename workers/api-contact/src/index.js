// ============================================
// Worker api-contact.gaetandev.fr
// Reçoit le formulaire de contact du site, vérifie le jeton GaetanDev Captcha,
// puis envoie le mail via l'API REST d'EmailJS. Voir docs/features/contact.md.
// ============================================

const SITEVERIFY_URL = "https://captcha.gaetandev.fr/v1/siteverify";
const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";
const CAPTCHA_ACTION = "contact"; // Doit correspondre à l'attribut action de <app-gd-captcha>
const MAX_BODY_BYTES = 32 * 1024;
const LIMITS = {
  name: { min: 3, max: 100 },
  email: { max: 254 },
  message: { min: 3, max: 5000 },
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_ENV = [
  "GD_CAPTCHA_SECRET",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_PRIVATE_KEY",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const originAllowed = origin !== null && parseList(env.ALLOWED_ORIGINS).includes(origin);
    const corsHeaders = originAllowed
      ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }
      : { Vary: "Origin" };

    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: originAllowed ? 204 : 403, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return Response.redirect("https://gaetandev.fr/contact", 301);
    }

    if (new URL(request.url).pathname !== "/") {
      return json({ error: "not_found" }, 404);
    }

    // Seul le site peut appeler le worker depuis un navigateur. Un client hors navigateur
    // peut forger l'en-tête Origin : c'est le captcha qui protège réellement l'envoi.
    if (!originAllowed) {
      return json({ error: "origin_not_allowed" }, 403);
    }

    const missing = REQUIRED_ENV.filter((key) => !env[key]);
    if (missing.length > 0) {
      console.error("Configuration manquante :", missing.join(", "));
      return json({ error: "server_misconfigured" }, 500);
    }

    // --- Lecture et validation du formulaire ---
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json({ error: "payload_too_large" }, 413);
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    const contact = readContact(body);
    if (contact.error) {
      return json({ error: "invalid_field", field: contact.error }, 400);
    }

    // --- Vérification du captcha (un jeton n'est valable qu'une fois, 5 minutes) ---
    const ip = request.headers.get("CF-Connecting-IP");
    let captcha;
    try {
      captcha = await verifyCaptcha(contact.captchaToken, ip, env.GD_CAPTCHA_SECRET);
    } catch (error) {
      console.error("Siteverify indisponible :", error);
      return json({ error: "captcha_unavailable" }, 502);
    }

    if (captcha.success !== true || captcha.action !== CAPTCHA_ACTION) {
      console.warn("Captcha refusé :", JSON.stringify({ errors: captcha.error_codes, action: captcha.action }));
      return json({ error: "captcha_failed" }, 403);
    }

    // --- Envoi via EmailJS ---
    try {
      const sent = await sendEmail(env, {
        name: contact.name,
        email: contact.email,
        message: contact.message,
      });
      if (!sent) return json({ error: "email_failed" }, 502);
    } catch (error) {
      console.error("EmailJS injoignable :", error);
      return json({ error: "email_failed" }, 502);
    }

    return json({ ok: true });
  },
};

// ============================================
// Validation du formulaire (mêmes règles minimales que le front, plus des maxima)
// ============================================
function readContact(body) {
  if (!body || typeof body !== "object") return { error: "body" };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : "";

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) return { error: "name" };
  if (email.length > LIMITS.email.max || !EMAIL_PATTERN.test(email)) return { error: "email" };
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) return { error: "message" };
  if (captchaToken.length === 0) return { error: "captchaToken" };

  return { name, email, message, captchaToken };
}

// ============================================
// GaetanDev Captcha : https://captcha.gaetandev.fr/docs#siteverify
// Réponse : { success, challenge_ts, hostname, action, cdata, score, error_codes }
// ============================================
async function verifyCaptcha(token, ip, secret) {
  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
  });
  const result = await response.json().catch(() => null);
  if (!result || typeof result !== "object") {
    throw new Error(`Réponse siteverify illisible (HTTP ${response.status})`);
  }
  return result;
}

// ============================================
// EmailJS REST : https://www.emailjs.com/docs/rest-api/send/
// Succès : HTTP 200 avec le texte « OK ».
// ============================================
async function sendEmail(env, templateParams) {
  const response = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      accessToken: env.EMAILJS_PRIVATE_KEY,
      template_params: templateParams,
    }),
  });
  if (!response.ok) {
    console.error("EmailJS a refusé l'envoi :", response.status, await response.text());
    return false;
  }
  return true;
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
