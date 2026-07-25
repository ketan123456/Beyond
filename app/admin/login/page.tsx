/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, type FormEvent } from "react";
import { Logo } from "../../components";
import { popupError, popupSuccess } from "../../sweet-alert";

type View = "login" | "request" | "reset";

export default function AdminLogin() {
  const [view, setView] = useState<View>("login");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Signing in…");
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      if (response.ok) {
        setStatus("");
        await popupSuccess("Welcome back", "You signed in successfully.");
        window.location.assign("/admin");
        return;
      }
      const data = (await response.json()) as { error?: string };
      setStatus("");
      await popupError("Sign-in failed", data.error || "Sign-in failed.");
    } catch {
      setStatus("");
      await popupError("Sign-in failed", "The admin service could not be reached. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function requestReset() {
    setSubmitting(true);
    setStatus("Sending verification code…");
    try {
      const response = await fetch("/api/admin/password-reset/request", { method: "POST" });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "Unable to send a reset code.");
      setView("reset");
      setStatus(data.message || "Check your admin email for the six-digit code.");
    } catch (error) {
      setStatus("");
      await popupError("Password reset", error instanceof Error ? error.message : "Unable to send a reset code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== String(form.get("confirmPassword") || "")) {
      await popupError("Passwords do not match", "Enter the same new password in both fields.");
      return;
    }
    setSubmitting(true);
    setStatus("Updating password…");
    try {
      const response = await fetch("/api/admin/password-reset/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: form.get("code"), password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to reset password.");
      setStatus("");
      await popupSuccess("Password updated", "You can now sign in using your new password.");
      setView("login");
    } catch (error) {
      setStatus("");
      await popupError("Password reset", error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setSubmitting(false);
    }
  }

  function returnToLogin() {
    setView("login");
    setStatus("");
  }
  

  return (
    <main className="admin-login">
      <section className="admin-login-card">
        <Logo />
        <div className="admin-login-icon">
          <i className={`fa-solid ${view === "login" ? "fa-user-shield" : "fa-key"}`} />
        </div>
        <p className="eyebrow">Secure administration</p>
        <h1>{view === "login" ? "Admin Login" : "Reset Password"}</h1>
        <p>
          {view === "login"
            ? "Sign in to manage applications, donations, partners, and website operations."
            : view === "request"
              ? "We will send a six-digit verification code to the main administrator email."
              : "Enter the code from your email, then choose a secure new password."}
        </p>

        {view === "login" && (
          <form onSubmit={login}>
            <label>Username<div className="admin-field"><i className="fa-solid fa-user" /><input name="username" autoComplete="username" required autoFocus /></div></label>
            <label>Password<div className="admin-field"><i className="fa-solid fa-lock" /><input name="password" type={showLoginPassword ? "text" : "password"} autoComplete="current-password" required /><button className="admin-password-toggle" type="button" onClick={() => setShowLoginPassword((visible) => !visible)} aria-label={showLoginPassword ? "Hide password" : "Show password"}><i className={`fa-solid ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`} /></button></div></label>
            <button className="btn btn-gold" type="submit" disabled={submitting}><i className="fa-solid fa-right-to-bracket" /> {submitting ? "Signing in…" : "Sign In"}</button>
            <button className="admin-forgot-password" type="button" onClick={() => { setView("request"); setStatus(""); }}>Forgot password?</button>
          </form>
        )}

        {view === "request" && (
          <div className="admin-reset-actions">
            <button className="btn btn-gold" type="button" onClick={requestReset} disabled={submitting}><i className="fa-solid fa-paper-plane" /> {submitting ? "Sending code…" : "Send six-digit code"}</button>
            <button className="admin-forgot-password" type="button" onClick={returnToLogin}>Back to sign in</button>
          </div>
        )}

        {view === "reset" && (
          <form onSubmit={resetPassword}>
            <label>Verification code<div className="admin-field"><i className="fa-solid fa-shield-halved" /><input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit code" required autoFocus /></div></label>
            <label>New password<div className="admin-field"><i className="fa-solid fa-lock" /><input name="password" type={showNewPassword ? "text" : "password"} autoComplete="new-password" minLength={10} required /><button className="admin-password-toggle" type="button" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? "Hide password" : "Show password"}><i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`} /></button></div></label>
            <label>Confirm new password<div className="admin-field"><i className="fa-solid fa-lock" /><input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" minLength={10} required /><button className="admin-password-toggle" type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}><i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} /></button></div></label>
            <button className="btn btn-gold" type="submit" disabled={submitting}><i className="fa-solid fa-key" /> {submitting ? "Updating…" : "Set new password"}</button>
            <button className="admin-forgot-password" type="button" onClick={requestReset} disabled={submitting}>Send a new code</button>
          </form>
        )}

        <p className="form-status" role="status">{status}</p>
        <a href="/" className="admin-back"><i className="fa-solid fa-arrow-left" /> Back to website</a>
      </section>
    </main>
  );
}
