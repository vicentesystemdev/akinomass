import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { CRMPage } from "./components/pages/CRMPage";
import { InventoryPage } from "./components/pages/InventoryPage";
import { OrdersPage } from "./components/pages/OrdersPage";
import { PaymentsPage } from "./components/pages/PaymentsPage";
import { SalesPage } from "./components/pages/SalesPage";
import { SocialPage } from "./components/pages/SocialPage";
import { LiveSalesPage } from "./components/pages/LiveSalesPage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { UsersPage } from "./components/pages/UsersPage";
import { StorePage } from "./components/pages/StorePage";
import { CheckoutPage } from "./components/pages/CheckoutPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/store",
    Component: StorePage,
  },
  {
    path: "/checkout",
    Component: CheckoutPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
      { path: "crm", Component: CRMPage },
      { path: "inventory", Component: InventoryPage },
      { path: "orders", Component: OrdersPage },
      { path: "payments", Component: PaymentsPage },
      { path: "sales", Component: SalesPage },
      { path: "social", Component: SocialPage },
      { path: "live-sales", Component: LiveSalesPage },
      { path: "reports", Component: ReportsPage },
      { path: "users", Component: UsersPage },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/store" replace />,
  },
]);
