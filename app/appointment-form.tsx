"use client";

import { FormEvent, useState } from "react";
import { popupError, popupSuccess } from "./sweet-alert";

export default function AppointmentForm() {
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json() as { reference?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to book the appointment.");
      form.reset();
      await popupSuccess("Appointment requested", `We received your request. Reference: ${result.reference}`);
    } catch (error) {
      await popupError("Appointment not booked", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="appointment-form" onSubmit={submit}>
      <div className="appointment-copy">
        <p className="eyebrow"><span />Book an appointment</p>
        <h2>Let’s find the right support together.</h2>
        <p>Choose a convenient time to speak with our support team. We will confirm your appointment by email.</p>
        <div><i className="fa-solid fa-headset" /><span><b>Need urgent guidance?</b> Call +91 80000 12345</span></div>
      </div>
      <div className="appointment-fields">
        <label>Full name<input name="name" autoComplete="name" required /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
        <label>Phone number<input name="phone" type="tel" inputMode="tel" required /></label>
        <label>Appointment type<select name="service" required><option value="">Select support</option><option>Application guidance</option><option>Programme consultation</option><option>CSR partnership</option><option>Donation assistance</option><option>General enquiry</option></select></label>
        <label>Preferred date<input name="date" type="date" min={new Date().toISOString().slice(0, 10)} required /></label>
        <label>Preferred time<select name="time" required><option value="">Select time</option><option>10:00 AM – 11:00 AM</option><option>11:00 AM – 12:00 PM</option><option>12:00 PM – 1:00 PM</option><option>2:00 PM – 3:00 PM</option><option>3:00 PM – 4:00 PM</option><option>4:00 PM – 5:00 PM</option></select></label>
        <label className="wide">How can we help?<textarea name="message" rows={3} required /></label>
        <button className="btn btn-gold" disabled={submitting}><i className="fa-solid fa-calendar-check" />{submitting ? "Booking…" : "Request appointment"}</button>
      </div>
    </form>
  );
}
