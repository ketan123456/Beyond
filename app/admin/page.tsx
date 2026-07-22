import { requireStaticAdmin } from "../static-admin-auth";

export const dynamic = "force-dynamic";

const operations = [
  ["fa-folder-open", "Applications & Cases", "Review eligibility, assign team members, update case status, and record aid disbursement.", "24 awaiting review →"],
  ["fa-file-shield", "Document Verification", "Securely inspect UDID cards, income certificates and medical records.", "18 documents pending →"],
  ["fa-language", "Languages & Content", "Manage English, Hindi, Marathi, Tamil and Bengali translations.", "5 languages active →"],
  ["fa-indian-rupee-sign", "Payments & Receipts", "Track Razorpay orders, donor records, refunds and 80G receipt status.", "View payments →"],
  ["fa-handshake", "CSR Partners", "Manage company enquiries, commitments, reports and partnership follow-ups.", "6 new leads →"],
  ["fa-gear", "Site Settings", "Update helpline details, impact counters, districts, homepage content and resources.", "Manage site →"],
];

export default async function Admin() {
  const user = await requireStaticAdmin();
  return <main className="admin-dashboard"><div className="admin-heading"><div><p className="eyebrow">Beyond Disability</p><h1>Admin Control Centre</h1><p>Welcome, {user.displayName}</p></div><a href="/api/admin/logout" className="btn btn-outline"><i className="fa-solid fa-right-from-bracket"/> Sign out</a></div><div className="mini-stats"><b>24<span>New Applications</span></b><b>18<span>Pending Documents</span></b><b>₹2.4L<span>Donations This Month</span></b><b>6<span>Partner Leads</span></b></div><section><h2>Operations</h2><div className="card-grid">{operations.map(([icon,title,text,action])=><article className="service-card" key={title}><i className={`fa-solid ${icon}`}/><div><h3>{title}</h3><p>{text}</p><b>{action}</b></div></article>)}</div></section></main>;
}
