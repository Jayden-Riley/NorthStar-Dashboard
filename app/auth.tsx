import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Account = { name: string; email: string; company: string };
type AuthContextValue = {
  account: Account | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, company: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  resetPassword: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => void;
  updateAccount: (updates: Partial<Pick<Account, "name" | "company">>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "northstar.account.v1";
async function passwordDigest(password: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setAccount(JSON.parse(saved) as Account);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    account,
    ready,
    async signIn(email, password) {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return { ok: false, message: "Enter a valid email address." };
      if (!password.trim()) return { ok: false, message: "Enter your password to continue." };
      if (email.trim().toLowerCase() === "demo@northstar.app" && password === "northstar") {
        const demo = { name: "Alex Morgan", email: "demo@northstar.app", company: "Acme Studio" };
        localStorage.setItem(SESSION_KEY, JSON.stringify(demo));
        setAccount(demo);
        return { ok: true };
      }
      const saved = localStorage.getItem(`northstar.user:${email.trim().toLowerCase()}`);
      if (saved) {
        const user = JSON.parse(saved) as Account & { passwordDigest: string };
        if (user.passwordDigest !== await passwordDigest(password)) return { ok: false, message: "That email and password don’t match." };
        const next = { name: user.name, email: user.email, company: user.company };
        localStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setAccount(next);
        return { ok: true };
      }
      return { ok: false, message: "No account was found for that email. Create an account or use the demo workspace." };
    },
    async register(name, email, company, password) {
      if (name.trim().length < 2) return { ok: false, message: "Add your name to create an account." };
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return { ok: false, message: "Enter a valid email address." };
      if (password.length < 8) return { ok: false, message: "Use at least 8 characters for your password." };
      const key = `northstar.user:${email.trim().toLowerCase()}`;
      if (localStorage.getItem(key)) return { ok: false, message: "An account with this email already exists. Sign in instead." };
      const next = { name: name.trim(), email: email.trim().toLowerCase(), company: company.trim() || "My workspace" };
      localStorage.setItem(key, JSON.stringify({ ...next, passwordDigest: await passwordDigest(password) }));
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setAccount(next);
      return { ok: true };
    },
    async resetPassword(email, password) {
      if (password.length < 8) return { ok: false, message: "Use at least 8 characters for your password." };
      const key = `northstar.user:${email.trim().toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (!saved) return { ok: false, message: "No local account was found. Create an account first." };
      const user = JSON.parse(saved) as Account & { passwordDigest: string };
      localStorage.setItem(key, JSON.stringify({ ...user, passwordDigest: await passwordDigest(password) }));
      return { ok: true };
    },
    signOut() {
      localStorage.removeItem(SESSION_KEY);
      setAccount(null);
    },
    updateAccount(updates) {
      if (!account) return;
      const next = { ...account, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      const key = `northstar.user:${account.email.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (saved) localStorage.setItem(key, JSON.stringify({ ...(JSON.parse(saved) as object), ...next }));
      setAccount(next);
    },
  }), [account, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
