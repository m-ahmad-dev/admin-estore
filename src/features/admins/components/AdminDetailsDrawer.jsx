import { useEffect } from "react";
import {
  CalendarDays,
  Mail,
  Phone,
  Shield,
  X,
  CheckCircle2,
} from "lucide-react";

import AdminStatusBadge, { AdminRoleBadge } from "./AdminStatusBadge";
import { useAdmin } from "../hooks/useAdmin";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
      <div className="mt-0.5 text-slate-400">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

function AdminDetailsDrawer({ adminId, open, onClose }) {
  const {
    admin,
    permissions = [],
    isLoading,
    isError,
  } = useAdmin(adminId, open);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close drawer backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Account Overview
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {admin?.name || "Administrator Profile"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 rounded-xl bg-slate-100" />
              <div className="h-14 rounded-lg bg-slate-100" />
              <div className="h-14 rounded-lg bg-slate-100" />
              <div className="h-40 rounded-xl bg-slate-100" />
            </div>
          )}

          {!isLoading && isError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load administrator details. Please try again.
            </div>
          )}

          {!isLoading && !isError && admin && (
            <>
              {/* Profile Card Header */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white shadow-sm">
                    {admin.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {admin.name}
                    </h3>
                    <p className="truncate text-xs text-slate-500">
                      {admin.email}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <AdminStatusBadge isActive={admin.is_active} />
                      <AdminRoleBadge role={admin.role} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Account Attributes */}
              <div className="space-y-2.5">
                <DetailRow icon={Mail} label="Email Address">
                  {admin.email}
                </DetailRow>
                <DetailRow icon={Phone} label="Phone Number">
                  {admin.phone_number || "Not provided"}
                </DetailRow>
                <DetailRow icon={CalendarDays} label="Created At">
                  {formatDate(admin.created_at)}
                </DetailRow>
              </div>

              {/* Permissions Overview */}
              <div className="border-t border-slate-200/80 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Assigned Permissions
                    </h4>
                    <p className="text-xs text-slate-500">
                      {permissions.length} total permissions enabled
                    </p>
                  </div>
                  <Shield size={18} className="text-slate-400" />
                </div>

                {permissions.length ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono text-slate-700"
                      >
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        {permission}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    No individual permissions assigned.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default AdminDetailsDrawer;
