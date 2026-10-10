import {
  Eye,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  ShieldAlert,
} from "lucide-react";

import PermissionGate from "../../auth/components/PermissionGate";
import { PERMISSIONS } from "../../auth/authorization/permissions";
import AdminStatusBadge, { AdminRoleBadge } from "./AdminStatusBadge";

function AdminsTable({
  admins,
  currentAdminId,
  onView,
  onPermissions,
  onToggleStatus,
  onDelete,
}) {
  if (!admins.length) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <ShieldAlert size={22} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No administrators found
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
          No records match your search query or criteria. Try clearing your
          filters or adding a new administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Administrator</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Permissions</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {admins.map((admin) => {
                const isCurrentAdmin = admin.id === currentAdminId;
                const permissionCount =
                  admin.role === "owner"
                    ? "*"
                    : (admin.permission_count ??
                      admin._count?.permissions ??
                      0);

                return (
                  <tr
                    key={admin.id}
                    className="transition hover:bg-slate-50/60"
                  >
                    {/* Admin Profile Cell */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-semibold text-white text-sm shadow-xs">
                          {admin.name?.charAt(0)?.toUpperCase() ||
                            admin.email?.charAt(0)?.toUpperCase() ||
                            "A"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-semibold text-slate-900">
                              {admin.name}
                            </span>
                            {isCurrentAdmin && (
                              <span className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                You
                              </span>
                            )}
                          </div>
                          <span className="block truncate text-xs text-slate-500">
                            {admin.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Cell */}
                    <td className="px-5 py-4">
                      <AdminRoleBadge role={admin.role} />
                    </td>

                    {/* Status Cell */}
                    <td className="px-5 py-4">
                      <AdminStatusBadge isActive={admin.is_active} />
                    </td>

                    {/* Permission Count Cell */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {permissionCount}
                        </span>
                        <span className="text-xs text-slate-500">
                          {admin.role === "owner" ? "" : "assigned"}
                        </span>
                      </div>
                    </td>

                    {/* Actions Cell */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(admin.id)}
                          title="View Details"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={16} />
                        </button>

                        <PermissionGate permission={PERMISSIONS.ADMINS_EDIT}>
                          <button
                            type="button"
                            onClick={() => onPermissions(admin.id)}
                            title="Manage Permissions"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Shield size={16} />
                          </button>
                        </PermissionGate>

                        <PermissionGate
                          permission={PERMISSIONS.ADMINS_DEACTIVATE}
                        >
                          {!isCurrentAdmin && (
                            <button
                              type="button"
                              onClick={() => onToggleStatus(admin)}
                              title={
                                admin.is_active ? "Deactivate" : "Activate"
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              {admin.is_active ? (
                                <UserX size={16} className="text-amber-600" />
                              ) : (
                                <UserCheck
                                  size={16}
                                  className="text-emerald-600"
                                />
                              )}
                            </button>
                          )}
                        </PermissionGate>

                        <PermissionGate permission={PERMISSIONS.ADMINS_DELETE}>
                          {!isCurrentAdmin && (
                            <button
                              type="button"
                              onClick={() => onDelete(admin)}
                              title="Delete Administrator"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </PermissionGate>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {admins.map((admin) => {
          const isCurrentAdmin = admin.id === currentAdminId;
          const permissionCount =
            admin.permission_count ?? admin._count?.permissions ?? 0;

          return (
            <div
              key={admin.id}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-semibold text-white text-sm">
                    {admin.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-slate-900">
                        {admin.name}
                      </h4>
                      {isCurrentAdmin && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{admin.email}</p>
                  </div>
                </div>
                <AdminStatusBadge isActive={admin.is_active} />
              </div>

              <div className="flex items-center justify-between border-t border-b border-slate-100 py-2.5 text-xs text-slate-600">
                <AdminRoleBadge role={admin.role} />
                <span className="font-medium">
                  <strong className="text-slate-900">{permissionCount}</strong>{" "}
                  permissions
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onView(admin.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Eye size={14} /> View
                </button>

                <PermissionGate permission={PERMISSIONS.ADMINS_EDIT}>
                  <button
                    type="button"
                    onClick={() => onPermissions(admin.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Shield size={14} /> Permissions
                  </button>
                </PermissionGate>

                <PermissionGate permission={PERMISSIONS.ADMINS_DELETE}>
                  {!isCurrentAdmin && (
                    <button
                      type="button"
                      onClick={() => onDelete(admin)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </PermissionGate>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminsTable;
