import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth";

export type Customer = { id: string; name: string; email: string; company: string; phone: string; createdAt: string };
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
export type Invoice = { id: string; number: string; customerId: string; customerName: string; description: string; amount: number; issueDate: string; dueDate: string; status: InvoiceStatus; paidAt?: string; paymentMethod?: string };
export type WorkspaceData = { customers: Customer[]; invoices: Invoice[] };
type ContextValue = WorkspaceData & {
  ready: boolean;
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  addInvoice: (invoice: Omit<Invoice, "id" | "number" | "issueDate" | "status"> & { status?: InvoiceStatus }) => void;
  updateInvoice: (id: string, update: Partial<Invoice>) => void;
  removeCustomer: (id: string) => void;
};

const STORAGE_KEY = "northstar.workspace.v1";
const DataContext = createContext<ContextValue | null>(null);
const isoDay = (dayOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().slice(0, 10);
};

function makeDemoData(): WorkspaceData {
  const customers: Customer[] = [
    { id: "cus-1", name: "Olivia Rhye", email: "olivia@acmestudio.co", company: "Acme Studio", phone: "+254 712 345 678", createdAt: isoDay(-120) },
    { id: "cus-2", name: "Phoenix Baker", email: "phoenix@baker.co.ke", company: "Baker & Co.", phone: "+254 722 118 404", createdAt: isoDay(-96) },
    { id: "cus-3", name: "Lana Steiner", email: "lana@steiner.co.ke", company: "Steiner Works", phone: "+254 733 209 551", createdAt: isoDay(-78) },
    { id: "cus-4", name: "Demi Wilkinson", email: "demi@wilkinson.africa", company: "Wilkinson Africa", phone: "+254 701 774 902", createdAt: isoDay(-52) },
    { id: "cus-5", name: "Candice Wu", email: "candice@wuconsulting.co.ke", company: "Wu Consulting", phone: "+254 711 009 114", createdAt: isoDay(-33) },
    { id: "cus-6", name: "Natali Craig", email: "natali@craigdesign.co.ke", company: "Craig Design", phone: "+254 720 441 265", createdAt: isoDay(-14) },
  ];
  const invoices: Invoice[] = [
    { id: "inv-1", number: "NS-1048", customerId: "cus-1", customerName: "Olivia Rhye", description: "Brand strategy & design", amount: 128000, issueDate: isoDay(-38), dueDate: isoDay(-8), status: "Paid", paidAt: isoDay(-9), paymentMethod: "M-Pesa" },
    { id: "inv-2", number: "NS-1047", customerId: "cus-2", customerName: "Phoenix Baker", description: "Website development", amount: 245000, issueDate: isoDay(-31), dueDate: isoDay(-1), status: "Paid", paidAt: isoDay(-4), paymentMethod: "Bank transfer" },
    { id: "inv-3", number: "NS-1046", customerId: "cus-3", customerName: "Lana Steiner", description: "Monthly retainer · October", amount: 84000, issueDate: isoDay(-23), dueDate: isoDay(7), status: "Sent" },
    { id: "inv-4", number: "NS-1045", customerId: "cus-4", customerName: "Demi Wilkinson", description: "Product photography", amount: 56750, issueDate: isoDay(-18), dueDate: isoDay(12), status: "Paid", paidAt: isoDay(-10), paymentMethod: "M-Pesa" },
    { id: "inv-5", number: "NS-1044", customerId: "cus-5", customerName: "Candice Wu", description: "Consulting · Q4 kickoff", amount: 175000, issueDate: isoDay(-12), dueDate: isoDay(18), status: "Sent" },
    { id: "inv-6", number: "NS-1043", customerId: "cus-6", customerName: "Natali Craig", description: "Visual identity package", amount: 96000, issueDate: isoDay(-45), dueDate: isoDay(-15), status: "Overdue" },
    { id: "inv-7", number: "NS-1049", customerId: "cus-1", customerName: "Olivia Rhye", description: "Social campaign assets", amount: 42000, issueDate: isoDay(-3), dueDate: isoDay(27), status: "Draft" },
  ];
  return { customers, invoices };
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { account, ready: authReady } = useAuth();
  const [data, setData] = useState<WorkspaceData>(makeDemoData);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const activeKey = account ? `${STORAGE_KEY}:${encodeURIComponent(account.email.toLowerCase())}` : null;
  const ready = Boolean(activeKey && loadedKey === activeKey);
  useEffect(() => {
    if (!authReady) return;
    if (!account || !activeKey) { setLoadedKey(null); return; }
    setLoadedKey(null);
    try {
      const saved = localStorage.getItem(activeKey);
      if (saved) setData(JSON.parse(saved) as WorkspaceData);
      else setData(account.email.toLowerCase() === "demo@northstar.app" ? makeDemoData() : { customers: [], invoices: [] });
    } catch {
      localStorage.removeItem(activeKey);
      setData(account.email.toLowerCase() === "demo@northstar.app" ? makeDemoData() : { customers: [], invoices: [] });
    }
    setLoadedKey(activeKey);
  }, [authReady, account?.email, activeKey]);
  useEffect(() => { if (ready && activeKey) localStorage.setItem(activeKey, JSON.stringify(data)); }, [activeKey, data, ready]);

  const value = useMemo<ContextValue>(() => ({
    ...data,
    ready,
    addCustomer(customer) {
      setData((current) => ({ ...current, customers: [{ ...customer, id: `cus-${crypto.randomUUID()}`, createdAt: isoDay() }, ...current.customers] }));
    },
    addInvoice(invoice) {
      setData((current) => {
        const latest = current.invoices.reduce((max, item) => Math.max(max, Number(item.number.split("-")[1]) || 0), 1042);
        const customer = current.customers.find((item) => item.id === invoice.customerId);
        return { ...current, invoices: [{ ...invoice, id: `inv-${crypto.randomUUID()}`, number: `NS-${latest + 1}`, customerName: customer?.name || invoice.customerName, issueDate: isoDay(), status: invoice.status || "Draft" }, ...current.invoices] };
      });
    },
    updateInvoice(id, update) {
      setData((current) => ({ ...current, invoices: current.invoices.map((invoice) => invoice.id === id ? { ...invoice, ...update } : invoice) }));
    },
    removeCustomer(id) {
      setData((current) => ({ ...current, customers: current.customers.filter((customer) => customer.id !== id) }));
    },
  }), [data, ready]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(DataContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}

export const formatKsh = (amount: number, decimals = 0) => `KSh ${amount.toLocaleString("en-KE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
export const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
