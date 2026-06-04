import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORY_COLORS = {
  Exam: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Event: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  General: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
};

export default function NoticeCard({ notice, onDeleted }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const cat = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS.General;

  const publishDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onDeleted(notice.id);
    } catch (err) {
      alert("Failed to delete notice. Please try again.");
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <div
        className={`relative bg-white rounded-2xl shadow-sm border ${
          notice.priority === "Urgent" ? "border-red-300 ring-1 ring-red-200" : "border-slate-200"
        } overflow-hidden flex flex-col transition-shadow hover:shadow-md`}
      >
        {/* Urgent stripe */}
        {notice.priority === "Urgent" && (
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-400 w-full" />
        )}

        {/* Image */}
        {notice.imageUrl && (
          <div className="w-full h-44 overflow-hidden bg-slate-100">
            <img
              src={notice.imageUrl}
              alt={notice.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Top badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {notice.priority === "Urgent" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                Urgent
              </span>
            )}
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat.bg} ${cat.text} border ${cat.border}`}
            >
              {notice.category}
            </span>
            <span className="ml-auto text-xs text-slate-400 font-medium tabular-nums">
              {publishDate}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-slate-800 mb-2 leading-snug line-clamp-2">
            {notice.title}
          </h2>

          {/* Body */}
          <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-3">
            {notice.body}
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => router.push(`/notices/edit/${notice.id}`)}
              className="flex-1 text-sm font-semibold text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg px-3 py-2 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Delete Notice?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              &ldquo;{notice.title}&rdquo; will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
