import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("/", "routes/app-layout.tsx", [
    index("routes/home.tsx"),
    route("analytics", "routes/analytics.tsx"),
    route("customers", "routes/customers.tsx"),
    route("invoices", "routes/invoices.tsx"),
    route("payments", "routes/payments.tsx"),
    route("reports", "routes/reports.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
