function CategoryStatusBadge({ isActive }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-xs font-medium",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      <span
        className={[
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-gray-400",
        ].join(" ")}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default CategoryStatusBadge;
