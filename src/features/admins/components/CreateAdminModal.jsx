import { useMemo, useState } from "react";
import { Eye, EyeOff, X, UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PERMISSIONS } from "../../auth/authorization/permissions";
import PermissionSelector from "./PermissionSelector";
import { createAdminSchema } from "../schemas/admin.schema";
import { useCreateAdmin } from "../hooks/useAdminMutations";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  permissions: [],
};

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="mt-1 text-xs text-rose-600 font-medium">{error.message}</p>
  );
}

function CreateAdminModal({ open, onClose, onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const createMutation = useCreateAdmin();

  const permissionEntries = useMemo(
    () =>
      Object.entries(PERMISSIONS).map(([key, value]) => ({
        key,
        value,
      })),
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAdminSchema),
    defaultValues,
  });

  if (!open) return null;

  const handleClose = () => {
    reset(defaultValues);
    setShowPassword(false);
    createMutation.reset();
    onClose();
  };

  const onSubmit = async (values) => {
    try {
      const response = await createMutation.mutateAsync(values);
      onSuccess(response?.message || "Administrator created successfully.");
      handleClose();
    } catch {
      // API error state is handled via mutation error banner below
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Create New Administrator
              </h2>
              <p className="text-xs text-slate-500">
                Provision account credentials and set initial permission rules.
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

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {createMutation.isError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
                {createMutation.error?.response?.data?.message ||
                  "Failed to create administrator account."}
              </div>
            )}

            {/* Credential Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Sarah Jenkins"
                  className="mt-1.5 h-9.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
                />
                <FieldError error={errors.name} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="off"
                  placeholder="sarah@store.com"
                  className="mt-1.5 h-9.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
                />
                <FieldError error={errors.email} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="h-9.5 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 top-0 flex h-9.5 w-9.5 items-center justify-center text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError error={errors.password} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Phone Number{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <input
                  {...register("phone")}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1.5 h-9.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
                />
                <FieldError error={errors.phone} />
              </div>
            </div>

            {/* Permission Selector Section */}
            <div className="border-t border-slate-200/80 pt-5 space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Initial Permissions
                </h3>
                <p className="text-xs text-slate-500">
                  Assign initial access scope for this account.
                </p>
              </div>

              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <PermissionSelector
                    permissions={field.value}
                    permissionEntries={permissionEntries}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200/80 px-6 py-3.5 bg-slate-50/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="h-9.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="h-9.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAdminModal;
