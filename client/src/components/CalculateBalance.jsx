import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://settleji.onrender.com/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:     #FDFAF5;
    --cream2:    #F5EFE6;
    --white:     #FFFFFF;
    --ink:       #1C1917;
    --ink2:      #57534E;
    --ink3:      #A8A29E;
    --border:    rgba(28,25,23,0.08);
    --coral:     #F26B5B;
    --coral-bg:  #FEF0EE;
    --coral-bd:  #FBCDC8;
    --teal:      #0D9488;
    --teal-bg:   #F0FDFA;
    --teal-bd:   #99F6E4;
    --purple:    #7C3AED;
    --purple-bg: #F5F3FF;
    --purple-bd: #DDD6FE;
    --shadow-sm: 0 2px 8px rgba(28,25,23,0.06);
    --shadow-md: 0 8px 28px rgba(28,25,23,0.09);
    --r-md: 18px; --r-lg: 24px; --r-xl: 32px;
  }

  body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--ink); }

  .cb-root { min-height: 100vh; background: var(--cream); }

  .cb-root::before {
    content:''; position:fixed; top:-120px; right:-120px;
    width:400px; height:400px;
    background:radial-gradient(circle,#99F6E4 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.4;
  }
  .cb-root::after {
    content:''; position:fixed; bottom:-80px; left:-80px;
    width:340px; height:340px;
    background:radial-gradient(circle,#FBCDC8 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.35;
  }

  /* ── NAV ── */
  .cb-nav {
    background: var(--white); border-bottom: 1.5px solid var(--border);
    padding: 14px 36px; display: flex; justify-content: space-between; align-items: center;
    position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px);
  }
  .cb-back {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none;
    font-family: 'Outfit',sans-serif; font-size: 14px; font-weight: 700;
    color: var(--ink2); cursor: pointer; transition: color .15s;
  }
  .cb-back:hover { color: var(--coral); }
  .cb-nav-brand { font-family: 'Fraunces',serif; font-size: 18px; font-weight: 900; color: var(--ink); }

  /* ── BODY ── */
  .cb-body {
    max-width: 780px; margin: 36px auto; padding: 0 24px 80px;
    position: relative; z-index: 1;
  }

  /* ── HERO ── */
  .cb-hero {
    background: linear-gradient(135deg,#0D9488,#2DD4BF);
    border-radius: var(--r-xl); padding: 32px 36px; margin-bottom: 28px;
    color: white; display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 20px;
    box-shadow: 0 8px 32px rgba(13,148,136,0.3);
    position: relative; overflow: hidden;
  }
  .cb-hero::before {
    content:''; position:absolute; top:-60px; right:-60px;
    width:220px; height:220px; border-radius:50%;
    background:rgba(255,255,255,.07); pointer-events:none;
  }
  .cb-hero::after {
    content:''; position:absolute; bottom:-40px; left:40px;
    width:140px; height:140px; border-radius:50%;
    background:rgba(255,255,255,.05); pointer-events:none;
  }
  .cb-hero-title { font-family:'Fraunces',serif; font-size: 28px; font-weight: 900; margin-bottom: 6px; position:relative; z-index:1; }
  .cb-hero-sub   { font-size: 14px; font-weight: 600; opacity: .85; position:relative; z-index:1; }
  .cb-hero-left  { position:relative; z-index:1; }
  .cb-hero-stats { display: flex; gap: 16px; flex-wrap: wrap; position:relative; z-index:1; }

  .cb-stat-pill {
    background: rgba(255,255,255,.2); border: 1.5px solid rgba(255,255,255,.35);
    border-radius: 14px; padding: 12px 20px; text-align: center; min-width: 90px;
    backdrop-filter: blur(8px);
  }
  .cb-stat-pill p  { font-size: 10px; font-weight: 700; opacity: .8; letter-spacing: .8px; text-transform: uppercase; margin-bottom: 4px; }
  .cb-stat-pill h3 { font-family:'Fraunces',serif; font-size: 22px; font-weight: 900; }

  /* ── PROGRESS BAR ── */
  .cb-progress-wrap {
    background: var(--white); border-radius: var(--r-lg);
    border: 1.5px solid var(--border); padding: 20px 24px;
    margin-bottom: 28px; box-shadow: var(--shadow-sm);
  }
  .cb-progress-top {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
  }
  .cb-progress-label { font-family:'Fraunces',serif; font-size: 16px; font-weight: 900; color: var(--ink); }
  .cb-progress-pct   { font-family:'Fraunces',serif; font-size: 20px; font-weight: 900; color: var(--teal); }
  .cb-progress-bar   { height: 10px; background: var(--cream2); border-radius: 999px; overflow: hidden; }
  .cb-progress-fill  {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, #0D9488, #2DD4BF);
    transition: width .6s cubic-bezier(.4,0,.2,1);
  }
  .cb-progress-sub {
    display: flex; justify-content: space-between; margin-top: 8px;
    font-size: 12px; font-weight: 700;
  }

  /* ── SECTION TITLE ── */
  .cb-section-title {
    font-family: 'Fraunces',serif; font-size: 20px; font-weight: 900;
    color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }

  /* ── BALANCE GRID ── */
  .cb-balance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 32px; }

  .cb-balance-card {
    padding: 20px; border-radius: var(--r-md); border: 1.5px solid;
    display: flex; align-items: center; gap: 14px;
    transition: transform .2s, box-shadow .2s;
  }
  .cb-balance-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .cb-balance-card.receive { background: var(--teal-bg); border-color: var(--teal-bd); }
  .cb-balance-card.pay     { background: var(--coral-bg); border-color: var(--coral-bd); }

  .cb-balance-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; color: white; flex-shrink: 0;
  }
  .cb-balance-avatar.receive { background: var(--teal); }
  .cb-balance-avatar.pay     { background: var(--coral); }

  .cb-balance-name { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 3px; }
  .cb-balance-chip {
    font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; display: inline-block;
  }
  .cb-balance-chip.receive { background: var(--teal-bd); color: var(--teal); }
  .cb-balance-chip.pay     { background: var(--coral-bd); color: var(--coral); }

  .cb-balance-amount { font-family:'Fraunces',serif; font-size: 22px; font-weight: 900; margin-left: auto; }
  .cb-balance-amount.receive { color: var(--teal); }
  .cb-balance-amount.pay     { color: var(--coral); }

  /* ── PLAN CARD ── */
  .cb-plan-card {
    background: var(--white); border-radius: var(--r-xl);
    border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);
    overflow: hidden; margin-bottom: 28px;
  }
  .cb-plan-header {
    padding: 20px 24px; border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(135deg, #F5F3FF, #EFF6FF);
  }

  /* ── TRANSACTION ROW ── */
  .cb-txn-row {
    display: flex; align-items: center; gap: 16px;
    padding: 18px 24px; border-bottom: 1.5px solid var(--border);
    transition: background .15s;
  }
  .cb-txn-row:last-child { border-bottom: none; }
  .cb-txn-row:hover { background: var(--cream); }
  .cb-txn-row.done {
    opacity: .5;
    background: #f0fdf4;
    border-left: 4px solid #22c55e;
  }

  .cb-txn-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--purple-bg); color: var(--purple);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .cb-txn-num.done { background: #dcfce7; color: #16a34a; }

  .cb-txn-from { font-size: 15px; font-weight: 800; color: var(--coral); }
  .cb-txn-to   { font-size: 15px; font-weight: 800; color: var(--teal); }
  .cb-txn-arrow {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: var(--ink3);
  }
  .cb-txn-amount {
    font-family:'Fraunces',serif; font-size: 20px; font-weight: 900; color: var(--ink);
  }

  /* ── SETTLE BTN ── */
  .cb-settle-btn {
    background: linear-gradient(135deg,#0D9488,#2DD4BF);
    color: white; border: none; padding: 10px 18px; border-radius: 999px;
    font-family: 'Outfit',sans-serif; font-weight: 700; font-size: 12px;
    cursor: pointer; transition: transform .2s, box-shadow .2s;
    box-shadow: 0 4px 14px rgba(13,148,136,0.3); white-space: nowrap;
    flex-shrink: 0;
  }
  .cb-settle-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.4); }
  .cb-settle-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .cb-settle-btn.done-btn {
    background: #dcfce7; color: #16a34a; box-shadow: none; cursor: default;
  }

  /* ── EMPTY ── */
  .cb-empty {
    padding: 52px 20px; text-align: center;
    border: 2px dashed var(--border); border-radius: var(--r-lg);
  }
  .cb-empty-icon { font-size: 52px; margin-bottom: 14px; }
  .cb-empty h4 { font-family:'Fraunces',serif; font-size: 22px; font-weight: 900; color: var(--ink); margin-bottom: 8px; }
  .cb-empty p  { font-size: 14px; color: var(--ink3); font-weight: 500; }

  /* ── LOADING ── */
  .cb-center-screen {
    min-height: 100vh; display: flex; justify-content: center; align-items: center;
    flex-direction: column; gap: 16px; background: var(--cream); font-family: 'Outfit',sans-serif;
  }
  .cb-center-screen .icon { font-size: 52px; animation: bounce 1.2s ease-in-out infinite; }
  .cb-center-screen p { font-size: 18px; font-weight: 700; color: var(--ink2); }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

  @media(max-width:640px) {
    .cb-nav  { padding: 12px 16px; }
    .cb-body { padding: 0 14px 60px; }
    .cb-hero { padding: 22px 20px; }
    .cb-balance-grid { grid-template-columns: 1fr; }
    .cb-txn-row { flex-wrap: wrap; gap: 10px; }
  }
`;

/* ── Minimise transactions algorithm ── */
function buildSettlementPlan(balances) {
  const receivers = balances.filter(b => b.type === "receive").map(b => ({ ...b, amount: b.amount }));
  const payers    = balances.filter(b => b.type === "pay").map(b => ({ ...b, amount: b.amount }));

  const txns = [];
  let i = 0, j = 0;

  while (i < payers.length && j < receivers.length) {
    const pay = payers[i];
    const rec = receivers[j];
    const amt = Math.min(pay.amount, rec.amount);

    if (amt > 0) {
      txns.push({ from: pay.user, to: rec.user, amount: amt });
    }

    pay.amount -= amt;
    rec.amount -= amt;

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
  // ✅ track which txn indices are already settled locally
  const [settledTxns,  setSettledTxns]  = useState([]);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // fetch balances + totalSettled from settlements API
      const [balRes, expRes] = await Promise.all([
        axios.get(`${API}/settlements/balances/${id}`, { headers }),
        axios.get(`${API}/expenses/${id}`, { headers }),
      ]);

      setBalances(balRes.data.balances || []);
      // ✅ totalSettled from backend = sum of actual Settlement records
      setTotalSettled(balRes.data.totalSettled || 0);

      const expenses = Array.isArray(expRes.data) ? expRes.data : expRes.data.expenses || [];
      setTotalSpent(expenses.reduce((a, e) => a + e.amount, 0));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (txn, index) => {
    try {
      setSettling(index);

      // ✅ group members have no _id — send names directly as fromUser/toUser
      await axios.post(`${API}/settlements`, {
        group:    id,
        fromUser: txn.from,  // name string
        toUser:   txn.to,    // name string
        amount:   txn.amount,
      }, { headers });

      // mark this txn as done locally for instant UI feedback
      setSettledTxns(prev => [...prev, index]);

      // refresh balances from backend
      await fetchData();
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.message || "Failed to record settlement");
    } finally {
      setSettling(null);
    }
  };

  if (loading) return (
    <div className="cb-center-screen">
      <style>{css}</style>
      <div className="icon">⚖️</div>
      <p>Calculating Balances...</p>
    </div>
  );

  const totalOwed    = balances.filter(b => b.type === "pay").reduce((a, b) => a + b.amount, 0);
  const totalReceive = balances.filter(b => b.type === "receive").reduce((a, b) => a + b.amount, 0);
  const plan         = buildSettlementPlan(balances);

  // ✅ settlement progress: how much of total spent has been settled
  const settlePct = totalSpent > 0 ? Math.min(100, Math.round((totalSettled / totalSpent) * 100)) : 0;
  const pendingAmt = totalOwed;

  return (
    <>
      <style>{css}</style>
      <div className="cb-root">

        {/* NAV */}
        <div className="cb-nav">
          <button className="cb-back" onClick={() => navigate(`/trips/${id}`)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Trip
          </button>
          <div className="cb-nav-brand">⚖️ Settle Up</div>
          <div style={{width: 120}} />
        </div>

        <div className="cb-body">

          {/* HERO */}
          <div className="cb-hero">
            <div className="cb-hero-left">
              <div className="cb-hero-title">Settlement Plan</div>
              <div className="cb-hero-sub">
                {plan.length} transaction{plan.length !== 1 ? "s" : ""} needed to clear all debts
              </div>
            </div>
            <div className="cb-hero-stats">
              <div className="cb-stat-pill">
                <p>Total Owed</p>
                <h3>₹{totalOwed}</h3>
              </div>
              <div className="cb-stat-pill">
                <p>To Receive</p>
                <h3>₹{totalReceive}</h3>
              </div>
              <div className="cb-stat-pill">
                <p>Settled</p>
                {/* ✅ shows actual settled amount from Settlement records */}
                <h3>₹{totalSettled}</h3>
              </div>
              <div className="cb-stat-pill">
                <p>People</p>
                <h3>{balances.length}</h3>
              </div>
            </div>
          </div>

          {/* ✅ SETTLEMENT PROGRESS BAR — shows pending vs settled */}
          {totalSpent > 0 && (
            <div className="cb-progress-wrap">
              <div className="cb-progress-top">
                <span className="cb-progress-label">Settlement Progress</span>
                <span className="cb-progress-pct">{settlePct}%</span>
              </div>
              <div className="cb-progress-bar">
                <div className="cb-progress-fill" style={{width: `${settlePct}%`}} />
              </div>
              <div className="cb-progress-sub">
                <span style={{color:"var(--teal)"}}>✓ ₹{totalSettled} settled</span>
                <span style={{color:"var(--coral)"}}>⏳ ₹{pendingAmt} still pending</span>
              </div>
            </div>
          )}

          {/* BALANCES or ALL SETTLED */}
          {balances.length === 0 ? (
            <div className="cb-empty">
              <div className="cb-empty-icon">🎉</div>
              <h4>All Settled Up!</h4>
              <p>Everyone is even. No payments needed.</p>
            </div>
          ) : (
            <>
              {/* INDIVIDUAL BALANCES */}
              <div className="cb-section-title">📊 Individual Balances</div>
              <div className="cb-balance-grid">
                {balances.map((b, i) => {
                  const isReceive = b.type === "receive";
                  const initials  = b.user?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={i} className={`cb-balance-card ${isReceive ? "receive" : "pay"}`}>
                      <div className={`cb-balance-avatar ${isReceive ? "receive" : "pay"}`}>{initials}</div>
                      <div>
                        <div className="cb-balance-name">{b.user}</div>
                        <span className={`cb-balance-chip ${isReceive ? "receive" : "pay"}`}>
                          {isReceive ? "🟢 Gets back" : "🔴 Needs to pay"}
                        </span>
                      </div>
                      <div className={`cb-balance-amount ${isReceive ? "receive" : "pay"}`}>
                        ₹{b.amount}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SETTLEMENT PLAN */}
              <div className="cb-section-title">💸 Minimum Transactions Plan</div>
              <div className="cb-plan-card">
                <div className="cb-plan-header">
                  <span style={{fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:900, color:"var(--ink)"}}>
                    {plan.length} payment{plan.length !== 1 ? "s" : ""} to clear all debts
                  </span>
                  <span style={{fontSize:12, fontWeight:700, color:"var(--ink3)"}}>Optimised ✓</span>
                </div>

                {plan.length === 0 ? (
                  <div style={{padding:"28px 24px", textAlign:"center", color:"var(--ink3)", fontWeight:600}}>
                    🎉 No payments needed — all settled!
                  </div>
                ) : (
                  plan.map((txn, i) => {
                    const isDone = settledTxns.includes(i);
                    return (
                      <div key={i} className={`cb-txn-row${isDone ? " done" : ""}`}>
                        <div className={`cb-txn-num${isDone ? " done" : ""}`}>
                          {isDone ? "✓" : i + 1}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
                            <span className="cb-txn-from">{txn.from}</span>
                            <div className="cb-txn-arrow">
                              <svg width="60" height="16" viewBox="0 0 60 16">
                                <line x1="0" y1="8" x2="52" y2="8" stroke="#A8A29E" strokeWidth="2" strokeDasharray="4 3"/>
                                <polyline points="46,3 54,8 46,13" fill="none" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              pays
                            </div>
                            <span className="cb-txn-to">{txn.to}</span>
                          </div>
                        </div>
                        <div className="cb-txn-amount">₹{txn.amount}</div>
                        {isDone ? (
                          <button className="cb-settle-btn done-btn" disabled>
                            ✓ Settled
                          </button>
                        ) : (
                          <button
                            className="cb-settle-btn"
                            disabled={settling === i}
                            onClick={() => handleSettle(txn, i)}
                          >
                            {settling === i ? "Recording..." : "Mark Settled"}
                          </button>
                        )}
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