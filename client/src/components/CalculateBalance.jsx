import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://settleji.onrender.com/api";

/* ── Minimise transactions algorithm ── */
function buildSettlementPlan(balances) {
  const receivers = balances.filter(b => b.type === "receive").map(b => ({ ...b, amount: b.amount }));
  const payers    = balances.filter(b => b.type === "pay").map(b => ({ ...b, amount: b.amount }));
  const txns = [];
  let i = 0, j = 0;
  while (i < payers.length && j < receivers.length) {
    const pay = payers[i], rec = receivers[j];
    const amt = Math.min(pay.amount, rec.amount);
    if (amt > 0) txns.push({ from: pay.user, to: rec.user, amount: amt });
    pay.amount -= amt; rec.amount -= amt;
    if (pay.amount === 0) i++;
    if (rec.amount === 0) j++;
  }
  return txns;
}

export default function CalculateBalance() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [balances,     setBalances]     = useState([]);
  const [totalSettled, setTotalSettled] = useState(0);
  const [totalSpent,   setTotalSpent]   = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [settling,     setSettling]     = useState(null);
  const [settledTxns,  setSettledTxns]  = useState([]);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balRes, expRes] = await Promise.all([
        axios.get(`${API}/settlements/balances/${id}`, { headers }),
        axios.get(`${API}/expenses/${id}`, { headers }),
      ]);
      setBalances(balRes.data.balances || []);
      setTotalSettled(balRes.data.totalSettled || 0);
      const expenses = Array.isArray(expRes.data) ? expRes.data : expRes.data.expenses || [];
      setTotalSpent(expenses.reduce((a, e) => a + e.amount, 0));
    } catch (e) { console.log(e); }
    finally     { setLoading(false); }
  };

  const handleSettle = async (txn, index) => {
    try {
      setSettling(index);
      await axios.post(`${API}/settlements`, {
        group: id, fromUser: txn.from, toUser: txn.to, amount: txn.amount,
      }, { headers });
      setSettledTxns(prev => [...prev, index]);
      await fetchData();
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.message || "Failed to record settlement");
    } finally { setSettling(null); }
  };

  if (loading) return (
    <>
      <style>{globalCss}</style>
      <div className="cb-loading">
        <span className="cb-loading-icon">⚖️</span>
        <p>Calculating Balances...</p>
      </div>
    </>
  );

  const totalOwed    = balances.filter(b => b.type === "pay").reduce((a, b) => a + b.amount, 0);
  const totalReceive = balances.filter(b => b.type === "receive").reduce((a, b) => a + b.amount, 0);
  const plan         = buildSettlementPlan(balances);
  const settlePct    = totalSpent > 0 ? Math.min(100, Math.round((totalSettled / totalSpent) * 100)) : 0;

  return (
    <>
      <style>{globalCss}</style>
      <div className="cb-root">

        {/* ── NAV ── */}
        <nav className="cb-nav">
          <button className="cb-back" onClick={() => navigate(`/trips/${id}`)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span className="cb-back-label">Back to Trip</span>
          </button>
          <div className="cb-nav-brand">⚖️ Settle Up</div>
          <div className="cb-nav-spacer" />
        </nav>

        <div className="cb-body">

          {/* ── HERO ── */}
          <div className="cb-hero">
            <div className="cb-hero-orb1" /><div className="cb-hero-orb2" />
            <div className="cb-hero-left">
              <div className="cb-hero-eyebrow">Settlement Plan</div>
              <div className="cb-hero-title">Clear All Debts</div>
              <div className="cb-hero-sub">
                {plan.length} transaction{plan.length !== 1 ? "s" : ""} needed · {balances.length} members
              </div>
            </div>
            <div className="cb-hero-stats">
              {[
                { label:"Total Owed",  val:`₹${totalOwed}` },
                { label:"To Receive",  val:`₹${totalReceive}` },
                { label:"Settled",     val:`₹${totalSettled}` },
                { label:"People",      val: balances.length },
              ].map((s,i) => (
                <div key={i} className="cb-stat-pill">
                  <p>{s.label}</p>
                  <h3>{s.val}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* ── PROGRESS ── */}
          {totalSpent > 0 && (
            <div className="cb-progress-wrap">
              <div className="cb-progress-top">
                <span className="cb-progress-label">Settlement Progress</span>
                <span className="cb-progress-pct">{settlePct}%</span>
              </div>
              <div className="cb-progress-track">
                <div className="cb-progress-fill" style={{width:`${settlePct}%`}} />
              </div>
              <div className="cb-progress-sub">
                <span className="cb-progress-settled">✓ ₹{totalSettled} settled</span>
                <span className="cb-progress-pending">⏳ ₹{totalOwed} pending</span>
              </div>
            </div>
          )}

          {/* ── ALL SETTLED ── */}
          {balances.length === 0 ? (
            <div className="cb-empty">
              <div className="cb-empty-icon">🎉</div>
              <h4>All Settled Up!</h4>
              <p>Everyone is even. No payments needed.</p>
            </div>
          ) : (
            <>

              {/* ── INDIVIDUAL BALANCES ── */}
              <div className="cb-section-title">
                <span className="cb-section-icon">📊</span> Individual Balances
              </div>
              <div className="cb-balance-grid">
                {balances.map((b, i) => {
                  const isReceive = b.type === "receive";
                  const initials  = b.user?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
                  return (
                    <div key={i} className={`cb-balance-card cb-balance-${isReceive ? "receive" : "pay"}`}>
                      <div className={`cb-balance-avatar cb-av-${isReceive ? "receive" : "pay"}`}>{initials}</div>
                      <div className="cb-balance-info">
                        <div className="cb-balance-name">{b.user}</div>
                        <span className={`cb-balance-chip cb-chip-${isReceive ? "receive" : "pay"}`}>
                          {isReceive ? "🟢 Gets back" : "🔴 Needs to pay"}
                        </span>
                      </div>
                      <div className={`cb-balance-amount cb-amt-${isReceive ? "receive" : "pay"}`}>
                        ₹{b.amount}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── SETTLEMENT PLAN ── */}
              <div className="cb-section-title">
                <span className="cb-section-icon">💸</span> Minimum Transactions Plan
              </div>
              <div className="cb-plan-card">
                <div className="cb-plan-header">
                  <span className="cb-plan-title">
                    {plan.length} payment{plan.length !== 1 ? "s" : ""} to clear all debts
                  </span>
                  <span className="cb-plan-badge">Optimised ✓</span>
                </div>

                {plan.length === 0 ? (
                  <div className="cb-plan-empty">🎉 No payments needed — all settled!</div>
                ) : (
                  plan.map((txn, i) => {
                    const isDone = settledTxns.includes(i);
                    return (
                      <div key={i} className={`cb-txn-row${isDone ? " cb-txn-done" : ""}`}>
                        <div className={`cb-txn-num${isDone ? " cb-txn-num-done" : ""}`}>
                          {isDone ? "✓" : i + 1}
                        </div>

                        <div className="cb-txn-body">
                          <div className="cb-txn-names">
                            <span className="cb-txn-from">{txn.from}</span>
                            <div className="cb-txn-arrow-wrap">
                              <svg width="56" height="16" viewBox="0 0 60 16" className="cb-txn-svg">
                                <line x1="0" y1="8" x2="52" y2="8" stroke="#A8A29E" strokeWidth="2" strokeDasharray="4 3"/>
                                <polyline points="46,3 54,8 46,13" fill="none" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="cb-txn-pays">pays</span>
                            </div>
                            <span className="cb-txn-to">{txn.to}</span>
                          </div>
                        </div>

                        <div className="cb-txn-right">
                          <div className="cb-txn-amount">₹{txn.amount}</div>
                          {isDone ? (
                            <button className="cb-settle-btn cb-settle-done" disabled>✓ Settled</button>
                          ) : (
                            <button
                              className="cb-settle-btn"
                              disabled={settling === i}
                              onClick={() => handleSettle(txn, i)}
                            >
                              {settling === i ? "Recording…" : "Mark Settled"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:     #FDFAF5;
    --cream2:    #F5EFE6;
    --white:     #FFFFFF;
    --ink:       #1C1917;
    --ink2:      #57534E;
    --ink3:      #A8A29E;
    --border:    rgba(28,25,23,0.09);
    --coral:     #F26B5B;
    --coral-bg:  #FEF0EE;
    --coral-bd:  #FBCDC8;
    --teal:      #0D9488;
    --teal-bg:   #F0FDFA;
    --teal-bd:   #99F6E4;
    --purple:    #7C3AED;
    --purple-bg: #F5F3FF;
    --purple-bd: #DDD6FE;
    --green:     #16a34a;
    --green-bg:  #dcfce7;
  }

  body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--ink); }

  /* ── PAGE ── */
  .cb-root {
    min-height: 100vh;
    background: var(--cream);
    position: relative;
  }
  .cb-root::before {
    content:''; position:fixed; top:-140px; right:-120px;
    width:420px; height:420px;
    background: radial-gradient(circle,#99F6E4 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.38;
  }
  .cb-root::after {
    content:''; position:fixed; bottom:-80px; left:-80px;
    width:360px; height:360px;
    background: radial-gradient(circle,#FBCDC8 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.32;
  }

  /* ── LOADING ── */
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .cb-loading {
    min-height: 100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:16px;
    background:var(--cream); font-family:'Outfit',sans-serif;
  }
  .cb-loading-icon { font-size:56px; animation:bounce 1.2s ease-in-out infinite; }
  .cb-loading p    { font-size:18px; font-weight:700; color:var(--ink2); }

  /* ── NAV ── */
  .cb-nav {
    background: rgba(253,250,245,0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1.5px solid var(--border);
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .cb-back {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none;
    font-family:'Outfit',sans-serif; font-size:14px; font-weight:700;
    color:var(--ink2); cursor:pointer;
    padding: 8px 14px; border-radius: 999px;
    transition: color .15s, background .15s;
  }
  .cb-back:hover { color:var(--coral); background:var(--coral-bg); }
  .cb-nav-brand { font-family:'Fraunces',serif; font-size:18px; font-weight:900; color:var(--ink); }
  .cb-nav-spacer { width:120px; }

  /* ── BODY ── */
  .cb-body {
    max-width: 820px;
    margin: 36px auto;
    padding: 0 24px 100px;
    position: relative;
    z-index: 1;
  }

  /* ── HERO ── */
  .cb-hero {
    background: linear-gradient(135deg, #0D9488 0%, #0f766e 40%, #2DD4BF 100%);
    border-radius: 28px;
    padding: 34px 36px;
    margin-bottom: 24px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    box-shadow: 0 12px 40px rgba(13,148,136,0.28);
    position: relative;
    overflow: hidden;
  }
  .cb-hero-orb1 {
    position:absolute; top:-70px; right:-60px;
    width:240px; height:240px; border-radius:50%;
    background:rgba(255,255,255,.07); pointer-events:none;
  }
  .cb-hero-orb2 {
    position:absolute; bottom:-50px; left:30px;
    width:160px; height:160px; border-radius:50%;
    background:rgba(255,255,255,.05); pointer-events:none;
  }
  .cb-hero-left  { position:relative; z-index:1; }
  .cb-hero-eyebrow {
    font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase;
    opacity:.75; margin-bottom:8px;
  }
  .cb-hero-title {
    font-family:'Fraunces',serif; font-size:32px; font-weight:900; line-height:1.1; margin-bottom:6px;
  }
  .cb-hero-sub   { font-size:14px; font-weight:600; opacity:.85; }

  /* stat pills */
  .cb-hero-stats { display:flex; gap:12px; flex-wrap:wrap; position:relative; z-index:1; }
  .cb-stat-pill {
    background: rgba(255,255,255,.18);
    border: 1.5px solid rgba(255,255,255,.32);
    border-radius: 16px;
    padding: 14px 20px;
    text-align: center;
    min-width: 88px;
    backdrop-filter: blur(10px);
    transition: background .2s;
  }
  .cb-stat-pill:hover { background: rgba(255,255,255,.26); }
  .cb-stat-pill p  {
    font-size:10px; font-weight:700; opacity:.8;
    letter-spacing:.8px; text-transform:uppercase; margin-bottom:5px;
  }
  .cb-stat-pill h3 { font-family:'Fraunces',serif; font-size:22px; font-weight:900; }

  /* ── PROGRESS ── */
  .cb-progress-wrap {
    background: var(--white);
    border-radius: 20px;
    border: 1.5px solid var(--border);
    padding: 22px 26px;
    margin-bottom: 28px;
    box-shadow: 0 2px 10px rgba(28,25,23,0.05);
  }
  .cb-progress-top {
    display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;
  }
  .cb-progress-label { font-family:'Fraunces',serif; font-size:17px; font-weight:900; color:var(--ink); }
  .cb-progress-pct   { font-family:'Fraunces',serif; font-size:22px; font-weight:900; color:var(--teal); }
  .cb-progress-track {
    height: 10px; background:var(--cream2); border-radius:999px; overflow:hidden;
  }
  .cb-progress-fill {
    height:100%; border-radius:999px;
    background: linear-gradient(90deg,#0D9488,#2DD4BF);
    transition: width .7s cubic-bezier(.4,0,.2,1);
  }
  .cb-progress-sub {
    display:flex; justify-content:space-between; margin-top:10px;
    font-size:12px; font-weight:700;
  }
  .cb-progress-settled { color:var(--teal); }
  .cb-progress-pending { color:var(--coral); }

  /* ── SECTION TITLE ── */
  .cb-section-title {
    font-family:'Fraunces',serif; font-size:20px; font-weight:900; color:var(--ink);
    margin-bottom:14px; display:flex; align-items:center; gap:10px;
  }
  .cb-section-icon { font-size:20px; }

  /* ── BALANCE GRID ── */
  .cb-balance-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 32px;
  }
  .cb-balance-card {
    padding: 18px 20px;
    border-radius: 18px;
    border: 1.5px solid;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: transform .2s, box-shadow .2s;
  }
  .cb-balance-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(28,25,23,0.09); }
  .cb-balance-receive { background:var(--teal-bg); border-color:var(--teal-bd); }
  .cb-balance-pay     { background:var(--coral-bg); border-color:var(--coral-bd); }

  .cb-balance-avatar {
    width:46px; height:46px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:800; color:white; flex-shrink:0;
  }
  .cb-av-receive { background:var(--teal); }
  .cb-av-pay     { background:var(--coral); }

  .cb-balance-info { flex:1; min-width:0; }
  .cb-balance-name {
    font-size:15px; font-weight:800; color:var(--ink); margin-bottom:4px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .cb-balance-chip {
    font-size:11px; font-weight:800; padding:3px 10px; border-radius:999px; display:inline-block;
  }
  .cb-chip-receive { background:var(--teal-bd); color:var(--teal); }
  .cb-chip-pay     { background:var(--coral-bd); color:var(--coral); }

  .cb-balance-amount {
    font-family:'Fraunces',serif; font-size:22px; font-weight:900; flex-shrink:0;
  }
  .cb-amt-receive { color:var(--teal); }
  .cb-amt-pay     { color:var(--coral); }

  /* ── PLAN CARD ── */
  .cb-plan-card {
    background: var(--white);
    border-radius: 24px;
    border: 1.5px solid var(--border);
    box-shadow: 0 2px 10px rgba(28,25,23,0.05);
    overflow: hidden;
    margin-bottom: 28px;
  }
  .cb-plan-header {
    padding: 18px 24px;
    border-bottom: 1.5px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
    background: linear-gradient(135deg,#F5F3FF,#EFF6FF);
  }
  .cb-plan-title { font-family:'Fraunces',serif; font-size:16px; font-weight:900; color:var(--ink); }
  .cb-plan-badge {
    font-size:12px; font-weight:800; color:var(--teal);
    background:var(--teal-bg); border:1.5px solid var(--teal-bd);
    padding:4px 12px; border-radius:999px;
  }
  .cb-plan-empty {
    padding:28px 24px; text-align:center; color:var(--ink3); font-weight:600; font-size:15px;
  }

  /* ── TRANSACTION ROW ── */
  .cb-txn-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 24px;
    border-bottom: 1.5px solid var(--border);
    transition: background .15s;
  }
  .cb-txn-row:last-child { border-bottom:none; }
  .cb-txn-row:hover      { background:var(--cream); }
  .cb-txn-done {
    background: #f0fdf4 !important;
    border-left: 4px solid #22c55e;
    opacity: .65;
  }

  .cb-txn-num {
    width:30px; height:30px; border-radius:50%;
    background:var(--purple-bg); color:var(--purple);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:800; flex-shrink:0;
  }
  .cb-txn-num-done { background:var(--green-bg); color:var(--green); }

  .cb-txn-body { flex:1; min-width:0; }
  .cb-txn-names {
    display:flex; align-items:center; gap:8px; flex-wrap:wrap;
  }
  .cb-txn-from { font-size:15px; font-weight:800; color:var(--coral); }
  .cb-txn-to   { font-size:15px; font-weight:800; color:var(--teal); }
  .cb-txn-arrow-wrap {
    display:flex; align-items:center; gap:5px; flex-shrink:0;
  }
  .cb-txn-pays { font-size:12px; font-weight:700; color:var(--ink3); }
  .cb-txn-svg  { flex-shrink:0; }

  .cb-txn-right {
    display:flex; align-items:center; gap:10px; flex-shrink:0; flex-wrap:wrap; justify-content:flex-end;
  }
  .cb-txn-amount { font-family:'Fraunces',serif; font-size:20px; font-weight:900; color:var(--ink); }

  /* ── SETTLE BUTTON ── */
  .cb-settle-btn {
    background: linear-gradient(135deg,#0D9488,#2DD4BF);
    color:white; border:none; padding:10px 18px; border-radius:999px;
    font-family:'Outfit',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:transform .2s, box-shadow .2s, opacity .2s;
    box-shadow: 0 4px 16px rgba(13,148,136,0.3); white-space:nowrap;
  }
  .cb-settle-btn:hover:not(:disabled) {
    transform:translateY(-2px); box-shadow:0 8px 24px rgba(13,148,136,0.42);
  }
  .cb-settle-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .cb-settle-done {
    background:var(--green-bg); color:var(--green);
    box-shadow:none; cursor:default;
  }

  /* ── EMPTY ── */
  .cb-empty {
    padding:60px 24px; text-align:center;
    border:2px dashed var(--border); border-radius:24px;
    background: var(--white);
  }
  .cb-empty-icon { font-size:56px; margin-bottom:16px; }
  .cb-empty h4 {
    font-family:'Fraunces',serif; font-size:24px; font-weight:900; color:var(--ink); margin-bottom:8px;
  }
  .cb-empty p  { font-size:14px; color:var(--ink3); font-weight:500; }

  /* ══════════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════════ */
  @media (max-width: 640px) {
    .cb-nav         { padding: 12px 16px; }
    .cb-nav-spacer  { display:none; }
    .cb-back-label  { display:none; }
    .cb-back        { padding: 8px; }

    .cb-body        { margin:20px auto; padding: 0 14px 80px; }

    .cb-hero        { padding:22px 18px; gap:18px; border-radius:20px; }
    .cb-hero-title  { font-size:26px; }

    .cb-stat-pill   { min-width:76px; padding:10px 14px; }
    .cb-stat-pill h3 { font-size:18px; }

    .cb-progress-wrap  { padding:16px 18px; }
    .cb-progress-label { font-size:15px; }
    .cb-progress-pct   { font-size:18px; }

    .cb-balance-grid   { grid-template-columns:1fr; }
    .cb-balance-amount { font-size:18px; }

    .cb-txn-row    { padding:14px 16px; gap:10px; }
    .cb-txn-names  { gap:6px; }
    .cb-txn-from, .cb-txn-to { font-size:13px; }
    .cb-txn-amount { font-size:17px; }
    .cb-txn-svg    { display:none; }
    .cb-txn-pays   { font-size:11px; }
    .cb-txn-right  { gap:8px; }

    .cb-settle-btn { padding:8px 14px; font-size:12px; }

    .cb-plan-header { padding:14px 16px; }
    .cb-plan-title  { font-size:14px; }
  }

  @media (max-width: 420px) {
    .cb-hero-stats   { gap:8px; }
    .cb-stat-pill    { min-width:68px; padding:8px 10px; }
    .cb-stat-pill p  { font-size:9px; }
    .cb-stat-pill h3 { font-size:16px; }
  }
`;