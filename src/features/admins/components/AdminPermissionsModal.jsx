import { useMemo, useState } from "react";
import { Shield, X, Info } from "lucide-react";
import { toast } from "sonner";

import { PERMISSIONS } from "../../auth/authorization/permissions";
import PermissionSelector from "./PermissionSelector";
import { useAdmin } from "../hooks/useAdmin";
import { useUpdateAdminPermissions } from "../hooks/useAdminMutations";

function AdminPermissionsForm({
  initialPermissions,
  isPending,
  onSave,
  onClose,
}) {
  const [selectedPermissions, setSelectedPermissions] = useState(
    initialPermissions || [],
  );

  const permissionEntries = useMemo(
    () =>
      Object.entries(PERMISSIONS).map(([key, value]) => ({
        key,
        value,
      })),
    [],
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <PermissionSelector
          permissions={selectedPermissions}
          permissionEntries={permissionEntries}
          onChange={setSelectedPermissions}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-slate-200/80 px-6 py-3.5 bg-slate-50/50">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="h-9.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onSave(selectedPermissions)}
          disabled={isPending}
          className="h-9.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </>
  );
}

function AdminPermissionsModalContent({ adminId, open, onClose }) {
  const { admin, permissions, isLoading } = useAdmin(adminId, open);
  const mutation = useUpdateAdminPermissions();

  const handleClose = () => {
    mutation.reset();
    onClose();
  };

  const handleSave = async (selectedPermissions) => {
    try {
      const response = await mutation.mutateAsync({
        adminId,
        permissions: selectedPermissions,
      });

      toast.success(response?.message || "Permissions updated successfully.");
      handleClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update permissions.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <button
        type="button"
        aria-label="Close modal background"
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Manage Access Permissions
              </h2>
              <p className="text-xs text-slate-500">
                {admin?.name
                  ? `Configuring permissions for ${admin.name}`
                  : "Loading permissions..."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {isLoading ? (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : admin?.role === "owner" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex items-start gap-3.5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 text-amber-900">
                <Info size={20} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold">System Owner Access</h3>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800">
                    This user holds the <strong>Owner</strong> role. Owners
                    automatically have unrestricted access across all features,
                    so individual permissions do not need to be assigned.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-200/80 px-6 py-3.5 bg-slate-50/50">
              <button
                type="button"
                onClick={handleClose}
                className="h-9.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <AdminPermissionsForm
            initialPermissions={permissions}
            isPending={mutation.isPending}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminPermissionsModal(props) {
  if (!props.open) return null;

  return (
    <AdminPermissionsModalContent
      key={`${props.adminId}-${Boolean(props.open)}`}
      {...props}
    />
  );
}
