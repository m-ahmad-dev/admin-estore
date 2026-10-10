import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Store,
  Users,
  ShieldCheck,
  Box,
  Package,
  Ticket,
  Microscope,
  Earth,
} from "lucide-react";

import { useAuth } from "../features/auth/hooks/useAuth";
import { useAuthorization } from "../features/auth/hooks/useAuthorization";
import { useLogout } from "../features/auth/hooks/useLogout";
import { PERMISSIONS } from "../features/auth/authorization/permissions";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const { admin } = useAuth();
  const { can } = useAuthorization();
  const { logout, isLoggingOut } = useLogout();

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      permission: PERMISSIONS.DASHBOARD_VIEW,
    },
    {
      label: "Administrators",
      icon: ShieldCheck,
      path: "/admins",
      permission: PERMISSIONS.ADMINS_VIEW,
    },
    {
      label: "Categories",
      icon: LayoutGrid,
      path: "/categories",
      permission: PERMISSIONS.CATEGORIES_VIEW,
    },
    {
      label: "Customers",
      icon: Users,
      path: "/customers",
      permission: PERMISSIONS.CUSTOMERS_VIEW,
    },
    {
      label: "Orders",
      icon: Box,
      path: "/orders",
      permission: PERMISSIONS.ORDERS_VIEW,
    },
    {
      label: "Products",
      icon: Package,
      path: "/products",
      permission: PERMISSIONS.PRODUCTS_VIEW,
    },
    {
      label: "Coupons",
      icon: Ticket,
      path: "/coupons",
      permission: PERMISSIONS.COUPONS_VIEW,
    },
    {
      label: "Reviews",
      icon: Microscope,
      path: "/reviews",
      permission: PERMISSIONS.REVIEWS_VIEW,
    },
    {
      label: "Countries",
      icon: Earth,
      path: "/countries",
      permission: PERMISSIONS.COUNTRIES_VIEW,
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission) {
      return false;
    }

    return can(item.permission);
  });

  const initial = admin?.email ? admin.email.charAt(0).toUpperCase() : "A";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <Store size={18} />
          </div>

          <span className={styles.brandTitle}>E-Store Admin</span>
        </div>

        <nav className={styles.navigation}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.activeNavLink : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className={styles.logoutBtn}
          >
            <LogOut size={18} />

            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <h2 className="text-sm font-medium text-[--text-secondary]">
            Control Panel
          </h2>

          <div className={styles.userBadge}>
            <div className={styles.avatar}>{initial}</div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {admin?.email || "Admin User"}
              </span>

              <span className={styles.userRole}>
                {admin?.role === "owner" ? "Owner" : "Administrator"}
              </span>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
