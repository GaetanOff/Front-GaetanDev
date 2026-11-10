import { afterEach, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const ORIGIN = "https://gaetandev.fr";
const ENV = {
  ALLOWED_ORIGINS: `${ORIGIN}, http://localhost:4200`,
  GD_CAPTCHA_SECRET: "gd_secret_test",
  EMAILJS_SERVICE_ID: "service_test",
  EMAILJS_TEMPLATE_ID: "template_test",
  EMAILJS_PUBLIC_KEY: "public_test",
  EMAILJS_PRIVATE_KEY: "private_test",
};
const FORM = { name: "Gaetan", email: "test@example.com", message: "Hello world", captchaToken: "token-1" };

/** Réponses simulées des services appelés par le worker, par URL. */
let upstream;
let calls;

function post(body, { origin = ORIGIN, path = "/" } = {}) {
  return worker.fetch(
    new Request(`https://api-contact.gaetandev.fr${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": "203.0.113.7",
        ...(origin ? { Origin: origin } : {}),
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    ENV
  );
}

const callsTo = (host) => calls.filter((call) => new URL(call.url).host === host);

beforeEach(() => {
  calls = [];
  upstream = {
    "captcha.gaetandev.fr": () => Response.json({ success: true, action: "contact", hostname: "gaetandev.fr" }),
    "api.emailjs.com": () => new Response("OK", { status: 200 }),
  };
  mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body) });
    return upstream[new URL(url).host]();
  });
  mock.method(console, "error", () => undefined);
  mock.method(console, "warn", () => undefined);
});

afterEach(() => mock.restoreAll());

describe("CORS", () => {
  it("answers the preflight of an allowed origin", async () => {
    const response = await worker.fetch(
      new Request("https://api-contact.gaetandev.fr/", { method: "OPTIONS", headers: { Origin: ORIGIN } }),
      ENV
    );
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  });

  it("refuses another origin without calling any service", async () => {
    const response = await post(FORM, { origin: "https://evil.example" });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
    assert.deepEqual(await response.json(), { error: "origin_not_allowed" });
    assert.equal(calls.length, 0);
  });

  it("refuses a request without Origin", async () => {
    const response = await post(FORM, { origin: null });
    assert.equal(response.status, 403);
  });
});

describe("routing", () => {
  it("redirects GET to the contact page", async () => {
    const response = await worker.fetch(new Request("https://api-contact.gaetandev.fr/"), ENV);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), "https://gaetandev.fr/contact");
  });

  it("returns 404 on another path", async () => {
    const response = await post(FORM, { path: "/other" });
    assert.equal(response.status, 404);
  });
});

describe("validation", () => {
  for (const [field, value, label] of [
    ["name", "Ga", "too short"],
    ["email", "not-an-email", "malformed"],
    ["message", "Hi", "too short"],
    ["message", "x".repeat(5001), "too long"],
    ["captchaToken", "", "empty"],
  ]) {
    it(`rejects a ${label} ${field} before verifying the captcha`, async () => {
      const response = await post({ ...FORM, [field]: value });
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: "invalid_field", field });
      assert.equal(calls.length, 0);
    });
  }

  it("rejects invalid JSON", async () => {
    const response = await post("{not json");
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "invalid_json" });
  });

  it("rejects an oversized body", async () => {
    const response = await post({ ...FORM, padding: "x".repeat(40 * 1024) });
    assert.equal(response.status, 413);
  });

  it("fails closed when a secret is missing", async () => {
    const response = await worker.fetch(
      new Request("https://api-contact.gaetandev.fr/", {
        method: "POST",
        headers: { Origin: ORIGIN, "Content-Type": "application/json" },
        body: JSON.stringify(FORM),
      }),
      { ...ENV, EMAILJS_PRIVATE_KEY: "" }
    );
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "server_misconfigured" });
    assert.equal(calls.length, 0);
  });
});

describe("captcha", () => {
  it("verifies the token with the secret and the visitor IP", async () => {
    await post(FORM);
    const [verify] = callsTo("captcha.gaetandev.fr");
    assert.equal(verify.url, "https://captcha.gaetandev.fr/v1/siteverify");
    assert.deepEqual(verify.body, { secret: "gd_secret_test", response: "token-1", remoteip: "203.0.113.7" });
  });

  it("does not send the email when the token is refused", async () => {
    upstream["captcha.gaetandev.fr"] = () =>
      Response.json({ success: false, error_codes: ["timeout-or-duplicate"] }, { status: 200 });
    const response = await post(FORM);
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: "captcha_failed" });
    assert.equal(callsTo("api.emailjs.com").length, 0);
  });

  it("refuses a token solved for another action", async () => {
    upstream["captcha.gaetandev.fr"] = () => Response.json({ success: true, action: "login" });
    const response = await post(FORM);
    assert.equal(response.status, 403);
    assert.equal(callsTo("api.emailjs.com").length, 0);
  });

  it("fails closed when siteverify is unreachable", async () => {
    upstream["captcha.gaetandev.fr"] = () => {
      throw new TypeError("fetch failed");
    };
    const response = await post(FORM);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: "captcha_unavailable" });
    assert.equal(callsTo("api.emailjs.com").length, 0);
  });
});

describe("EmailJS", () => {
  it("sends the trimmed form with the private key, then answers ok", async () => {
    const response = await post({ ...FORM, name: "  Gaetan  " });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);

    const [send] = callsTo("api.emailjs.com");
    assert.equal(send.url, "https://api.emailjs.com/api/v1.0/email/send");
    assert.deepEqual(send.body, {
      service_id: "service_test",
      template_id: "template_test",
      user_id: "public_test",
      accessToken: "private_test",
      template_params: { name: "Gaetan", email: "test@example.com", message: "Hello world" },
    });
  });

  it("returns 502 when EmailJS refuses the email", async () => {
    upstream["api.emailjs.com"] = () => new Response("The Public Key is invalid", { status: 400 });
    const response = await post(FORM);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: "email_failed" });
  });
});
