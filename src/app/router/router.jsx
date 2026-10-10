import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../../features/auth/pages/LoginPage";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import PermissionRoute from "../../features/auth/components/PermissionRoute";
import AdminLayout from "../../layouts/AdminLayout";
import AuthLayout from "../../layouts/AuthLayout";
import DashboardPage from "../../features/dashboard/pages/DashboardPage.jsx";
import RootRedirect from "../../components/routing/RootRedirect";
import NotFoundPage from "../../components/routing/NotFoundPage.jsx";
import ForbiddenPage from "../../components/routing/ForbiddenPage";
import { PERMISSIONS } from "../../features/auth/authorization/permissions";
import AdminsPage from "../../features/admins/pages/AdminsPage.jsx";
import OrdersPage from "../../features/orders/pages/OrdersPage.jsx";
import CustomersPage from "../../features/customers/pages/CustomersPage.jsx";
import CategoriesPage from "../../features/categories/pages/CategoriesPage.jsx";
import ProductsPage from "../../features/products/pages/ProductsPage.jsx";
import CouponsPage from "../../features/coupons/pages/CouponsPage.jsx";
import ReviewsPage from "../../features/reviews/pages/ReviewsPage.jsx";
import CountriesPage from "../../features/countries/pages/CountriesPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            element: (
              <PermissionRoute permission={PERMISSIONS.DASHBOARD_VIEW} />
            ),
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
              },
            ],
          },

          {
            element: <PermissionRoute permission={PERMISSIONS.ADMINS_VIEW} />,
            children: [
              {
                path: "/admins",
                element: <AdminsPage />,
              },
            ],
          },

          {
            element: <PermissionRoute permission={PERMISSIONS.ORDERS_VIEW} />,
            children: [
              {
                path: "/orders",
                element: <OrdersPage />,
              },
            ],
          },

          {
            element: (
              <PermissionRoute permission={PERMISSIONS.CUSTOMERS_VIEW} />
            ),
            children: [
              {
                path: "/customers",
                element: <CustomersPage />,
              },
            ],
          },

          {
            element: (
              <PermissionRoute permission={PERMISSIONS.CATEGORIES_VIEW} />
            ),
            children: [
              {
                path: "/categories",
                element: <CategoriesPage />,
              },
            ],
          },

          {
            element: <PermissionRoute permission={PERMISSIONS.PRODUCTS_VIEW} />,
            children: [
              {
                path: "/products",
                element: <ProductsPage />,
              },
            ],
          },

          {
            element: <PermissionRoute permission={PERMISSIONS.COUPONS_VIEW} />,
            children: [
              {
                path: "/coupons",
                element: <CouponsPage />,
              },
            ],
          },

          {
            element: <PermissionRoute permission={PERMISSIONS.REVIEWS_VIEW} />,
            children: [
              {
                path: "/reviews",
                element: <ReviewsPage />,
              },
            ],
          },

          {
            element: (
              <PermissionRoute permission={PERMISSIONS.COUNTRIES_VIEW} />
            ),
            children: [
              {
                path: "/countries",
                element: <CountriesPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/403",
    element: <ForbiddenPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
