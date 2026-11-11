import { useState } from "react";
import type { Route } from "./+types/register";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../auth";
import { Icon } from "../ui";

export function meta({}: Route.MetaArgs) { return [{ title: "Create account · Northstar" }]; }

export default function Register() {
  const { account, ready, register } = useAuth(); const navigate = useNavigate();
  const [name, setName] = useState(""); const [company, setCompany] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  if (ready && account) return <Navigate to="/" replace />;
  if (!ready) return <div className="auth-loading">Loading…</div>;
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const result = await register(name, email, company, password); if (result.ok) navigate("/"); else setError(result.message || "Could not create the account."); }
  return <main className="auth-page"><section className="auth-brand-pane"><Link to="/login" className="brand auth-brand"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">northstar</span></Link><div className="auth-story"><span className="auth-orbit">✳</span><div className="eyebrow">START WITH CLARITY</div><h1>All your client<br />work, together.</h1><p>Keep your customer relationships, invoices, and cash flow connected as your business grows.</p><div className="auth-proof"><div className="proof-avatars"><span>JM</span><span>AK</span><span>RW</span></div><span>Made for independent teams.</span></div></div><div className="auth-quote"><span>“</span><p>A little more clarity goes a long way.</p></div></section>
    <section className="auth-form-pane"><div className="auth-form-wrap"><div className="auth-mobile-brand"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">northstar</span></div><div className="auth-heading"><div className="panel-kicker">GET STARTED</div><h2>Create your workspace</h2><p>It takes a minute to set up your client portal.</p></div><form className="auth-form" onSubmit={submit}><label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name" required /></label><label>Business name<input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Acme Studio" autoComplete="organization" /></label><label>Work email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary auth-submit" type="submit">Create account <Icon name="chevron" size={15} /></button></form><p className="auth-switch">Already have a workspace? <Link to="/login">Sign in</Link></p><p className="auth-footnote">Local demo only: account details stay in this browser. Add a secure server before using real customer accounts.</p></div></section></main>;
}
