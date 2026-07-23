import { env } from "cloudflare:workers";
import { ensureDatabaseSchema } from "../../../db/runtime-schema";

type Appointment = {
  name: string; email: string; phone: string; service: string;
  date: string; time: string; message: string;
};

async function sendEmail(templateId: string, params: Record<string, string>) {
  const bindings = env as unknown as {
    EMAILJS_SERVICE_ID?: string; EMAILJS_PUBLIC_KEY?: string; EMAILJS_PRIVATE_KEY?: string;
  };
  if (!bindings.EMAILJS_SERVICE_ID || !bindings.EMAILJS_PUBLIC_KEY || !templateId) {
    console.warn("Appointment email skipped: EmailJS configuration is incomplete.");
    return false;
  }
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      service_id: bindings.EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: bindings.EMAILJS_PUBLIC_KEY,
      accessToken: bindings.EMAILJS_PRIVATE_KEY || undefined,
      template_params: params,
    }),
  });
  if (!response.ok) throw new Error(`EmailJS returned ${response.status}`);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Appointment;
    const values = Object.fromEntries(Object.entries(body).map(([key, value]) => [key, String(value || "").trim()])) as Appointment;
    if (!values.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !/^\+?[0-9\s-]{10,16}$/.test(values.phone) || !values.service || !/^\d{4}-\d{2}-\d{2}$/.test(values.date) || !values.time || !values.message) {
      return Response.json({ error: "Please complete all appointment details correctly." }, { status: 400 });
    }
    if (values.date < new Date().toISOString().slice(0, 10)) {
      return Response.json({ error: "Please choose today or a future date." }, { status: 400 });
    }
    const bindings = env as unknown as {
      DB?: D1Database; EMAILJS_USER_TEMPLATE_ID?: string; EMAILJS_ADMIN_TEMPLATE_ID?: string;
      ADMIN_NOTIFICATION_EMAIL?: string;
    };
    if (!bindings.DB) return Response.json({ error: "Appointment service is unavailable." }, { status: 503 });
    await ensureDatabaseSchema(bindings.DB);
    const reference = `APT-${Date.now().toString(36).toUpperCase()}`;
    await bindings.DB.prepare("INSERT INTO appointments (reference,name,email,phone,service,preferred_date,preferred_time,message,status) VALUES (?,?,?,?,?,?,?,?,?)")
      .bind(reference, values.name, values.email, values.phone, values.service, values.date, values.time, values.message, "requested").run();

    const params = {
      reference, name: values.name, to_name: values.name, to_email: values.email,
      user_email: values.email, phone: values.phone, service: values.service,
      appointment_date: values.date, appointment_time: values.time, message: values.message,
      admin_email: bindings.ADMIN_NOTIFICATION_EMAIL || "",
    };
    try {
      await sendEmail(bindings.EMAILJS_USER_TEMPLATE_ID || "", { ...params, recipient_email: values.email });
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await sendEmail(bindings.EMAILJS_ADMIN_TEMPLATE_ID || "", { ...params, recipient_email: bindings.ADMIN_NOTIFICATION_EMAIL || "" });
    } catch (error) {
      console.error("Appointment email delivery failed", error);
    }
    return Response.json({ ok: true, reference });
  } catch (error) {
    console.error("Appointment booking failed", error);
    return Response.json({ error: "Unable to book the appointment. Please try again." }, { status: 500 });
  }
}
