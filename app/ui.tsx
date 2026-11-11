import { Link } from "react-router";

export type IconName = "grid" | "chart" | "people" | "wallet" | "file" | "settings" | "search" | "bell" | "chevron" | "arrow" | "download" | "calendar" | "more" | "up" | "down" | "check" | "menu" | "plus" | "close" | "logout" | "clock" | "mail" | "credit";
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>,
    chart: <><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6M16 7h3v3"/></>,
    people: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V20"/><circle cx="10" cy="7.5" r="3.5"/><path d="M16 4.3a3.5 3.5 0 0 1 0 6.8M20 20v-1.5a4 4 0 0 0-3-3.87"/></>,
    wallet: <><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9h17M16 14h.01"/></>,
    file: <><path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"/><path d="M14 3.5V9h5M8 13h8M8 17h8"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5a7.6 7.6 0 0 0 0-3l1.5-1.2-1.5-2.6-1.8.6a7 7 0 0 0-2.6-1.5L14.2 4h-3l-.4 1.8a7 7 0 0 0-2.6 1.5l-1.8-.6-1.5 2.6 1.5 1.2a7.6 7.6 0 0 0 0 3l-1.5 1.2 1.5 2.6 1.8-.6a7 7 0 0 0 2.6 1.5l.4 1.8h3l.4-1.8a7 7 0 0 0 2.6-1.5l1.8.6 1.5-2.6z" transform="translate(-1 -1) scale(.96)"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4 4"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>, arrow: <><path d="M7 17 17 7M8 7h9v9"/></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 17v3h14v-3"/></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 10h17"/></>,
    more: <><circle cx="5" cy="12" r=".8"/><circle cx="12" cy="12" r=".8"/><circle cx="19" cy="12" r=".8"/></>,
    up: <path d="m6 14 6-6 6 6"/>, down: <path d="m6 10 6 6 6-6"/>, check: <path d="m5 12 4 4L19 6"/>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>, plus: <><path d="M12 5v14M5 12h14"/></>, close: <><path d="m6 6 12 12M18 6 6 18"/></>, logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>, credit: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <section className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> {eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-actions">{action}</div>}</section>;
}

export function Button({ children, variant = "primary", onClick, type = "button", disabled = false }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger"; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  return <button className={`button button-${variant}`} type={type} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return <div className="empty-state"><div className="empty-state-mark"><Icon name="file" size={20} /></div><strong>{title}</strong><p>{detail}</p>{action}</div>;
}

export function PageLink({ to, children }: { to: string; children: React.ReactNode }) { return <Link className="text-link" to={to}>{children}</Link>; }
