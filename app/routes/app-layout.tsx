import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth";
import { useWorkspace } from "../data";
import { Icon, type IconName } from "../ui";

const navigation: { label: string; items: { name: string; path: string; icon: IconName }[] }[] = [
  { label: "OVERVIEW", items: [{ name: "Overview", path: "/", icon: "grid" as const }] },
  { label: "MANAGE", items: [{ name: "Analytics", path: "/analytics", icon: "chart" as const }, { name: "Customers", path: "/customers", icon: "people" as const }, { name: "Invoices", path: "/invoices", icon: "file" as const }, { name: "Payments", path: "/payments", icon: "wallet" as const }] },
  { label: "GROW", items: [{ name: "Reports", path: "/reports", icon: "chart" as const }, { name: "Settings", path: "/settings", icon: "settings" as const }] },
];

export default function AppLayout() {
  const { account, ready: authReady, signOut } = useAuth();
  const { ready: dataReady, invoices } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authReady) return <div className="app-loading"><span className="brand-mark"><span /><span /><span /><span /></span><span>Loading your workspace…</span></div>;
  if (!account) return <Navigate to="/login" replace />;
  if (!dataReady) return <div className="app-loading"><span className="brand-mark"><span /><span /><span /><span /></span><span>Loading your workspace…</span></div>;
  const pending = invoices.filter((invoice) => invoice.status === "Sent" || invoice.status === "Overdue").length;
  const initials = account.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    if (query) navigate(`/customers?search=${encodeURIComponent(query)}`);
  }

  return <div className="app-shell">
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <Link className="brand brand-link" to="/"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">northstar</span></Link>
      <div className="workspace-switch"><span className="workspace-avatar">{account.company.slice(0, 1).toUpperCase()}</span><span className="workspace-copy"><strong>{account.company}</strong><small>Client workspace</small></span><span className="workspace-pill">KE</span></div>
      <nav className="nav-sections">{navigation.map((group) => <div className="nav-group" key={group.label}><p className="nav-label">{group.label}</p>{group.items.map((item) => <NavLink key={item.path} to={item.path} end={item.path === "/"} className={({ isActive }) => `nav-item ${isActive ? "selected" : ""}`} onClick={() => setMobileOpen(false)}><Icon name={item.icon} size={17} /><span>{item.name}</span>{item.name === "Invoices" && pending > 0 && <span className="nav-count">{pending}</span>}</NavLink>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><Icon name="check" size={16} /></span><strong>Business, in focus.</strong><p>Customers, invoices, and payments together in one place.</p><Link to="/reports">Explore reports <Icon name="chevron" size={13} /></Link></div>
        <div className="profile-wrap"><button className="profile" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><span className="profile-avatar">{initials}</span><span className="profile-copy"><strong>{account.name}</strong><small>{account.email}</small></span><Icon name="more" size={17} /></button>{menuOpen && <div className="profile-menu"><Link to="/settings" onClick={() => setMenuOpen(false)}><Icon name="settings" size={15} /> Account settings</Link><button onClick={() => { signOut(); navigate("/login"); }}><Icon name="logout" size={15} /> Log out</button></div>}</div>
      </div>
    </aside>
    <main className="main-area"><header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation"><Icon name="menu" /></button><div className="breadcrumbs"><Link to="/">Workspace</Link><Icon name="chevron" size={13} /><strong>{navigation.flatMap((group) => group.items).find((item) => item.path === location.pathname)?.name || "Overview"}</strong></div><div className="topbar-actions"><form className="search-trigger search-form" onSubmit={handleSearch}><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers..." aria-label="Search customers" /><kbd>↵</kbd></form><span className="topbar-divider" /><button className="topbar-avatar" onClick={() => navigate("/settings")} aria-label="Open account settings">{initials}</button></div></header><div className="page-content"><Outlet /></div></main>
  </div>;
}
