import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, RefreshCw } from "lucide-react";

import PermissionGate from "../../auth/components/PermissionGate";
import { PERMISSIONS } from "../../auth/authorization/permissions";
import { useAuth } from "../../auth/hooks/useAuth";

import AdminsPageHeader from "../components/AdminsPageHeader";
import AdminsTable from "../components/AdminsTable";
import AdminDetailsDrawer from "../components/AdminDetailsDrawer";
import AdminPermissionsModal from "../components/AdminPermissionsModal";
import CreateAdminModal from "../components/CreateAdminModal";
import DeleteAdminDialog from "../components/DeleteAdminDialog";

import { useAdmins } from "../hooks/useAdmins";
import {
  useDeleteAdmin,
  useUpdateAdminStatus,
} from "../hooks/useAdminMutations";

function AdminsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="h-4 w-96 max-w-full rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-200" />
        ))}
      </div>

      <div className="h-12 rounded-xl bg-slate-200" />

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

function AdminsError({ onRetry }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <ShieldAlert size={22} />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">
        Unable to Load Administrators
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs text-slate-500">
        There was an issue fetching administrator account records from the
        server.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        <RefreshCw size={14} /> Retry Connection
      </button>
    </div>
  );
}

function AdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const {
    admins = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdmins();

  const updateStatusMutation = useUpdateAdminStatus();
  const deleteMutation = useDeleteAdmin();

  const [createOpen, setCreateOpen] = useState(false);
  const [detailsAdminId, setDetailsAdminId] = useState(null);
  const [permissionsAdminId, setPermissionsAdminId] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (!error) return;
    toast.error(
      error.response?.data?.message || "Failed to load administrators.",
    );
  }, [error]);

  // Derived Metrics
  const metrics = useMemo(() => {
    return {
      total: admins.length,
      active: admins.filter((a) => a.is_active).length,
      inactive: admins.filter((a) => !a.is_active).length,
      owners: admins.filter((a) => a.role === "owner").length,
    };
  }, [admins]);

  // Filtered List Computation
  const visibleAdmins = useMemo(() => {
    return admins.filter((admin) => {
      // Search term filtering
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        admin.name?.toLowerCase().includes(query) ||
        admin.email?.toLowerCase().includes(query);

      // Status filtering
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && admin.is_active) ||
        (statusFilter === "inactive" && !admin.is_active);

      // Role filtering
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "owner" && admin.role === "owner") ||
        (roleFilter === "admin" && admin.role !== "owner");

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [admins, searchQuery, statusFilter, roleFilter]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Administrators list updated.");
    } catch {
      toast.error("Failed to refresh administrators.");
    }
  };

  const handleToggleStatus = async (admin) => {
    const nextStatus = admin.is_active ? "deactive" : "active";

    try {
      const response = await updateStatusMutation.mutateAsync({
        adminId: admin.id,
        status: nextStatus,
      });

      toast.success(response?.message || "Administrator status updated.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update administrator status.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteAdmin) return;

    try {
      const response = await deleteMutation.mutateAsync(deleteAdmin.id);
      toast.success(response?.message || "Administrator deleted successfully.");
      setDeleteAdmin(null);

      if (detailsAdminId === deleteAdmin.id) setDetailsAdminId(null);
      if (permissionsAdminId === deleteAdmin.id) setPermissionsAdminId(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete administrator.",
      );
    }
  };

  if (isLoading) {
    return <AdminsSkeleton />;
  }

  if (isError && !admins.length) {
    return <AdminsError onRetry={handleRefresh} />;
  }

  return (
    <PermissionGate
      permission={PERMISSIONS.ADMINS_VIEW}
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <h3 className="font-bold text-slate-900">Access Restricted</h3>
          <p className="mt-1 text-xs text-slate-500">
            You do not have permission to view administrator management.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <AdminsPageHeader
          adminCount={visibleAdmins.length}
          metrics={metrics}
          isFetching={isFetching}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onRefresh={handleRefresh}
          onCreate={() => setCreateOpen(true)}
        />

        <AdminsTable
          admins={visibleAdmins}
          currentAdminId={currentAdmin?.id}
          onView={setDetailsAdminId}
          onPermissions={setPermissionsAdminId}
          onToggleStatus={handleToggleStatus}
          onDelete={setDeleteAdmin}
        />

        <CreateAdminModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={(message) => toast.success(message)}
        />

        <AdminDetailsDrawer
          adminId={detailsAdminId}
          open={Boolean(detailsAdminId)}
          onClose={() => setDetailsAdminId(null)}
        />

        <AdminPermissionsModal
          adminId={permissionsAdminId}
          open={Boolean(permissionsAdminId)}
          onClose={() => setPermissionsAdminId(null)}
        />

        <DeleteAdminDialog
          admin={deleteAdmin}
          open={Boolean(deleteAdmin)}
          isDeleting={deleteMutation.isPending}
          onClose={() => {
            if (!deleteMutation.isPending) setDeleteAdmin(null);
          }}
          onConfirm={handleDelete}
        />
      </div>
    </PermissionGate>
  );
}

export default AdminsPage;
