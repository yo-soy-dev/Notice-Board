import { useState } from "react";
import Layout from "../components/Layout";
import NoticeCard from "../components/NoticeCard";
import Link from "next/link";
import prisma from "../lib/prisma";

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: "desc" },   // Urgent > Normal
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

  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  const urgentCount = notices.filter((n) => n.priority === "Urgent").length;

  return (
    <Layout title="Notice Board">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            All Notices
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {notices.length === 0
              ? "No notices yet"
              : `${notices.length} notice${notices.length !== 1 ? "s" : ""}${
                  urgentCount > 0 ? ` · ${urgentCount} urgent` : ""
                }`}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {notices.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">No notices yet</h2>
          <p className="text-slate-500 text-sm mb-6">Get started by creating your first notice.</p>
          <Link
            href="/notices/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create First Notice
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </Layout>
  );
}
