"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import LanguageManager from "./language-manager";
import { confirmDelete, popupError, popupSuccess } from "../sweet-alert";

type Row = Record<string, string | number | null>;
type Data = {
  applications: Row[];
  partners: Row[];
  payments: Row[];
  documents: Row[];
  applicationDocuments: Row[];
  refreshedAt: string;
};
type DataSection = "applications" | "partners" | "payments";
type Section = DataSection | "languages";
const statusOptions: Record<DataSection, string[]> = {
  applications: [
    "submitted",
    "reviewing",
    "documents-needed",
    "approved",
    "rejected",
    "supported",
  ],
  partners: ["new", "contacted", "meeting", "committed", "closed"],
  payments: ["created", "paid", "failed", "refunded"],
};

export default function AdminDashboard({ adminName }: { adminName: string }) {
  const [data, setData] = useState<Data | null>(null),
    [section, setSection] = useState<Section>("applications"),
    [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [updating, setUpdating] = useState<number | null>(null),
    [deleting, setDeleting] = useState<number | null>(null),
    [signingOut, setSigningOut] = useState(false),
    [selected, setSelected] = useState<{
      section: DataSection;
      row: Row;
    } | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/data", { cache: "no-store" });
      const body = await response.json();
      if (response.ok) setData(body);
      else setError(body.error || "Unable to load dashboard.");
    } catch {
      setError("Unable to connect to the admin database.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [selected]);
  const rows = useMemo(() => {
    if (section === "languages") return [];
    const items = data?.[section] || [];
    const needle = query.trim().toLowerCase();
    return needle
      ? items.filter((row) =>
          Object.values(row).some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(needle),
          ),
        )
      : items;
  }, [data, section, query]);
  const paid = (data?.payments || []).filter((x) => x.status === "paid"),
    total = paid.reduce((sum, row) => sum + Number(row.amount || 0), 0) / 100,
    pendingDocs = (data?.documents || []).reduce(
      (sum, row) => sum + Number(row.pending || 0),
      0,
    );
  async function updateStatus(id: number, status: string) {
    if (section === "languages") return;
    setUpdating(id);
    const response = await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ section, id, status }),
    });
    if (response.ok) await load();
    else setError("Status update failed.");
    setUpdating(null);
  }
  function logout() {
    setSigningOut(true);
    window.location.replace("/api/admin/logout");
  }
  async function deleteRecord(targetSection: DataSection, row: Row) {
    const label = String(
      row.reference ||
        row.company ||
        row.razorpay_order_id ||
        `record #${row.id}`,
    );
    const confirmation = await confirmDelete(`Delete ${label}?`);
    if (!confirmation.isConfirmed) return;
    setDeleting(Number(row.id));
    setError("");
    try {
      const response = await fetch("/api/admin/data", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section: targetSection, id: Number(row.id) }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(body.error || "Unable to delete this record.");
      setSelected(null);
      await load();
      await popupSuccess(
        "Record deleted",
        "The selected record was removed successfully.",
      );
    } catch (reason) {
      const message =
        reason instanceof Error
          ? reason.message
          : "Unable to delete this record.";
      setError(message);
      await popupError("Delete failed", message);
    } finally {
      setDeleting(null);
    }
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Live operations</p>
          <h1>Admin Control Centre</h1>
          <p>
            Welcome, {adminName}. Manage operations and website languages from
            one place.
          </p>
        </div>
        <div className="admin-heading-actions">
          <button
            className="btn btn-outline"
            onClick={() => void load()}
            disabled={loading}
          >
            <i className={`fa-solid fa-rotate ${loading ? "fa-spin" : ""}`} />{" "}
            Refresh
          </button>
          <button
            className="btn btn-outline"
            onClick={() => void logout()}
            disabled={signingOut}
          >
            <i
              className={`fa-solid ${signingOut ? "fa-spinner fa-spin" : "fa-right-from-bracket"}`}
            />{" "}
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
      <div className="admin-kpis">
        <article>
          <i className="fa-solid fa-folder-open" />
          <b>{data?.applications.length ?? "—"}</b>
          <span>Total applications</span>
        </article>
        <article>
          <i className="fa-solid fa-file-circle-exclamation" />
          <b>{data ? pendingDocs : "—"}</b>
          <span>Pending documents</span>
        </article>
        <article>
          <i className="fa-solid fa-indian-rupee-sign" />
          <b>{data ? `₹${total.toLocaleString("en-IN")}` : "—"}</b>
          <span>Verified donations</span>
        </article>
        <article>
          <i className="fa-solid fa-handshake" />
          <b>
            {data?.partners.filter((x) => x.status !== "closed").length ?? "—"}
          </b>
          <span>Open partner leads</span>
        </article>
      </div>
      <section className="admin-workspace">
        <div className="admin-toolbar">
          <div className="admin-tabs">
            {(
              ["applications", "partners", "payments", "languages"] as Section[]
            ).map((item) => (
              <button
                key={item}
                className={section === item ? "active" : ""}
                onClick={() => {
                  setSection(item);
                  setQuery("");
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {section !== "languages" && (
            <label className="admin-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${section}`}
              />
            </label>
          )}
        </div>
        {section === "languages" ? (
          <LanguageManager />
        ) : (
          <>
            {error && (
              <div className="admin-error">
                <i className="fa-solid fa-triangle-exclamation" /> {error}
              </div>
            )}
            {loading && !data ? (
              <div className="admin-empty">
                <i className="fa-solid fa-spinner fa-spin" /> Initialising
                secure admin data…
              </div>
            ) : (
              <AdminTable
                section={section}
                rows={rows}
                updating={updating}
                deleting={deleting}
                updateStatus={updateStatus}
                onView={(row) => setSelected({ section, row })}
                onDelete={(row) => void deleteRecord(section, row)}
              />
            )}
            <p className="admin-refreshed">
              {data?.refreshedAt &&
                `Last refreshed ${new Date(data.refreshedAt).toLocaleString("en-IN")}`}
            </p>
          </>
        )}
      </section>
      {selected && (
        <RecordModal
          selected={selected}
          documents={data?.applicationDocuments || []}
          deleting={deleting === selected.row.id}
          onClose={() => setSelected(null)}
          onDelete={() => void deleteRecord(selected.section, selected.row)}
        />
      )}
    </>
  );
}

function AdminTable({
  section,
  rows,
  updating,
  deleting,
  updateStatus,
  onView,
  onDelete,
}: {
  section: DataSection;
  rows: Row[];
  updating: number | null;
  deleting: number | null;
  updateStatus: (id: number, status: string) => void;
  onView: (row: Row) => void;
  onDelete: (row: Row) => void;
}) {
  if (!rows.length)
    return (
      <div className="admin-empty">
        <i className="fa-solid fa-inbox" />
        <b>No records found</b>
        <span>New records will appear here automatically.</span>
      </div>
    );
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {section === "applications" ? (
              <>
                <th>Reference / Applicant</th>
                <th>Support</th>
                <th>Contact</th>
                <th>Documents</th>
                <th>Status</th>
              </>
            ) : section === "partners" ? (
              <>
                <th>Organisation</th>
                <th>Contact</th>
                <th>Message</th>
                <th>Status</th>
              </>
            ) : (
              <>
                <th>Razorpay order</th>
                <th>Amount</th>
                <th>Created</th>
                <th>Status</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={Number(row.id)}>
              {section === "applications" ? (
                <>
                  <td>
                    <b>{row.reference}</b>
                    <span>
                      {row.name} · {row.district}
                    </span>
                  </td>
                  <td>
                    {row.category}
                    <span>{row.details}</span>
                  </td>
                  <td>{row.phone}</td>
                  <td>
                    <span className="status-chip">Stored securely</span>
                  </td>
                </>
              ) : section === "partners" ? (
                <>
                  <td>
                    <b>{row.company}</b>
                  </td>
                  <td>
                    {row.contact_name}
                    <span>{row.email}</span>
                  </td>
                  <td>{row.message}</td>
                </>
              ) : (
                <>
                  <td>
                    <b>{row.razorpay_order_id}</b>
                  </td>
                  <td>₹{(Number(row.amount) / 100).toLocaleString("en-IN")}</td>
                  <td>{String(row.created_at || "")}</td>
                </>
              )}
              <td>
                <select
                  value={String(row.status)}
                  disabled={updating === row.id}
                  onChange={(e) => updateStatus(Number(row.id), e.target.value)}
                >
                  {statusOptions[section].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td>
                <div className="admin-actions">
                  <button
                    className="admin-icon-btn view"
                    onClick={() => onView(row)}
                    aria-label="View record"
                    title="View"
                  >
                    <i className="fa-solid fa-eye" />
                  </button>
                  <button
                    className="admin-icon-btn delete"
                    onClick={() => onDelete(row)}
                    disabled={deleting === row.id}
                    aria-label="Delete record"
                    title="Delete"
                  >
                    <i
                      className={`fa-solid ${deleting === row.id ? "fa-spinner fa-spin" : "fa-trash"}`}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordModal({
  selected,
  documents,
  deleting,
  onClose,
  onDelete,
}: {
  selected: { section: DataSection; row: Row };
  documents: Row[];
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  const { section, row } = selected;
  const entries =
    section === "applications"
      ? [
          ["Reference", row.reference],
          ["Applicant", row.name],
          ["District", row.district],
          ["Support category", row.category],
          ["Phone", row.phone],
          ["Status", row.status],
          ["Request details", row.details],
          ["Submitted", row.created_at],
        ]
      : section === "partners"
        ? [
            ["Organisation", row.company],
            ["Contact person", row.contact_name],
            ["Email", row.email],
            ["Phone", row.phone],
            ["Status", row.status],
            ["Message", row.message],
            ["Received", row.created_at],
          ]
        : [
            ["Razorpay order", row.razorpay_order_id],
            ["Razorpay payment", row.razorpay_payment_id || "Not captured"],
            [
              "Amount",
              `₹${(Number(row.amount) / 100).toLocaleString("en-IN")}`,
            ],
            ["Currency", row.currency],
            ["Status", row.status],
            ["Created", row.created_at],
          ];
  const files = documents.filter(
    (document) => Number(document.application_id) === Number(row.id),
  );
  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-title"
      >
        <header>
          <div>
            <p className="eyebrow">{section.slice(0, -1)} record</p>
            <h2 id="record-title">
              {String(
                row.reference ||
                  row.company ||
                  row.razorpay_order_id ||
                  "Record details",
              )}
            </h2>
          </div>
          <button
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </header>
        <div className="admin-detail-grid">
          {entries.map(([label, value]) => (
            <div
              key={String(label)}
              className={
                label === "Request details" || label === "Message" ? "wide" : ""
              }
            >
              <span>{label}</span>
              <b>{String(value || "—")}</b>
            </div>
          ))}
        </div>
        {section === "applications" && (
          <div className="admin-documents">
            <h3>Submitted documents</h3>
            {files.length ? (
              <div>
                {files.map((file) => (
                  <a
                    key={Number(file.id)}
                    href={`/api/admin/documents/${file.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-solid fa-file-arrow-down" />
                    <span>
                      <b>{file.filename}</b>
                      <small>
                        {file.type} · {file.review_status}
                      </small>
                    </span>
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
                ))}
              </div>
            ) : (
              <p>No documents were attached to this application.</p>
            )}
          </div>
        )}
        <footer>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="btn admin-delete-btn"
            onClick={onDelete}
            disabled={deleting}
          >
            <i
              className={`fa-solid ${deleting ? "fa-spinner fa-spin" : "fa-trash"}`}
            />{" "}
            {deleting ? "Deleting…" : "Delete record"}
          </button>
        </footer>
      </section>
    </div>
  );
}
