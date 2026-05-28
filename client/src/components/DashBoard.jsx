import { useState } from "react";

/* ─────────────────────────── DATA ─────────────────────────── */

const RECENT_EXPENSES = [
  { emoji: "🍴", title: "Dinner at Britto's",  sub: "Food & Drinks • Goa Trip",      paidBy: "Priya Singh",   avatar: "#f43f5e", initials: "PS", amt: "₹2,350",  time: "2h ago",  amtColor: "#f97316" },
  { emoji: "🏨", title: "Beach Resort Stay",   sub: "Stay • Goa Trip",               paidBy: "Rohan Sharma",  avatar: "#0ea5e9", initials: "RS", amt: "₹8,500",  time: "5h ago",  amtColor: "#0f172a" },
  { emoji: "🛵", title: "Scooty Rental",       sub: "Transport • Manali Adventure",  paidBy: "Karan Mehta",   avatar: "#f59e0b", initials: "KM", amt: "₹1,800",  time: "1d ago",  amtColor: "#0f172a" },
  { emoji: "🎵", title: "Club Night",          sub: "Entertainment • Goa Trip",      paidBy: "Neha Patel",    avatar: "#10b981", initials: "NP", amt: "₹2,250",  time: "1d ago",  amtColor: "#0f172a" },
];

const OWES = [
  { name: "Rohan Sharma",  sub: "Owes you", amt: "₹3,200", color: "#0ea5e9", initials: "RS" },
  { name: "Priya Singh",   sub: "Owes you", amt: "₹2,150", color: "#f43f5e", initials: "PS" },
  { name: "Karan Mehta",   sub: "Owes you", amt: "₹1,850", color: "#f59e0b", initials: "KM" },
];

const GROUPS = [
  { name: "Goa Trip",         sub: "6 members", amt: "₹24,500", pct: 74,  tag: "Active",  tagC: "#16a34a", tagBg: "#dcfce7",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=60" },
  { name: "Flat Expenses",    sub: "4 members", amt: "₹12,800", pct: 100, tag: "Settled", tagC: "#0ea5e9", tagBg: "#e0f2fe",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=60" },
  { name: "Manali Adventure", sub: "8 members", amt: "₹35,600", pct: 40,  tag: "Pending", tagC: "#f97316", tagBg: "#fff7ed",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=60" },
];

const SPEND_CATS = [
  { label: "Travel",      amt: "₹48,600", pct: "39%", color: "#6366f1" },
  { label: "Food & Drinks",amt:"₹32,450", pct: "26%", color: "#34d399" },
  { label: "Stay",        amt: "₹18,750", pct: "15%", color: "#60a5fa" },
  { label: "Transport",   amt: "₹12,600", pct: "10%", color: "#fbbf24" },
  { label: "Shopping",    amt: "₹8,100",  pct: "7%",  color: "#f472b6" },
  { label: "Others",      amt: "₹4,000",  pct: "3%",  color: "#94a3b8" },
];

/* ─────────────────────── MINI SPARKLINE ────────────────────── */
function Spark({ color, points }) {
  const w = 140, h = 38;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const min = Math.min(...points), max = Math.max(...points);
  const ys = points.map(p => h - 4 - ((p - min) / (max - min + 1)) * (h - 10));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={color} />
    </svg>
  );
}

/* ─────────────────────── DONUT CHART ───────────────────────── */
function Donut() {
  const r = 80, cx = 100, cy = 100, sw = 30;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const fracs = SPEND_CATS.map(c => parseInt(c.pct) / 100);
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {fracs.map((frac, i) => {
        const dash = frac * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={SPEND_CATS[i].color} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={-offset * circ}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += frac;
        return el;
      })}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight="700">₹1,24,500</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="#94a3b8">Total Spent</text>
    </svg>
  );
}

/* ─────────────────────────── STYLES ────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#f8f7ff",
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    fontSize: 13,
    color: "#1e293b",
  },
  /* NAV */
  nav: {
    background: "#fff",
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #ede9fe",
    position: "sticky", top: 0, zIndex: 20,
  },
  navLeft: {},
  greeting: { fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: -0.5 },
  greetingSub: { fontSize: 13, color: "#94a3b8", margin: "2px 0 0" },
  navRight: { display: "flex", alignItems: "center", gap: 14 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f8f7ff", border: "1px solid #e8e4ff",
    borderRadius: 24, padding: "8px 18px", width: 240,
  },
  searchInput: {
    background: "none", border: "none", outline: "none",
    fontSize: 13, color: "#64748b", width: "100%",
  },
  bellBtn: {
    width: 38, height: 38, borderRadius: "50%",
    background: "#f8f7ff", border: "1px solid #e8e4ff",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: 16,
  },
  newGroupBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#4f46e5", color: "#fff",
    border: "none", borderRadius: 10,
    padding: "9px 18px", fontSize: 13, fontWeight: 700,
    cursor: "pointer",
  },
  /* BODY */
  body: { maxWidth: 1200, margin: "0 auto", padding: "24px 24px" },
  /* STAT CARDS */
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 },
  statCard: {
    background: "#fff", borderRadius: 16,
    border: "1px solid #ede9fe",
    boxShadow: "0 1px 6px rgba(79,70,229,.06)",
    padding: "18px 20px",
  },
  statHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
  statIconBox: {
    width: 36, height: 36, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, flexShrink: 0,
  },
  statLabelTxt: { fontSize: 11, color: "#94a3b8", fontWeight: 500 },
  statVal: { fontSize: 26, fontWeight: 800, margin: "4px 0 6px", letterSpacing: -0.5, color: "#0f172a" },
  statChange: { fontSize: 11, color: "#16a34a", marginBottom: 12, display: "flex", alignItems: "center", gap: 3 },
  statChangeOrange: { fontSize: 11, color: "#f97316", marginBottom: 12, display: "flex", alignItems: "center", gap: 3 },
  /* TWO COL */
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 },
  card: {
    background: "#fff", borderRadius: 16,
    border: "1px solid #ede9fe",
    boxShadow: "0 1px 6px rgba(79,70,229,.06)",
    padding: "20px",
  },
  cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  viewAll: {
    fontSize: 12, color: "#4f46e5", background: "none",
    border: "none", cursor: "pointer", fontWeight: 500,
  },
  monthPill: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#f8f7ff", border: "1px solid #ede9fe",
    borderRadius: 20, padding: "4px 10px", fontSize: 11,
    color: "#64748b", cursor: "pointer",
  },
  /* SPENDING */
  spendRow: { display: "flex", alignItems: "center", gap: 20 },
  catItem: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  catDot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },
  catLabel: { fontSize: 12, color: "#475569" },
  catRight: { display: "flex", gap: 8, alignItems: "center" },
  catAmt: { fontSize: 12, color: "#0f172a", fontWeight: 600 },
  catPct: { fontSize: 11, color: "#94a3b8", width: 34, textAlign: "right" },
  spendFooter: {
    marginTop: 14, fontSize: 12, color: "#64748b",
    display: "flex", alignItems: "center", gap: 5,
  },
  /* RECENT EXPENSES */
  expRow: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "12px 0", borderBottom: "1px solid #f8f7ff",
  },
  expEmoji: {
    width: 40, height: 40, borderRadius: 12,
    background: "#f8f7ff", border: "1px solid #ede9fe",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, flexShrink: 0,
  },
  expInfo: { flex: 1, minWidth: 0 },
  expTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  expSub: { fontSize: 11, color: "#94a3b8", marginTop: 1 },
  expRight: { display: "flex", alignItems: "center", gap: 14, flexShrink: 0 },
  paidBy: { textAlign: "right" },
  paidLabel: { fontSize: 11, color: "#94a3b8" },
  paidName: { fontSize: 12, fontWeight: 600, color: "#0f172a", marginTop: 1 },
  expAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  expAmt: { fontSize: 14, fontWeight: 700, minWidth: 56, textAlign: "right" },
  expTime: { fontSize: 11, color: "#94a3b8", minWidth: 36, textAlign: "right" },
  /* BOTTOM ROW */
  bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  /* GROUPS */
  groupRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8f7ff" },
  groupImg: { width: 48, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 },
  groupInfo: { flex: 1, minWidth: 0 },
  groupName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  groupSub: { fontSize: 11, color: "#94a3b8", marginTop: 1 },
  groupBar: { height: 6, borderRadius: 99, background: "#ede9fe", overflow: "hidden", marginTop: 6, width: "100%" },
  groupFill: { height: "100%", background: "#4f46e5", borderRadius: 99 },
  groupAmt: { fontSize: 13, fontWeight: 700, color: "#0f172a", textAlign: "right" },
  groupTag: { fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, marginTop: 4 },
  groupPct: { fontSize: 10, color: "#94a3b8", textAlign: "right", marginTop: 2 },
  /* OWES */
  owesRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f8f7ff" },
  owesAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  owesName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  owesSub: { fontSize: 11, color: "#94a3b8", marginTop: 1 },
  owesAmt: { fontSize: 15, fontWeight: 800, color: "#16a34a", flex: 1, textAlign: "center" },
  remindBtn: {
    padding: "6px 14px", borderRadius: 8,
    background: "#fff", border: "1px solid #e2e8f0",
    fontSize: 12, fontWeight: 600, color: "#0f172a", cursor: "pointer",
  },
  owesFoot: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 0 0", marginTop: 4,
  },
  owesFootLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b" },
  owesTotal: { fontSize: 15, fontWeight: 800, color: "#4f46e5" },
};

/* ─────────────────────── COMPONENT ─────────────────────────── */
export default function Dashboard() {
  const [search, setSearch] = useState("");

  const STATS = [
    { icon: "💼", iconBg: "#ede9fe", label: "Total Spent",    val: "₹1,24,500", change: "12.5% from last month", up: true,  sparkColor: "#6366f1", sparkPts: [30,28,35,32,38,34,40,38,42,45,43,48] },
    { icon: "⏱",  iconBg: "#fff7ed", label: "Pending Amount", val: "₹18,200",   change: "8.3% from last month",  up: true,  sparkColor: "#f97316", sparkPts: [20,22,18,24,20,26,22,28,24,22,26,24], orange: true },
    { icon: "👥", iconBg: "#f0fdf4", label: "Total Groups",   val: "12",          change: "2 new this month",      up: true,  sparkColor: "#34d399", sparkPts: [6,7,6,8,7,9,8,9,10,9,11,12] },
    { icon: "✅", iconBg: "#eff6ff", label: "Total Settled",  val: "₹1,06,300", change: "15.8% from last month", up: true,  sparkColor: "#60a5fa", sparkPts: [40,42,44,42,46,48,50,52,54,56,58,60] },
  ];

  return (
    <div style={s.page}>
      {/* NAV */}
      <div style={s.nav}>
        <div style={s.navLeft}>
          <p style={s.greeting}>Good morning, Ayush! 👋</p>
          <p style={s.greetingSub}>Here's what's happening with your expenses today.</p>
        </div>
        <div style={s.navRight}>
          <div style={s.searchBox}>
            <svg width="15" height="15" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              style={s.searchInput}
              placeholder="Search anything..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={s.bellBtn}>🔔</div>
          <button style={s.newGroupBtn}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Group
          </button>
        </div>
      </div>

      <div style={s.body}>

        {/* STAT CARDS */}
        <div style={s.statGrid}>
          {STATS.map((st, i) => (
            <div key={i} style={s.statCard}>
              <div style={s.statHead}>
                <div style={{ ...s.statIconBox, background: st.iconBg }}>{st.icon}</div>
                <span style={s.statLabelTxt}>{st.label}</span>
              </div>
              <div style={s.statVal}>{st.val}</div>
              <div style={st.orange ? s.statChangeOrange : s.statChange}>
                <span>↗</span> {st.change}
              </div>
              <Spark color={st.sparkColor} points={st.sparkPts} />
            </div>
          ))}
        </div>

        {/* SPENDING + RECENT EXPENSES */}
        <div style={s.twoCol}>

          {/* Spending Overview */}
          <div style={s.card}>
            <div style={s.cardHead}>
              <span style={s.cardTitle}>Spending Overview</span>
              <button style={s.monthPill}>This Month ▾</button>
            </div>
            <div style={s.spendRow}>
              <Donut />
              <div style={{ flex: 1 }}>
                {SPEND_CATS.map(c => (
                  <div key={c.label} style={s.catItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ ...s.catDot, background: c.color }} />
                      <span style={s.catLabel}>{c.label}</span>
                    </div>
                    <div style={s.catRight}>
                      <span style={s.catAmt}>{c.amt}</span>
                      <span style={s.catPct}>({c.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.spendFooter}>
              <span>⏱</span>
              Your spending is <strong style={{ color: "#f97316" }}>12.5% higher</strong> than last month
            </div>
          </div>

          {/* Recent Expenses */}
          <div style={s.card}>
            <div style={s.cardHead}>
              <span style={s.cardTitle}>Recent Expenses</span>
              <button style={s.viewAll}>View All</button>
            </div>
            {RECENT_EXPENSES.map((e, i) => (
              <div key={i} style={{ ...s.expRow, borderBottom: i === RECENT_EXPENSES.length - 1 ? "none" : "1px solid #f8f7ff" }}>
                <div style={s.expEmoji}>{e.emoji}</div>
                <div style={s.expInfo}>
                  <p style={s.expTitle}>{e.title}</p>
                  <p style={s.expSub}>{e.sub}</p>
                </div>
                <div style={s.expRight}>
                  <div style={s.paidBy}>
                    <p style={s.paidLabel}>Paid by</p>
                    <p style={s.paidName}>{e.paidBy}</p>
                  </div>
                  <div style={{ ...s.expAvatar, background: e.avatar }}>{e.initials}</div>
                  <div>
                    <p style={{ ...s.expAmt, color: e.amtColor }}>{e.amt}</p>
                    <p style={s.expTime}>{e.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: TOP GROUPS + WHO OWES */}
        <div style={s.bottomRow}>

          {/* Top Groups */}
          <div style={s.card}>
            <div style={s.cardHead}>
              <span style={s.cardTitle}>Top Groups</span>
              <button style={s.viewAll}>View All</button>
            </div>
            {GROUPS.map((g, i) => (
              <div key={i} style={{ ...s.groupRow, borderBottom: i === GROUPS.length - 1 ? "none" : "1px solid #f8f7ff" }}>
                <img src={g.img} alt={g.name} style={s.groupImg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.groupName}>{g.name}</p>
                  <p style={s.groupSub}>{g.sub}</p>
                  <div style={s.groupBar}>
                    <div style={{ ...s.groupFill, width: `${g.pct}%` }} />
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right", minWidth: 80 }}>
                  <p style={s.groupAmt}>{g.amt}</p>
                  <span style={{ ...s.groupTag, background: g.tagBg, color: g.tagC }}>{g.tag}</span>
                  <p style={s.groupPct}>{g.pct}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Who Owes You */}
          <div style={s.card}>
            <div style={s.cardHead}>
              <span style={s.cardTitle}>Who Owes You</span>
              <button style={s.viewAll}>View All</button>
            </div>
            {OWES.map((o, i) => (
              <div key={i} style={{ ...s.owesRow, borderBottom: i === OWES.length - 1 ? "none" : "1px solid #f8f7ff" }}>
                <div style={{ ...s.owesAvatar, background: o.color }}>{o.initials}</div>
                <div>
                  <p style={s.owesName}>{o.name}</p>
                  <p style={s.owesSub}>{o.sub}</p>
                </div>
                <span style={s.owesAmt}>{o.amt}</span>
                <button style={s.remindBtn}>Remind</button>
              </div>
            ))}
            <div style={s.owesFoot}>
              <div style={s.owesFootLabel}>
                <span style={{ fontSize: 20 }}>🎒</span>
                Total amount you will receive
              </div>
              <span style={s.owesTotal}>₹7,200</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
