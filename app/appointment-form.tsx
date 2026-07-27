"use client";

import { FormEvent, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/bn";
import "dayjs/locale/hi";
import "dayjs/locale/mr";
import "dayjs/locale/ta";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLanguage } from "./i18n";
import { popupError, popupSuccess } from "./sweet-alert";
import SelectControl from "./select-control";

export default function AppointmentForm() {
  const { language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!service || !time || !date) {
      await popupError("Choose appointment details", "Select an appointment type, date, and time.");
      return;
    }
    setSubmitting(true);
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json() as {
        reference?: string;
        error?: string;
        emailSent?: boolean;
        emailWarning?: string;
      };
      if (!response.ok) throw new Error(result.error || "Unable to book the appointment.");
      form.reset();
      setService("");
      setTime("");
      setDate(null);
      await popupSuccess(
        "Appointment requested",
        result.emailSent
          ? `We received your request and sent the confirmation emails. Reference: ${result.reference}`
          : `We received your request. Reference: ${result.reference}. ${result.emailWarning || "Email confirmation is delayed."}`,
      );
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
        <label>Appointment type<SelectControl instanceId="appointment-service" name="service" value={service} onChange={setService} placeholder="Select support" options={["Application guidance","Programme consultation","CSR partnership","Donation assistance","General enquiry"].map(value=>({value,label:value}))}/></label>
        <label>Preferred date<input type="hidden" name="date" value={date?.format("YYYY-MM-DD") || ""}/><LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={["hi","mr","ta","bn"].includes(language) ? language : "en"}><DatePicker value={date} onChange={setDate} minDate={dayjs().startOf("day")} format="DD/MM/YYYY" slotProps={{textField:{required:true,fullWidth:true},popper:{className:"beyond-date-picker",translate:"no"}}}/></LocalizationProvider></label>
        <label>Preferred time<SelectControl instanceId="appointment-time" name="time" value={time} onChange={setTime} placeholder="Select time" options={["10:00 AM – 11:00 AM","11:00 AM – 12:00 PM","12:00 PM – 1:00 PM","2:00 PM – 3:00 PM","3:00 PM – 4:00 PM","4:00 PM – 5:00 PM"].map(value=>({value,label:value}))}/></label>
        <label className="wide">How can we help?<textarea name="message" rows={3} required /></label>
        <button className="btn btn-gold" disabled={submitting}><i className="fa-solid fa-calendar-check" />{submitting ? "Booking…" : "Request appointment"}</button>
      </div>
    </form>
  );
}
