import { useState } from "react";
import type { Route } from "./+types/login";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../auth";
import { Icon } from "../ui";

export function meta({}: Route.MetaArgs) { return [{ title: "Sign in · Northstar" }, { name: "description", content: "Sign in to your Northstar workspace." }]; }

export default function Login() {
  const { account, ready, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (ready && account) return <Navigate to="/" replace />;
  if (!ready) return <div className="auth-loading">Loading…</div>;
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const result = await signIn(email, password); if (result.ok) navigate("/"); else setError(result.message || "Could not sign in."); }
  async function useDemo() { const result = await signIn("demo@northstar.app", "northstar"); if (result.ok) navigate("/"); }
  return <main className="auth-page"><section className="auth-brand-pane"><Link to="/login" className="brand auth-brand"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">northstar</span></Link><div className="auth-story"><span className="auth-orbit">✳</span><div className="eyebrow">A CLEARER WAY TO GROW</div><h1>Your business,<br />in better focus.</h1><p>Know where you stand. Keep work moving. Make better decisions with your client workspace.</p><div className="auth-proof"><div className="proof-avatars"><span>JM</span><span>AK</span><span>RW</span></div><span>Built for the way you do business.</span></div></div><div className="auth-quote"><span>“</span><p>Clarity on every client and every shilling.</p></div></section>
    <section className="auth-form-pane"><div className="auth-form-wrap"><div className="auth-mobile-brand"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">northstar</span></div><div className="auth-heading"><div className="panel-kicker">WELCOME BACK</div><h2>Sign in to your workspace</h2><p>Enter your details to pick up where you left off.</p></div><form className="auth-form" onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="username" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /></label><div className="auth-options"><span><span className="secure-dot" /> Demo workspace</span><Link to="/forgot-password">Forgot password?</Link></div>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary auth-submit" type="submit">Sign in <Icon name="chevron" size={15} /></button></form><div className="auth-divider"><span>OR</span></div><button type="button" className="demo-button" onClick={useDemo}><span className="demo-mark">N</span> Explore the demo workspace</button><p className="auth-credentials">Demo access: <strong>demo@northstar.app</strong> · <strong>northstar</strong></p><p className="auth-switch">New to Northstar? <Link to="/register">Create an account</Link></p><p className="auth-footnote">Demo workspace stores sample account data in this browser only.</p></div></section></main>;
}
