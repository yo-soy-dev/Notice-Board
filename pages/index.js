import { useState } from "react";
import Layout from "../components/Layout";
import NoticeCard from "../components/NoticeCard";
import Link from "next/link";
import prisma from "../lib/prisma";

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: "desc" },
      { publishDate: "desc" },
    ],
  });

  return {
    props: {
      initialNotices: notices.map((n) => ({
        ...n,
        publishDate: n.publishDate.toISOString(),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    },
  };
}

export default function HomePage({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  // Filter logic
  const filtered = notices.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      filterCategory === "All" || n.category === filterCategory;
    const matchPriority =
      filterPriority === "All" || n.priority === filterPriority;
    return matchSearch && matchCategory && matchPriority;
  });

  const urgentCount = filtered.filter((n) => n.priority === "Urgent").length;

  return (
    <Layout title="Notice Board">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            All Notices
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length === 0
              ? "No notices found"
              : `${filtered.length} notice${filtered.length !== 1 ? "s" : ""}${
                  urgentCount > 0 ? ` · ${urgentCount} urgent` : ""
                }`}
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white"
        />

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
        >
          <option value="All">All Priorities</option>
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
        </select>

        {/* Clear Button */}
        {(search || filterCategory !== "All" || filterPriority !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setFilterCategory("All");
              setFilterPriority("All");
            }}
            className="px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">
            {notices.length === 0 ? "No notices yet" : "No notices found"}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {notices.length === 0
              ? "Get started by creating your first notice."
              : "Try changing your search or filters."}
          </p>
          {notices.length === 0 && (
            <Link
              href="/notices/new"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Create First Notice
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </Layout>
  );
}