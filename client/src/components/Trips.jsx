import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://localhost:5000/api";

/* ── MINI DONUT SVG ── */
function MiniDonut({ pct, color, bg = "#F5EFE6", size = 56, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

/* ── HORIZONTAL SEGMENTED BAR ── */
function SegBar({ settled, total, height = 10 }) {
  const pct = total > 0 ? Math.min(100, (settled / total) * 100) : 0;
  return (
    <div style={{ width: "100%", background: "#F5EFE6", borderRadius: 999, height, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: 999,
        background: "linear-gradient(90deg,#0D9488,#2DD4BF)",
        transition: "width .6s cubic-bezier(.4,0,.2,1)"
      }} />
    </div>
  );
}

/* ── CATEGORY DONUT (sidebar) ── */
function CategoryDonut({ data, size = 120 }) {
  const COLORS = ["#7C3AED", "#F26B5B", "#0D9488", "#D97706", "#DB2777", "#2563EB"];
  const total = data.reduce((a, d) => a + d.amount, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10, stroke = 18;
  const circ = 2 * Math.PI * r;
  let cumPct = 0;
  const slices = data.map((d, i) => {
    const pct = d.amount / total;
    const offset = circ * (1 - cumPct);
    const dash = circ * pct;
    cumPct += pct;
    return { ...d, dash, offset, color: COLORS[i % COLORS.length] };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${s.dash} ${circ - s.dash}`}
          strokeDashoffset={s.offset}
          strokeLinecap="butt"
        />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </svg>
  );
}

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
    --amber:     #D97706;
    --amber-bg:  #FFFBEB;
    --amber-bd:  #FDE68A;
    --purple:    #7C3AED;
    --purple-bg: #F5F3FF;
    --purple-bd: #DDD6FE;
    --shadow-sm: 0 2px 8px rgba(28,25,23,0.06);
    --shadow-md: 0 8px 28px rgba(28,25,23,0.09);
    --shadow-lg: 0 24px 56px rgba(28,25,23,0.13);
    --r-md: 18px; --r-lg: 24px; --r-xl: 32px;
  }

  body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--ink); }

  .trips-root {
    min-height: 100vh;
    background: var(--cream);
    position: relative;
  }

  /* background blobs */
  .trips-root::before {
    content:''; position:fixed; top:-120px; right:-120px;
    width:460px; height:460px;
    background:radial-gradient(circle,#FBCDC8 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.45;
  }
  .trips-root::after {
    content:''; position:fixed; bottom:-80px; left:-80px;
    width:360px; height:360px;
    background:radial-gradient(circle,#C7D2FE 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.35;
  }

  /* ── NAVBAR ── */
  .t-nav {
    background: var(--white);
    border-bottom: 1.5px solid var(--border);
    padding: 14px 36px;
    display: flex; justify-content: space-between; align-items: center;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(14px);
  }

  .t-back {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none;
    font-family: 'Outfit',sans-serif; font-size: 14px; font-weight: 700;
    color: var(--ink2); cursor: pointer; transition: color .15s;
  }
  .t-back:hover { color: var(--coral); }

  .t-nav-brand {
    font-family: 'Fraunces',serif; font-size: 18px; font-weight: 900; color: var(--ink);
  }

  .t-btn-add {
    background: var(--ink); color: white; border: none;
    padding: 11px 22px; border-radius: 999px;
    font-family: 'Outfit',sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    box-shadow: 0 4px 16px rgba(28,25,23,0.2);
    transition: transform .2s, box-shadow .2s, background .15s;
  }
  .t-btn-add:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,25,23,0.28); background:#2C2724; }

  /* ── LAYOUT ── */
  .t-layout {
    max-width: 1340px; margin: 28px auto; padding: 0 28px 60px;
    display: grid; grid-template-columns: 1fr 310px; gap: 24px;
    position: relative; z-index: 1;
  }

  /* ── HERO CARD ── */
  .t-hero {
    background: var(--white); border-radius: var(--r-xl);
    overflow: hidden; border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm); margin-bottom: 24px;
  }

  .t-hero-img {
    height: 240px; position: relative; overflow: hidden;
  }
  .t-hero-img img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .5s ease;
  }
  .t-hero:hover .t-hero-img img { transform: scale(1.04); }

  /* colorful gradient overlay */
  .t-hero-img::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(
      155deg,
      rgba(124,58,237,0.42) 0%,
      rgba(242,107,91,0.3)  35%,
      rgba(13,148,136,0.25) 65%,
      rgba(217,119,6,0.35)  100%
    );
    mix-blend-mode: multiply;
  }

  .t-hero-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(28,25,23,.75) 0%, transparent 55%);
    z-index: 2;
  }

  .t-hero-img-text {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 20px 28px; z-index: 3;
    display: flex; justify-content: space-between; align-items: flex-end;
    flex-wrap: wrap; gap: 12px;
  }

  .t-hero-name {
    font-family: 'Fraunces',serif; font-size: 30px; font-weight: 900;
    color: white; letter-spacing: -0.5px; text-shadow: 0 2px 8px rgba(0,0,0,.3);
  }

  .t-hero-meta {
    display: flex; gap: 14px; margin-top: 6px; flex-wrap: wrap;
  }

  .t-hero-chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,.18); border: 1.5px solid rgba(255,255,255,.3);
    color: white; font-size: 12px; font-weight: 700;
    padding: 5px 13px; border-radius: 999px; backdrop-filter: blur(8px);
  }

  .t-hero-stats {
    display: flex; gap: 10px; flex-wrap: wrap;
  }

  .t-hero-stat-pill {
    background: rgba(255,255,255,.92); border-radius: 14px;
    padding: 10px 18px; text-align: center; min-width: 100px;
    backdrop-filter: blur(10px);
    border: 1.5px solid rgba(255,255,255,.6);
  }

  .t-hero-stat-pill p { font-size: 10px; color: var(--ink3); font-weight: 700; letter-spacing: .8px; text-transform: uppercase; margin-bottom: 4px; }
  .t-hero-stat-pill h3 { font-family:'Fraunces',serif; font-size: 20px; font-weight: 900; color: var(--ink); }
  .t-hero-stat-pill h3.coral { color: var(--coral); }
  .t-hero-stat-pill h3.teal  { color: var(--teal); }

  .t-hero-body {
    padding: 22px 28px;
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  }

  .t-hero-desc { font-size: 14px; color: var(--ink2); font-weight: 500; line-height: 1.65; flex: 1; }

  /* ── TABS ── */
  .t-tabs-card {
    background: var(--white); border-radius: var(--r-xl);
    border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .t-tabs-bar {
    display: flex; border-bottom: 1.5px solid var(--border); overflow-x: auto;
    padding: 0 8px;
  }

  .t-tab-btn {
    padding: 16px 22px; border: none; cursor: pointer; background: none;
    font-family: 'Outfit',sans-serif; font-size: 14px; font-weight: 700;
    color: var(--ink3); white-space: nowrap;
    border-bottom: 3px solid transparent;
    transition: color .15s, border-color .15s;
    display: flex; align-items: center; gap: 7px;
  }
  .t-tab-btn.active { color: var(--coral); border-bottom-color: var(--coral); }
  .t-tab-btn:hover:not(.active) { color: var(--ink2); }

  .t-tab-icon {
    width: 26px; height: 26px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 13px;
  }

  .t-tab-content { padding: 28px; }

  .t-section-title {
    font-family: 'Fraunces',serif; font-size: 20px; font-weight: 900;
    color: var(--ink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
  }

  /* ── EXPENSE ROW ── */
  .t-expense-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 18px; border: 1.5px solid var(--border);
    border-radius: var(--r-md); margin-bottom: 10px; background: var(--white);
    transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .t-expense-row:hover { transform: translateX(4px); box-shadow: var(--shadow-sm); border-color: var(--coral-bd); }

  .t-expense-icon {
    width: 42px; height: 42px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    flex-shrink: 0; margin-right: 14px;
  }

  .t-expense-left { display: flex; align-items: center; }
  .t-expense-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .t-expense-sub   { font-size: 12px; color: var(--ink3); font-weight: 500; }

  .t-expense-amount { font-family:'Fraunces',serif; font-size: 20px; font-weight: 900; color: var(--ink); text-align: right; }
  .t-expense-cat {
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px;
    background: var(--purple-bg); color: var(--purple); margin-top: 5px; display: inline-block;
  }

  /* ── BALANCE ROW ── */
  .t-balance-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 18px; border: 1.5px solid var(--border);
    border-radius: var(--r-md); margin-bottom: 10px;
    transition: transform .2s, box-shadow .2s;
  }
  .t-balance-row:hover { transform: translateX(4px); box-shadow: var(--shadow-sm); }
  .t-balance-row.receive { background: var(--teal-bg); border-color: var(--teal-bd); }
  .t-balance-row.pay     { background: var(--coral-bg); border-color: var(--coral-bd); }

  .t-balance-user { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .t-balance-type-chip {
    font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; display: inline-block;
  }
  .t-balance-type-chip.receive { background: var(--teal-bd); color: var(--teal); }
  .t-balance-type-chip.pay     { background: var(--coral-bd); color: var(--coral); }

  .t-balance-amount { font-family:'Fraunces',serif; font-size: 22px; font-weight: 900; }
  .t-balance-amount.receive { color: var(--teal); }
  .t-balance-amount.pay     { color: var(--coral); }

  /* settlement mini chart in balances tab */
  .t-settlement-summary {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;
  }
  .t-settle-box {
    border: 1.5px solid var(--border); border-radius: var(--r-md);
    padding: 16px; background: var(--cream); display: flex; align-items: center; gap: 12px;
  }

  /* ── MEMBER CARD ── */
  .t-member-grid {
    display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 14px;
  }

  .t-member-card {
    padding: 18px; border: 1.5px solid var(--border); border-radius: var(--r-md);
    background: var(--white); display: flex; align-items: center; gap: 14px;
    transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .t-member-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--purple-bd); }

  .t-member-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    object-fit: cover; border: 2.5px solid var(--white);
    box-shadow: 0 2px 10px rgba(0,0,0,.12); flex-shrink: 0;
  }

  .t-member-name  { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 3px; }
  .t-member-email { font-size: 12px; color: var(--ink3); font-weight: 500; }

  /* ── EMPTY STATE ── */
  .t-empty {
    padding: 52px 20px; text-align: center;
    border: 2px dashed var(--border); border-radius: var(--r-lg);
  }
  .t-empty-icon { font-size: 44px; margin-bottom: 14px; }
  .t-empty h4 { font-family:'Fraunces',serif; font-size: 20px; font-weight: 900; color: var(--ink); margin-bottom: 8px; }
  .t-empty p  { font-size: 14px; color: var(--ink3); font-weight: 500; margin-bottom: 20px; }

  .t-btn-empty {
    background: var(--ink); color: white; border: none;
    padding: 13px 26px; border-radius: 999px;
    font-family: 'Outfit',sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; box-shadow: 0 4px 16px rgba(28,25,23,0.18);
    transition: transform .2s, box-shadow .2s;
  }
  .t-btn-empty:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,25,23,0.26); }

  /* ── SIDEBAR ── */
  .t-sidebar-card {
    background: var(--white); border-radius: var(--r-xl);
    padding: 24px; border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm); margin-bottom: 20px;
  }

  .t-sidebar-title {
    font-family: 'Fraunces',serif; font-size: 17px; font-weight: 900;
    color: var(--ink); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
  }

  /* category bars */
  .t-cat-row { margin-bottom: 14px; }
  .t-cat-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .t-cat-label { font-size: 13px; font-weight: 700; color: var(--ink2); }
  .t-cat-val   { font-size: 12px; font-weight: 700; color: var(--ink3); }
  .t-cat-bar   { height: 7px; background: var(--cream2); border-radius: 999px; overflow: hidden; }
  .t-cat-fill  { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.4,0,.2,1); }

  .t-cat-dot {
    width: 9px; height: 9px; border-radius: 50%; display: inline-block; margin-right: 7px; vertical-align: middle;
  }

  /* donut + legend layout */
  .t-donut-wrap { display: flex; flex-direction: column; align-items: center; }
  .t-donut-center { position: relative; margin-bottom: 16px; }
  .t-donut-label {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    font-family:'Fraunces',serif; font-size: 13px; font-weight: 900; color: var(--ink);
    text-align: center; line-height: 1.2;
  }
  .t-legend { width: 100%; display: flex; flex-direction: column; gap: 8px; }
  .t-legend-row { display: flex; align-items: center; justify-content: space-between; }
  .t-legend-left { display: flex; align-items: center; font-size: 13px; font-weight: 600; color: var(--ink2); }
  .t-legend-pct  { font-size: 12px; font-weight: 800; color: var(--ink3); }

  /* quick stats */
  .t-qs-grid { display: grid; gap: 12px; }
  .t-qs-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; background: var(--cream);
    border: 1.5px solid var(--border); border-radius: var(--r-md);
  }
  .t-qs-icon {
    width: 38px; height: 38px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .t-qs-label { font-size: 11px; color: var(--ink3); font-weight: 700; letter-spacing: .6px; text-transform: uppercase; margin-bottom: 2px; }
  .t-qs-val   { font-family:'Fraunces',serif; font-size: 20px; font-weight: 900; color: var(--ink); }

  /* settlement widget in sidebar */
  .t-settle-widget {
    display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
  }
  .t-settle-widget-text { flex: 1; }
  .t-settle-widget-label { font-size: 11px; font-weight: 700; color: var(--ink3); letter-spacing: .6px; text-transform: uppercase; margin-bottom: 4px; }
  .t-settle-widget-val   { font-family:'Fraunces',serif; font-size: 18px; font-weight: 900; }

  /* loading / not-found */
  .t-center-screen {
    min-height: 100vh; display: flex; justify-content: center; align-items: center;
    flex-direction: column; gap: 16px; background: var(--cream);
    font-family: 'Outfit',sans-serif;
  }
  .t-center-screen .icon { font-size: 52px; animation: bounce 1.2s ease-in-out infinite; }
  .t-center-screen p { font-size: 18px; font-weight: 700; color: var(--ink2); }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

  @media(max-width:1000px) {
    .t-layout { grid-template-columns: 1fr; }
    .t-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .t-sidebar-card { margin-bottom: 0; }
  }
  @media(max-width:640px) {
    .t-layout { padding: 0 14px 48px; }
    .t-nav    { padding: 12px 16px; }
    .t-hero-name { font-size: 22px; }
    .t-sidebar { grid-template-columns: 1fr; }
  }
`;

const EXPENSE_ICONS = {
  food: "🍽️", travel: "✈️", hotel: "🏨", shopping: "🛍️",
  fuel: "⛽", entertainment: "🎉", default: "💳",
};

const CAT_COLORS = ["#7C3AED","#F26B5B","#0D9488","#D97706","#DB2777","#2563EB"];

export default function Trips() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("Overview");
  const [group,    setGroup]    = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchGroup    = async () => { try { const r = await axios.get(`${API}/groups/${id}`,  { headers }); setGroup(r.data.group); } catch(e){ console.log(e); } };
  const fetchExpenses = async () => {
  try {
    const r = await axios.get(`${API}/expenses/${id}`, { headers });
    console.log("EXPENSES RESPONSE:", r.data);  // <-- add this
    setExpenses(r.data.expenses || []);
  } catch(e) {
    console.log(e);
  }
};
  const fetchBalances = async () => { try { const r = await axios.get(`${API}/settlements/balances/${id}`,{ headers }); setBalances(r.data.balances||[]); } catch(e){ console.log(e); } };

  useEffect(() => {
    if (!id) return;
    const load = async () => { setLoading(true); await Promise.all([fetchGroup(),fetchExpenses(),fetchBalances()]); setLoading(false); };
    load();
  }, [id]);

  const totalSpent = useMemo(() => expenses.reduce((a,i)=>a+i.amount,0), [expenses]);

  const pendingAmount = useMemo(() =>
    balances.reduce((a,i)=>(!i.settled?a+i.amount:a),0), [balances]);

  const settledAmount = Math.max(0, totalSpent - pendingAmount);
  const settlePct = totalSpent > 0 ? Math.round((settledAmount / totalSpent) * 100) : 0;

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { if (!map[e.category]) map[e.category]=0; map[e.category]+=e.amount; });
    const total = totalSpent || 1;
    return Object.keys(map).map(k => ({
      label: k, amount: map[k], percent: +((map[k]/total)*100).toFixed(1),
    }));
  }, [expenses, totalSpent]);

  const avgExpense = expenses.length > 0 ? Math.floor(totalSpent / expenses.length) : 0;

  if (loading) return (
    <div className="t-center-screen">
      <style>{css}</style>
      <div className="icon">✈️</div>
      <p>Loading Trip...</p>
    </div>
  );

  if (!group) return (
    <div className="t-center-screen">
      <style>{css}</style>
      <div className="icon">🗺️</div>
      <p>Group Not Found</p>
    </div>
  );

  const tabs = [
    { label:"Overview",  icon:"🏠" },
    { label:"Expenses",  icon:"🧾" },
    { label:"Balances",  icon:"⚖️" },
    { label:"Members",   icon:"👥" },
  ];

  return (
    <>
      <style>{css}</style>

      <div className="trips-root">

        {/* ── NAVBAR ── */}
        <div className="t-nav">
          <button className="t-back" onClick={() => navigate("/groups")}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Groups
          </button>

          <div className="t-nav-brand">✈️ SplitTrip</div>

          {/* ✅ FIX: Pass the group id so ExpensePage can read it via useParams */}
          <button className="t-btn-add" onClick={() => navigate(`/expense/${id}`)}>
            + Add Expense
          </button>
        </div>

        <div className="t-layout">

          {/* ── LEFT ── */}
          <div>

            {/* HERO */}
            <div className="t-hero">
              <div className="t-hero-img">
                <img src={group.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"} alt={group.name} />
                <div className="t-hero-img-overlay" />
                <div className="t-hero-img-text">
                  <div>
                    <div className="t-hero-name">{group.name}</div>
                    <div className="t-hero-meta">
                      <span className="t-hero-chip">👥 {group.members?.length||0} Members</span>
                      <span className="t-hero-chip">📅 {new Date(group.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                      {group.category && <span className="t-hero-chip">🏷️ {group.category}</span>}
                    </div>
                  </div>
                  <div className="t-hero-stats">
                    <div className="t-hero-stat-pill">
                      <p>Total Spent</p>
                      <h3>₹{totalSpent}</h3>
                    </div>
                    <div className="t-hero-stat-pill">
                      <p>Pending</p>
                      <h3 className="coral">₹{pendingAmount}</h3>
                    </div>
                    <div className="t-hero-stat-pill">
                      <p>Settled</p>
                      <h3 className="teal">₹{settledAmount}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {group.description && (
                <div className="t-hero-body">
                  <p className="t-hero-desc">{group.description}</p>
                </div>
              )}
            </div>

            {/* TABS */}
            <div className="t-tabs-card">
              <div className="t-tabs-bar">
                {tabs.map(t => (
                  <button key={t.label}
                    className={`t-tab-btn${activeTab===t.label?" active":""}`}
                    onClick={() => setActiveTab(t.label)}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>

              <div className="t-tab-content">

                {/* ── OVERVIEW / EXPENSES ── */}
                {(activeTab==="Overview" || activeTab==="Expenses") && (
                  <>
                    <div className="t-section-title">
                      🧾 {activeTab==="Overview" ? "Recent Expenses" : "All Expenses"}
                    </div>

                    {expenses.length===0 ? (
                      <div className="t-empty">
                        <div className="t-empty-icon">🧾</div>
                        <h4>No Expenses Yet</h4>
                        <p>Add your first expense to start tracking.</p>
                        {/* ✅ FIX: Pass the group id here too */}
                        <button className="t-btn-empty" onClick={() => navigate(`/expense/${id}`)}>
                          + Add First Expense
                        </button>
                      </div>
                    ) : (
                      expenses.map(expense => {
                        const iconKey = (expense.category||"").toLowerCase();
                        const icon = EXPENSE_ICONS[iconKey] || EXPENSE_ICONS.default;
                        const colors = ["#FEF0EE","#F5F3FF","#F0FDFA","#FFFBEB","#FFF0FA","#EFF6FF"];
                        const ci = Math.abs(expense.title?.charCodeAt(0)||0) % colors.length;
                        return (
                          <div key={expense._id} className="t-expense-row">
                            <div className="t-expense-left">
                              <div className="t-expense-icon" style={{background:colors[ci]}}>{icon}</div>
                              <div>
                                <div className="t-expense-title">{expense.title}</div>
                                <div className="t-expense-sub">Paid by {expense.paidBy?.name}</div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div className="t-expense-amount">₹{expense.amount}</div>
                              <span className="t-expense-cat">{expense.category}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}

                {/* ── BALANCES ── */}
                {activeTab==="Balances" && (
                  <>
                    <div className="t-section-title">⚖️ Balances</div>

                    {/* settlement summary mini charts */}
                    <div className="t-settlement-summary">
                      <div className="t-settle-box">
                        <MiniDonut pct={settlePct} color="#0D9488" bg="#F0FDFA" size={52} stroke={7}/>
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--ink3)",letterSpacing:".7px",textTransform:"uppercase",marginBottom:4}}>Settlement</div>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:900,color:"var(--teal)"}}>{settlePct}%</div>
                          <div style={{fontSize:11,fontWeight:600,color:"var(--ink3)"}}>of ₹{totalSpent} paid</div>
                        </div>
                      </div>
                      <div className="t-settle-box" style={{flexDirection:"column",alignItems:"flex-start",gap:8}}>
                        <div style={{fontSize:10,fontWeight:700,color:"var(--ink3)",letterSpacing:".7px",textTransform:"uppercase"}}>Pending vs Settled</div>
                        <SegBar settled={settledAmount} total={totalSpent} height={10}/>
                        <div style={{display:"flex",gap:12,fontSize:11,fontWeight:700}}>
                          <span style={{color:"var(--teal)"}}>● ₹{settledAmount} settled</span>
                          <span style={{color:"var(--coral)"}}>● ₹{pendingAmount} pending</span>
                        </div>
                      </div>
                    </div>

                    {balances.map((balance, index) => {
                      const isReceive = balance.type==="receive";
                      return (
                        <div key={index} className={`t-balance-row ${isReceive?"receive":"pay"}`}>
                          <div>
                            <div className="t-balance-user">{balance.user}</div>
                            <span className={`t-balance-type-chip ${isReceive?"receive":"pay"}`}>
                              {isReceive ? "🟢 Receives" : "🔴 Owes"}
                            </span>
                          </div>
                          <div className={`t-balance-amount ${isReceive?"receive":"pay"}`}>
                            ₹{balance.amount}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* ── MEMBERS ── */}
                {activeTab==="Members" && (
                  <>
                    <div className="t-section-title">👥 Members</div>
                    <div className="t-member-grid">
                      {group.members?.map(member => (
                        <div key={member._id} className="t-member-card">
                          <img className="t-member-avatar"
                            src={member.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name||"U")}&background=random`}
                            alt={member.name}
                          />
                          <div>
                            <div className="t-member-name">{member.name}</div>
                            <div className="t-member-email">{member.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="t-sidebar">

            {/* settlement mini widget */}
            <div className="t-sidebar-card">
              <div className="t-sidebar-title">💸 Settlement</div>
              <div className="t-settle-widget">
                <MiniDonut pct={settlePct} color="#0D9488" bg="#F0FDFA" size={60} stroke={8}/>
                <div className="t-settle-widget-text">
                  <div className="t-settle-widget-label">Progress</div>
                  <div className="t-settle-widget-val" style={{color:"var(--teal)"}}>{settlePct}% done</div>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--ink3)",marginTop:2}}>₹{settledAmount} of ₹{totalSpent}</div>
                </div>
              </div>
              <SegBar settled={settledAmount} total={totalSpent} height={9}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,fontWeight:700}}>
                <span style={{color:"var(--teal)"}}>● Settled ₹{settledAmount}</span>
                <span style={{color:"var(--coral)"}}>● Pending ₹{pendingAmount}</span>
              </div>
            </div>

            {/* category distribution */}
            <div className="t-sidebar-card">
              <div className="t-sidebar-title">📊 Distribution</div>

              {categoryData.length === 0 ? (
                <p style={{color:"var(--ink3)",fontSize:13,fontWeight:500}}>No expenses yet.</p>
              ) : (
                <>
                  <div className="t-donut-wrap">
                    <div className="t-donut-center">
                      <CategoryDonut data={categoryData} size={130}/>
                      <div className="t-donut-label">
                        <span style={{fontSize:11,color:"var(--ink3)"}}>categories</span><br/>
                        <span style={{fontSize:16}}>{categoryData.length}</span>
                      </div>
                    </div>
                    <div className="t-legend">
                      {categoryData.map((cat,i) => (
                        <div key={i} className="t-legend-row">
                          <div className="t-legend-left">
                            <span className="t-cat-dot" style={{background:CAT_COLORS[i%CAT_COLORS.length]}}/>
                            {cat.label}
                          </div>
                          <span className="t-legend-pct">{cat.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{marginTop:20}}>
                    {categoryData.map((cat,i) => (
                      <div key={i} className="t-cat-row">
                        <div className="t-cat-top">
                          <span className="t-cat-label">
                            <span className="t-cat-dot" style={{background:CAT_COLORS[i%CAT_COLORS.length]}}/>
                            {cat.label}
                          </span>
                          <span className="t-cat-val">₹{cat.amount}</span>
                        </div>
                        <div className="t-cat-bar">
                          <div className="t-cat-fill" style={{width:`${cat.percent}%`,background:CAT_COLORS[i%CAT_COLORS.length]}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* quick stats */}
            <div className="t-sidebar-card">
              <div className="t-sidebar-title">⚡ Quick Stats</div>
              <div className="t-qs-grid">
                <div className="t-qs-row">
                  <div className="t-qs-icon" style={{background:"var(--purple-bg)"}}>🧾</div>
                  <div>
                    <div className="t-qs-label">Total Expenses</div>
                    <div className="t-qs-val" style={{color:"var(--purple)"}}>{expenses.length}</div>
                  </div>
                </div>
                <div className="t-qs-row">
                  <div className="t-qs-icon" style={{background:"var(--teal-bg)"}}>👥</div>
                  <div>
                    <div className="t-qs-label">Members</div>
                    <div className="t-qs-val" style={{color:"var(--teal)"}}>{group.members?.length||0}</div>
                  </div>
                </div>
                <div className="t-qs-row">
                  <div className="t-qs-icon" style={{background:"var(--amber-bg)"}}>📈</div>
                  <div>
                    <div className="t-qs-label">Avg. Expense</div>
                    <div className="t-qs-val" style={{color:"var(--amber)"}}>₹{avgExpense}</div>
                  </div>
                </div>
                <div className="t-qs-row">
                  <div className="t-qs-icon" style={{background:"var(--coral-bg)"}}>💰</div>
                  <div>
                    <div className="t-qs-label">Per Member</div>
                    <div className="t-qs-val" style={{color:"var(--coral)"}}>
                      ₹{group.members?.length > 0 ? Math.floor(totalSpent/(group.members.length)) : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}