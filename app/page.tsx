"use client";

import { FormEvent, useState } from "react";

const plans = [
  { id: "basic", name: "Basic", price: 49, description: "A simple monthly chemical allowance." },
  { id: "pro", name: "Pro", price: 79, description: "More flexibility for regular pool care." },
  { id: "elite", name: "Elite", price: 119, description: "Our highest monthly chemical allowance." },
];

export default function Home() {
  const [plan, setPlan] = useState("pro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("TX");
const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, name, email, phone, street, city, state, zip }),
      });
      const raw = await response.text();
      let data: { url?: string; error?: string };
      try { data = JSON.parse(raw); }
      catch { throw new Error("The checkout service returned an unexpected response. Please try again."); }
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return <main>
    <header className="topbar"><a className="brand" href="/">PRISTINE <span>POOL CHEMICAL CLUB</span></a><span className="tag">POOL CARE, SIMPLIFIED</span></header>
    <section className="hero">
      <p className="eyebrow">THE PRISTINE POOL CHEMICAL CLUB</p>
      <h1>Your pool chemicals.<br/><em>Made simple.</em></h1>
      <p className="intro">Choose a monthly membership and get a chemical allowance to use toward your pool care needs.</p>
      <div className="notice">Memberships cover chemicals only. Pool cleaning and service are not included.</div>
    </section>
    <section className="content">
      <div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR MEMBERSHIP</p><h2>Find your fit.</h2></div><p className="muted">Billed monthly · Cancel anytime</p></div>
      <div className="plans">{plans.map(item => <button type="button" key={item.id} onClick={() => setPlan(item.id)} className={`plan ${plan === item.id ? "selected" : ""}`} aria-pressed={plan === item.id}>
        <span className="plan-name">{item.name}</span><span className="price">${item.price}<small>/ month</small></span><span className="plan-desc">{item.description}</span>
        <span className="features"><span>✓ Monthly chemical allowance</span><span>✓ Member pricing</span><span>✓ No pool service included</span></span>
        <span className="choose">{plan === item.id ? "SELECTED" : "SELECT PLAN"}</span>
      </button>)}</div>
      <div className="signup">
        <div><p className="eyebrow">GET STARTED</p><h2>Join the club.</h2><p className="muted">Enter your contact details to continue to secure monthly checkout.</p></div>
        <form onSubmit={submit}>
          <label>Full name<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></label>
          <label>Email address<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label>
          <label>Phone number<input required type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555"/></label>
          
<label>Phone number<input required type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555"/></label>

<label>Street Address<input required value={street} onChange={e => setStreet(e.target.value)} placeholder="Street address"/></label>
<label>City<input required value={city} onChange={e => setCity(e.target.value)} placeholder="City"/></label>
<label>State<input required value={state} onChange={e => setState(e.target.value)} placeholder="TX"/></label>
<label>ZIP Code<input required value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP code"/></label>

{error && <p className="error" role="alert">{error}</p>}

          {error && <p className="error" role="alert">{error}</p>}
          <button className="submit" type="submit" disabled={loading}>{loading ? "Connecting to secure checkout..." : `Continue with ${plans.find(p => p.id === plan)?.name} — $${plans.find(p => p.id === plan)?.price}/mo`}</button>
          <p className="fineprint">Secure payment handled by Stripe. Your membership renews monthly. No sales tax is added by this checkout.</p>
        </form>
      </div>
    </section>
    <footer>© {new Date().getFullYear()} Pristine Pool Chemical Club · Chemical allowance only · No pool service</footer>
  </main>;
}
