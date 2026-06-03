import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG as QRCode } from "qrcode.react";

const API = "https://settleji.onrender.com/api";

/* ── MINI DONUT ── */
function MiniDonut({ pct, color, bg = "#F5EFE6", size = 56, stroke = 7 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ, cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

/* ── SEG BAR ── */
function SegBar({ settled, total, height = 10 }) {
  const pct = total > 0 ? Math.min(100, (settled / total) * 100) : 0;
  return (
    <div className="w-full bg-[#F5EFE6] rounded-full overflow-hidden" style={{ height }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#0D9488,#2DD4BF)", transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

/* ── CATEGORY DONUT ── */
function CategoryDonut({ data, size = 120 }) {
  const COLORS = ["#7C3AED", "#F26B5B", "#0D9488", "#D97706", "#DB2777", "#2563EB"];
  const total = data.reduce((a, d) => a + d.amount, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10, stroke = 18, circ = 2 * Math.PI * r;
  let cumPct = 0;
  const slices = data.map((d, i) => {
    const pct = d.amount / total, offset = circ * (1 - cumPct), dash = circ * pct;
    cumPct += pct;
    return { ...d, dash, offset, color: COLORS[i % COLORS.length] };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${s.dash} ${circ - s.dash}`} strokeDashoffset={s.offset} strokeLinecap="butt" />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </svg>
  );
}

/* ── QR MODAL ── */
function QRModal({ payer, amount, totalAmount, splitAmong, onClose }) {
  if (!payer) return null;
  const upiUrl = payer.upiId
    ? `upi://pay?pa=${encodeURIComponent(payer.upiId)}&pn=${encodeURIComponent(payer.name)}&am=${amount}&cu=INR&tn=SplitTrip%20Payment`
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center z-[999] backdrop-blur-md p-5"
      onClick={onClose}
    >
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
      <div
        className="bg-white rounded-[28px] px-7 py-8 max-w-[380px] w-full text-center shadow-[0_24px_64px_rgba(0,0,0,.2)]"
        style={{ animation: "popIn .25s ease" }}
        onClick={e => e.stopPropagation()}
      >
        {/* avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-[0_4px_16px_rgba(0,0,0,.15)] font-[Outfit,sans-serif]"
          style={{ background: payer.color || "#7C3AED" }}
        >
          {payer.initials}
        </div>

        <div className="font-[Fraunces,serif] text-xl font-black text-stone-900 mb-0.5">Pay {payer.name}</div>
        <div className="text-[13px] text-slate-400 font-semibold mb-4">Paid for this expense</div>

        {/* amount banner */}
        <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
          <div className="text-left">
            <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-1">Your Share</div>
            <div className="font-[Fraunces,serif] text-[34px] font-black text-white leading-none">₹{amount}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold text-white/70 mb-1">Total Bill</div>
            <div className="text-base font-extrabold text-white/85">₹{totalAmount}</div>
            <div className="text-[11px] text-white/60 mt-0.5">split among {splitAmong}</div>
          </div>
        </div>

        {upiUrl ? (
          <>
            <div className="bg-[#f8f7ff] rounded-2xl p-4 inline-block mb-3 border-2 border-[#e8e4ff]">
              <QRCode value={upiUrl} size={180} level="M" fgColor="#1C1917" bgColor="#f8f7ff" style={{ display: "block" }} />
            </div>
            <div className="text-xs text-slate-500 font-semibold mb-1.5">Scan with any UPI app to pay ₹{amount}</div>
            <div className="text-[11px] text-slate-400 font-medium bg-slate-100 rounded-lg px-3 py-1.5 inline-block mb-5">
              📱 {payer.upiId}
            </div>
          </>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-5 text-[13px] text-amber-800 font-semibold text-left">
            ⚠️ No UPI ID set for {payer.name}.<br />
            <span className="text-xs font-medium">Edit the group to add their UPI ID.</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 text-white border-none rounded-2xl font-[Outfit,sans-serif] text-sm font-extrabold cursor-pointer shadow-[0_6px_18px_rgba(79,70,229,.35)]"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

const EXPENSE_ICONS = { food: "🍽️", travel: "✈️", hotel: "🏨", shopping: "🛍️", fuel: "⛽", entertainment: "🎉", default: "💳" };
const CAT_COLORS    = ["#7C3AED", "#F26B5B", "#0D9488", "#D97706", "#DB2777", "#2563EB"];

export default function Trips() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [activeTab,    setActiveTab]    = useState("Overview");
  const [group,        setGroup]        = useState(null);
  const [expenses,     setExpenses]     = useState([]);
  const [balances,     setBalances]     = useState([]);
  const [totalSettled, setTotalSettled] = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [qrModal,      setQrModal]      = useState(null);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchGroup    = async () => { try { const r = await axios.get(`${API}/groups/${id}`, { headers }); setGroup(r.data.group); } catch (e) { console.log(e); } };
  const fetchExpenses = async () => { try { const r = await axios.get(`${API}/expenses/${id}`, { headers }); setExpenses(Array.isArray(r.data) ? r.data : r.data.expenses || []); } catch (e) { console.log(e); } };
  const fetchBalances = async () => { try { const r = await axios.get(`${API}/settlements/balances/${id}`, { headers }); setBalances(r.data.balances || []); setTotalSettled(r.data.totalSettled || 0); } catch (e) { console.log(e); } };

  useEffect(() => {
    if (!id) return;
    const load = async () => { setLoading(true); await Promise.all([fetchGroup(), fetchExpenses(), fetchBalances()]); setLoading(false); };
    load();
  }, [id]);

  const totalSpent    = useMemo(() => expenses.reduce((a, i) => a + i.amount, 0), [expenses]);
  const pendingAmount = useMemo(() => balances.filter(b => b.type === "pay").reduce((a, b) => a + b.amount, 0), [balances]);
  const settledAmount = totalSettled;
  const settlePct     = totalSpent > 0 ? Math.round((settledAmount / totalSpent) * 100) : 0;

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { if (!map[e.category]) map[e.category] = 0; map[e.category] += e.amount; });
    const total = totalSpent || 1;
    return Object.keys(map).map(k => ({ label: k, amount: map[k], percent: +((map[k] / total) * 100).toFixed(1) }));
  }, [expenses, totalSpent]);

  const avgExpense = expenses.length > 0 ? Math.floor(totalSpent / expenses.length) : 0;

  const findPayerMember = (payerName) => {
    if (!group?.members || !payerName) return null;
    return group.members.find(m => m.name === payerName) || null;
  };

  const handlePayerClick = (expense) => {
    const member = findPayerMember(expense.paidBy);
    const participantCount = expense.participants?.length || group?.members?.length || 1;
    const perPersonShare   = expense.participants?.[0]?.share ?? Math.round(expense.amount / participantCount);
    setQrModal({
      payer: member
        ? { name: member.name, initials: member.initials, color: member.color, upiId: member.upiId }
        : { name: expense.paidBy || "Unknown", initials: (expense.paidBy || "?")[0], color: "#7c3aed", upiId: "" },
      amount:      perPersonShare,
      totalAmount: expense.amount,
      splitAmong:  participantCount,
    });
  };

  /* ── shared Tailwind snippets ── */
  const sidebarTitle = "font-[Fraunces,serif] text-[17px] font-black text-stone-900 mb-5 flex items-center gap-2";
  const settleBtn    = "bg-[#0D9488] text-white border-none py-2.5 px-5 rounded-full font-[Outfit,sans-serif] font-bold text-[13px] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_16px_rgba(13,148,136,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,148,136,0.4)] transition-all";

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-[#FDFAF5] font-[Outfit,sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap'); @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <div className="text-[52px]" style={{ animation: "bounce 1.2s ease-in-out infinite" }}>✈️</div>
      <p className="text-lg font-bold text-stone-500">Loading Trip...</p>
    </div>
  );
  if (!group) return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-[#FDFAF5] font-[Outfit,sans-serif]">
      <div className="text-[52px]">🗺️</div>
      <p className="text-lg font-bold text-stone-500">Group Not Found</p>
    </div>
  );

  const tabs = [{ label: "Overview", icon: "🏠" }, { label: "Expenses", icon: "🧾" }, { label: "Balances", icon: "⚖️" }, { label: "Members", icon: "👥" }];

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-[Outfit,sans-serif] text-stone-900 relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>

      {/* decorative blobs */}
      <div className="fixed -top-28 -right-28 w-[460px] h-[460px] rounded-full pointer-events-none z-0 opacity-45" style={{ background: "radial-gradient(circle,#FBCDC8 0%,transparent 68%)" }} />
      <div className="fixed -bottom-20 -left-20 w-[360px] h-[360px] rounded-full pointer-events-none z-0 opacity-35" style={{ background: "radial-gradient(circle,#C7D2FE 0%,transparent 68%)" }} />

      {/* QR Modal */}
      {qrModal && (
        <QRModal
          payer={qrModal.payer}
          amount={qrModal.amount}
          totalAmount={qrModal.totalAmount}
          splitAmong={qrModal.splitAmong}
          onClose={() => setQrModal(null)}
        />
      )}

      {/* ══ NAVBAR ══ */}
      <nav className="bg-white border-b border-stone-100 px-4 sm:px-9 py-3.5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-[14px]">
        <button
          className="flex items-center gap-2 bg-transparent border-none font-[Outfit,sans-serif] text-sm font-bold text-stone-500 cursor-pointer hover:text-[#F26B5B] transition-colors"
          onClick={() => navigate("/groups")}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Groups
        </button>
        <div className="font-[Fraunces,serif] text-lg font-black text-stone-900 hidden sm:block">✈️ SplitTrip</div>
        <div className="flex gap-2.5 items-center">
          <button className={settleBtn} onClick={() => navigate(`/calculate-balance/${id}`)}>⚖️ Settle Up</button>
          <button
            className="bg-stone-900 text-white border-none py-2.5 px-5 rounded-full font-[Outfit,sans-serif] font-bold text-[13px] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_16px_rgba(28,25,23,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,25,23,0.28)] hover:bg-[#2C2724] transition-all"
            onClick={() => navigate(`/expense/${id}`)}
          >
            + Add Expense
          </button>
        </div>
      </nav>

      {/* ══ LAYOUT ══ */}
      <div className="max-w-[1340px] mx-auto mt-7 px-4 sm:px-7 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-6 relative z-10">

        {/* ── MAIN ── */}
        <div>

          {/* HERO */}
          <div className="bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm mb-6 group">
            <div className="h-[240px] relative overflow-hidden">
              <img
                src={group.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"}
                alt={group.name}
                className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* colour mix overlay */}
              <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(155deg,rgba(124,58,237,0.42) 0%,rgba(242,107,91,0.3) 35%,rgba(13,148,136,0.25) 65%,rgba(217,119,6,0.35) 100%)" }} />
              {/* dark bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,25,23,0.75)] to-transparent" style={{ zIndex: 2 }} />
              {/* text */}
              <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-7 pb-5 flex justify-between items-end flex-wrap gap-3" style={{ zIndex: 3 }}>
                <div>
                  <div className="font-[Fraunces,serif] text-2xl sm:text-3xl font-black text-white tracking-tight [text-shadow:0_2px_8px_rgba(0,0,0,.3)]">
                    {group.groupName || group.name}
                  </div>
                  <div className="flex gap-3.5 mt-1.5 flex-wrap">
                    {[
                      `👥 ${group.members?.length || 0} Members`,
                      `📅 ${new Date(group.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
                      ...(group.category ? [`🏷️ ${group.category}`] : []),
                    ].map(chip => (
                      <span key={chip} className="inline-flex items-center gap-1.5 bg-white/18 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-lg">{chip}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {[
                    { label: "Total Spent", value: `₹${totalSpent}`, cls: "text-stone-900" },
                    { label: "Pending",     value: `₹${pendingAmount}`, cls: "text-[#F26B5B]" },
                    { label: "Settled",     value: `₹${settledAmount}`, cls: "text-[#0D9488]" },
                  ].map(s => (
                    <div key={s.label} className="bg-white/92 rounded-2xl px-4 py-2.5 text-center min-w-[100px] backdrop-blur-xl border border-white/60">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
                      <h3 className={`font-[Fraunces,serif] text-xl font-black leading-none ${s.cls}`}>{s.value}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {group.description && (
              <div className="px-7 py-5 flex items-center gap-4 flex-wrap">
                <p className="text-[14px] text-stone-500 font-medium leading-relaxed flex-1">{group.description}</p>
              </div>
            )}
          </div>

          {/* TABS CARD */}
          <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-stone-100 overflow-x-auto px-2">
              {tabs.map(t => (
                <button
                  key={t.label}
                  onClick={() => setActiveTab(t.label)}
                  className={`px-5 py-4 border-none cursor-pointer font-[Outfit,sans-serif] text-[14px] font-bold whitespace-nowrap flex items-center gap-1.5 border-b-[3px] transition-colors duration-150
                    ${activeTab === t.label
                      ? "text-[#F26B5B] border-b-[#F26B5B]"
                      : "text-stone-400 border-b-transparent hover:text-stone-600 bg-transparent"
                    }`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            <div className="p-7">

              {/* OVERVIEW / EXPENSES */}
              {(activeTab === "Overview" || activeTab === "Expenses") && (
                <>
                  <div className="font-[Fraunces,serif] text-xl font-black text-stone-900 mb-5 flex items-center gap-2.5">
                    🧾 {activeTab === "Overview" ? "Recent Expenses" : "All Expenses"}
                  </div>
                  {expenses.length === 0 ? (
                    <div className="py-14 px-5 text-center border-2 border-dashed border-stone-200 rounded-3xl">
                      <div className="text-[44px] mb-3.5">🧾</div>
                      <h4 className="font-[Fraunces,serif] text-xl font-black text-stone-900 mb-2">No Expenses Yet</h4>
                      <p className="text-[14px] text-stone-400 font-medium mb-5">Add your first expense to start tracking.</p>
                      <button
                        className="bg-stone-900 text-white border-none py-3 px-6 rounded-full font-[Outfit,sans-serif] text-sm font-bold cursor-pointer shadow-[0_4px_16px_rgba(28,25,23,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,25,23,0.26)] transition-all"
                        onClick={() => navigate(`/expense/${id}`)}
                      >
                        + Add First Expense
                      </button>
                    </div>
                  ) : expenses.map(expense => {
                    const iconKey = (expense.category || "").toLowerCase();
                    const icon    = EXPENSE_ICONS[iconKey] || EXPENSE_ICONS.default;
                    const colors  = ["#FEF0EE", "#F5F3FF", "#F0FDFA", "#FFFBEB", "#FFF0FA", "#EFF6FF"];
                    const ci      = Math.abs(expense.title?.charCodeAt(0) || 0) % colors.length;
                    const payerMember = findPayerMember(expense.paidBy);

                    return (
                      <div
                        key={expense._id}
                        className="flex justify-between items-center px-4 sm:px-5 py-4 border border-stone-100 rounded-2xl mb-2.5 bg-white transition-all duration-200 hover:translate-x-1 hover:shadow-sm hover:border-[#FBCDC8]"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: colors[ci] }}>
                            {icon}
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-stone-900 mb-1">{expense.title}</div>
                            {/* clickable payer chip */}
                            <div
                              className="inline-flex items-center gap-1.5 bg-[#F5F3FF] border border-[#DDD6FE] rounded-full px-2.5 py-1 cursor-pointer hover:bg-[#DDD6FE] hover:scale-[1.04] transition-all mt-0.5"
                              onClick={() => handlePayerClick(expense)}
                              title="Click to view payment QR"
                            >
                              <div
                                className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[8px] font-extrabold flex-shrink-0"
                                style={{ background: payerMember?.color || "#7c3aed" }}
                              >
                                {(expense.paidBy || "?")[0]?.toUpperCase()}
                              </div>
                              <span className="text-[11px] font-bold text-[#7C3AED]">{expense.paidBy || "Unknown"}</span>
                              <span className="text-[10px]">📱</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-[Fraunces,serif] text-xl font-black text-stone-900">₹{expense.amount}</div>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F5F3FF] text-[#7C3AED] mt-1 inline-block">{expense.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* BALANCES */}
              {activeTab === "Balances" && (
                <>
                  <div className="font-[Fraunces,serif] text-xl font-black text-stone-900 mb-5 flex items-center gap-2.5">⚖️ Balances</div>

                  {/* Summary boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="border border-stone-100 rounded-2xl p-4 bg-[#FDFAF5] flex items-center gap-3">
                      <MiniDonut pct={settlePct} color="#0D9488" bg="#F0FDFA" size={52} stroke={7} />
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Settlement</div>
                        <div className="font-[Fraunces,serif] text-lg font-black text-[#0D9488]">{settlePct}%</div>
                        <div className="text-[11px] font-semibold text-stone-400">of ₹{totalSpent} paid</div>
                      </div>
                    </div>
                    <div className="border border-stone-100 rounded-2xl p-4 bg-[#FDFAF5] flex flex-col gap-2">
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Pending vs Settled</div>
                      <SegBar settled={settledAmount} total={totalSpent} height={10} />
                      <div className="flex gap-3 text-[11px] font-bold">
                        <span className="text-[#0D9488]">● ₹{settledAmount} settled</span>
                        <span className="text-[#F26B5B]">● ₹{pendingAmount} pending</span>
                      </div>
                    </div>
                  </div>

                  {balances.length === 0 ? (
                    <div className="py-14 px-5 text-center border-2 border-dashed border-stone-200 rounded-3xl">
                      <div className="text-[44px] mb-3.5">🎉</div>
                      <h4 className="font-[Fraunces,serif] text-xl font-black text-stone-900 mb-2">All Settled Up!</h4>
                      <p className="text-[14px] text-stone-400 font-medium">No pending balances.</p>
                    </div>
                  ) : balances.map((balance, index) => {
                    const isReceive = balance.type === "receive";
                    return (
                      <div
                        key={index}
                        className={`flex justify-between items-center px-5 py-4 border rounded-2xl mb-2.5 transition-all duration-200 hover:translate-x-1 hover:shadow-sm
                          ${isReceive ? "bg-[#F0FDFA] border-[#99F6E4]" : "bg-[#FEF0EE] border-[#FBCDC8]"}`}
                      >
                        <div>
                          <div className="text-[15px] font-bold text-stone-900 mb-1">{balance.user}</div>
                          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full inline-block ${isReceive ? "bg-[#99F6E4] text-[#0D9488]" : "bg-[#FBCDC8] text-[#F26B5B]"}`}>
                            {isReceive ? "🟢 Gets back" : "🔴 Needs to pay"}
                          </span>
                        </div>
                        <div className={`font-[Fraunces,serif] text-2xl font-black ${isReceive ? "text-[#0D9488]" : "text-[#F26B5B]"}`}>
                          ₹{balance.amount}
                        </div>
                      </div>
                    );
                  })}

                  {balances.length > 0 && (
                    <div className="mt-5 text-center">
                      <button className={settleBtn + " mx-auto"} onClick={() => navigate(`/calculate-balance/${id}`)}>
                        ⚖️ View Full Settlement Plan
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* MEMBERS */}
              {activeTab === "Members" && (
                <>
                  <div className="font-[Fraunces,serif] text-xl font-black text-stone-900 mb-5 flex items-center gap-2.5">👥 Members</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {group.members?.map((member, i) => (
                      <div
                        key={i}
                        className="p-4 sm:p-5 border border-stone-100 rounded-2xl bg-white flex items-center gap-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(28,25,23,0.09)] hover:border-[#DDD6FE]"
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0"
                          style={{ background: member.color || "#7c3aed" }}
                        >
                          {member.initials}
                        </div>
                        <div className="flex-1">
                          <div className="text-[15px] font-extrabold text-stone-900 mb-0.5">{member.name}</div>
                          {member.upiId
                            ? <div className="text-[11px] text-[#0D9488] font-bold mt-0.5">📱 {member.upiId}</div>
                            : <div className="text-xs text-stone-400 font-medium">No UPI ID</div>
                          }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:gap-0 self-start">

          {/* Settlement */}
          <div className="bg-white rounded-[32px] p-6 border border-stone-100 shadow-sm lg:mb-5">
            <div className={sidebarTitle}>💸 Settlement</div>
            <div className="flex items-center gap-3.5 mb-4">
              <MiniDonut pct={settlePct} color="#0D9488" bg="#F0FDFA" size={60} stroke={8} />
              <div className="flex-1">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-1">Progress</div>
                <div className="font-[Fraunces,serif] text-lg font-black text-[#0D9488]">{settlePct}% done</div>
                <div className="text-[11px] font-semibold text-stone-400 mt-0.5">₹{settledAmount} of ₹{totalSpent}</div>
              </div>
            </div>
            <SegBar settled={settledAmount} total={totalSpent} height={9} />
            <div className="flex justify-between mt-2 text-[11px] font-bold">
              <span className="text-[#0D9488]">● Settled ₹{settledAmount}</span>
              <span className="text-[#F26B5B]">● Pending ₹{pendingAmount}</span>
            </div>
            <button
              className={settleBtn + " w-full justify-center mt-4"}
              onClick={() => navigate(`/calculate-balance/${id}`)}
            >
              ⚖️ Settle Up
            </button>
          </div>

          {/* Distribution */}
          <div className="bg-white rounded-[32px] p-6 border border-stone-100 shadow-sm lg:mb-5">
            <div className={sidebarTitle}>📊 Distribution</div>
            {categoryData.length === 0 ? (
              <p className="text-stone-400 text-[13px] font-medium">No expenses yet.</p>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <CategoryDonut data={categoryData} size={130} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[Fraunces,serif] text-[13px] font-black text-stone-900 text-center leading-tight">
                      <span className="text-[11px] text-stone-400">categories</span><br />
                      <span className="text-base">{categoryData.length}</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center text-[13px] font-semibold text-stone-500">
                          <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                          {cat.label}
                        </div>
                        <span className="text-xs font-extrabold text-stone-400">{cat.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="mb-3.5">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[13px] font-bold text-stone-500">
                          <span className="w-2 h-2 rounded-full inline-block mr-1.5 align-middle" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                          {cat.label}
                        </span>
                        <span className="text-xs font-bold text-stone-400">₹{cat.amount}</span>
                      </div>
                      <div className="h-[7px] bg-[#F5EFE6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${cat.percent}%`, background: CAT_COLORS[i % CAT_COLORS.length] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-[32px] p-6 border border-stone-100 shadow-sm">
            <div className={sidebarTitle}>⚡ Quick Stats</div>
            <div className="flex flex-col gap-3">
              {[
                { icon: "🧾", bg: "#F5F3FF", label: "Total Expenses", val: expenses.length,                                                    color: "#7C3AED" },
                { icon: "👥", bg: "#F0FDFA", label: "Members",         val: group.members?.length || 0,                                        color: "#0D9488" },
                { icon: "📈", bg: "#FFFBEB", label: "Avg. Expense",    val: `₹${avgExpense}`,                                                  color: "#D97706" },
                { icon: "💰", bg: "#FEF0EE", label: "Per Member",      val: `₹${group.members?.length > 0 ? Math.floor(totalSpent / group.members.length) : 0}`, color: "#F26B5B" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3.5 px-4 py-3.5 bg-[#FDFAF5] border border-stone-100 rounded-2xl">
                  <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">{s.label}</div>
                    <div className="font-[Fraunces,serif] text-xl font-black" style={{ color: s.color }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}