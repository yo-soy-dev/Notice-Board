import Layout from "../../components/Layout";
import NoticeForm from "../../components/NoticeForm";
import Link from "next/link";

export default function NewNoticePage() {
  return (
    <Layout title="New Notice">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">
            Notices
          </Link>
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-700 font-semibold">New Notice</span>
        </nav>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h1 className="text-xl font-extrabold text-slate-800 mb-6">Create Notice</h1>
          <NoticeForm />
        </div>
      </div>
    </Layout>
  );
}
