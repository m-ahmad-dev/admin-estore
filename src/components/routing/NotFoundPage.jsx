import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  HelpCircle,
  FileQuestion,
} from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[--bg-app,#f8fafc] flex items-center justify-center p-6 text-[--text-primary,#0f172a]">
      <div className="max-w-md w-full text-center">
        {/* Visual Icon Badge */}
        <div className="mx-auto w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-xs">
          <FileQuestion size={32} strokeWidth={1.75} />
        </div>

        {/* 404 Pill */}
        <span className="inline-block px-3 py-1 bg-indigo-100/80 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
          Error 404
        </span>

        {/* Title & Description */}
        <h1 className="text-3xl font-bold tracking-tight text-[--text-primary,#0f172a]">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-[--text-secondary,#475569] leading-relaxed">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved, deleted, or does not exist.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[--border-subtle,#e2e8f0] text-[--text-primary,#0f172a] text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-[--brand-primary-hover,#4338ca] transition-colors shadow-xs"
          >
            <LayoutDashboard size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-12 pt-6 border-t border-[--border-subtle,#e2e8f0] flex items-center justify-center gap-2 text-xs text-[--text-muted,#94a3b8]">
          <HelpCircle size={14} />
          <span>Need help? Contact system administrator</span>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
