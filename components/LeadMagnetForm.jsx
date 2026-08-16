"use client";
import { useState } from "react";

export default function LeadMagnetForm({
  pdfUrl = "https://connectorselection.com/downloads/fpc-ffc-connector-selection-guide.pdf",
  source = "fpc_ffc_guide",
  title = "Get the FPC & FFC Connector Selection Guide",
  description = "A free 8-page PDF covering pitch selection, ZIF vs. Non-ZIF, and flex circuit design rules — straight to your inbox.",
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return; // silently drop bots
    setStatus("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/newsletter-subscribers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              email,
              source,
              subscribed_at: new Date().toISOString(),
            },
          }),
        }
      );

      // Treat duplicate-email rejection the same as success —
      // from the user's perspective they're already on the list.
      if (!res.ok && res.status !== 400) {
        throw new Error("Submission failed");
      }

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          lead_type: "lead_magnet",
          lead_source: source,
        });
      }

      setStatus("success");

      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="cs-newsletter cs-leadmagnet cs-newsletter-success">
        <span className="cs-leadmagnet-eyebrow">Download Started</span>
        <h3>Check your inbox</h3>
        <p>We also sent a copy of the guide to your email.</p>
      </div>
    );
  }

  return (
    <div className="cs-newsletter cs-leadmagnet">
      <span className="cs-leadmagnet-eyebrow">Free PDF Download</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <form onSubmit={handleSubmit} className="cs-newsletter-form">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="cs-newsletter-input"
        />
        <button type="submit" disabled={status === "loading"} className="cs-leadmagnet-btn">
          {status === "loading" ? "Sending..." : "Download the Guide →"}
        </button>
      </form>
      {status === "error" && (
        <p className="cs-newsletter-error">Something went wrong — try again.</p>
      )}
    </div>
  );
}
