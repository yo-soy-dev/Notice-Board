import { useState } from "react";
import { useRouter } from "next/router";

const EMPTY_FORM = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
  imageUrl: "",
};

const CATEGORIES = ["General", "Exam", "Event"];

const CATEGORY_STYLES = {
  General: { active: "bg-slate-700 text-white border-slate-700", inactive: "bg-white text-slate-600 border-slate-200 hover:border-slate-400" },
  Exam: { active: "bg-blue-600 text-white border-blue-600", inactive: "bg-white text-blue-600 border-blue-200 hover:border-blue-400" },
  Event: { active: "bg-emerald-600 text-white border-emerald-600", inactive: "bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400" },
};

export default function NoticeForm({ initial = null, noticeId = null }) {
  const router = useRouter();
  const isEdit = !!noticeId;

  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title || "",
          body: initial.body || "",
          category: initial.category || "General",
          priority: initial.priority || "Normal",
          publishDate: initial.publishDate
            ? new Date(initial.publishDate).toISOString().split("T")[0]
            : "",
          imageUrl: initial.imageUrl || "",
        }
      : EMPTY_FORM
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setErrors({});

    const url = isEdit ? `/api/notices/${noticeId}` : "/api/notices";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setServerError("Network error. Please check your connection.");
      setSubmitting(false);
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? "border-red-400 focus:ring-red-200 bg-red-50"
        : "border-slate-200 focus:ring-green-200 focus:border-green-400 bg-slate-50"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Title */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Mid-semester Exam Schedule"
          maxLength={255}
          className={inputClass("title")}
        />
        {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>}
      </div>

      {/* Body */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          Body <span className="text-red-500">*</span>
        </label>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          rows={5}
          placeholder="Write the full notice content here…"
          className={`${inputClass("body")} resize-y`}
        />
        {errors.body && <p className="mt-1.5 text-xs text-red-600">{errors.body}</p>}
      </div>

      {/* Category — Pill Buttons */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const style = CATEGORY_STYLES[cat];
            const isActive = form.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setField("category", cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  isActive ? style.active : style.inactive
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {errors.category && <p className="mt-1.5 text-xs text-red-600">{errors.category}</p>}
      </div>

      {/* Priority — Toggle */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setField("priority", "Normal")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${
              form.priority === "Normal"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            ✓ Normal
          </button>
          <button
            type="button"
            onClick={() => setField("priority", "Urgent")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${
              form.priority === "Urgent"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-red-500 border-red-200 hover:border-red-400"
            }`}
          >
            🔴 Urgent
          </button>
        </div>
        {errors.priority && <p className="mt-1.5 text-xs text-red-600">{errors.priority}</p>}
      </div>

      {/* Publish Date */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          Publish Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          className={inputClass("publishDate")}
        />
        {errors.publishDate && (
          <p className="mt-1.5 text-xs text-red-600">{errors.publishDate}</p>
        )}
      </div>

      {/* Image URL */}
      <div className="mb-7">
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          Image URL{" "}
          <span className="text-xs font-normal text-slate-400 ml-1">optional</span>
        </label>
        <input
          type="url"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={inputClass("imageUrl")}
        />
        {form.imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-32 bg-slate-50">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 sm:flex-none sm:px-8 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-sm"
        >
          {submitting
            ? isEdit ? "Saving…" : "Creating…"
            : isEdit ? "Save Changes" : "Create Notice"}
        </button>
      </div>
    </form>
  );
}