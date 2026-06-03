import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const CATS = [
  { v: "Food", e: "🍽️" },
  { v: "Travel", e: "✈️" },
  { v: "Hotel", e: "🏨" },
  { v: "Shopping", e: "🛍️" },
  { v: "Fuel", e: "⛽" },
  { v: "Entertainment", e: "🎉" },
  { v: "Other", e: "💳" },
  { v: "Drinks", e: "🍻" },
];
const COLORS = [
  "#7c3aed",
  "#0ea5e9",
  "#f59e0b",
  "#f43f5e",
  "#10b981",
  "#ec4899",
  "#6366f1",
  "#0d9488",
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&display=swap');

  .font-outfit { font-family: 'Outfit', sans-serif; }
  .font-fraunces { font-family: 'Fraunces', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.18); }
    100% { transform: scale(1); }
  }
  @keyframes scanLine {
    0%   { top: 0%;  opacity: 1; }
    50%  { top: 90%; opacity: 1; }
    100% { top: 0%;  opacity: 0; }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .anim-fadeUp  { animation: fadeUp .45s ease both; }
  .anim-popIn   { animation: popIn .3s ease; }
  .anim-pop     { animation: pop .3s ease; }

  .scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    animation: scanLine 1.8s ease-in-out infinite;
  }
  .scan-spinner {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 4px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    animation: spin 1s linear infinite;
  }
  .hero-input::placeholder { color: rgba(255,255,255,.35); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function ExpensePage() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [group,         setGroup]         = useState(null);
  const [members,       setMembers]       = useState([]);
  const [selectedPayer, setSelectedPayer] = useState(0);
  const [title,         setTitle]         = useState("");
  const [amount,        setAmount]        = useState(0);
  const [notes,         setNotes]         = useState("");
  const [category,      setCategory]      = useState("Food");
  const [preview,       setPreview]       = useState("");
  const [billFile,      setBillFile]      = useState(null);
  const [loading,       setLoading]       = useState(false);

  const [scanning,  setScanning]  = useState(false);
  const [aiResult,  setAiResult]  = useState(null);
  const [aiError,   setAiError]   = useState("");
  const scanInputRef = useRef();

  useEffect(() => { if (groupId) fetchGroup(); }, [groupId]);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `https://settleji.onrender.com/api/groups/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const gd = data.group || data;
      setGroup(gd);
      setMembers(
        gd.members?.map((m, i) => ({
          _id:      m._id || m.user?._id,
          name:     m.name || m.user?.name,
          initials: (m.name || m.user?.name)
            ?.split(" ")?.map((n) => n[0])?.join("")?.slice(0, 2)?.toUpperCase(),
          color: COLORS[i % COLORS.length],
        })) || []
      );
    } catch (e) {
      console.log(e);
      alert("Failed to fetch group");
    }
  };

  const handleBillUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setBillFile(f);
      setPreview(URL.createObjectURL(f));
      setAiResult(null);
      setAiError("");
    }
  };

  const handleScanBill = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setBillFile(f);
    setPreview(URL.createObjectURL(f));
    setAiResult(null);
    setAiError("");
    setScanning(true);

    try {
      const base64   = await fileToBase64(f);
      const mimeType = f.type || "image/jpeg";

      const prompt = `You are a bill/receipt reader. Analyze this image carefully.
It could be a restaurant bill, grocery receipt, PhonePe/GPay/Paytm payment screenshot, Swiggy/Zomato order, or any payment proof.

Extract and return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "title": "short descriptive title of what was purchased (e.g. 'Dinner at Pizza Hut', 'Swiggy Order', 'Grocery Shopping')",
  "amount": <total amount as number, no currency symbol>,
  "category": "<one of: Food, Travel, Hotel, Shopping, Fuel, Entertainment, Drinks, Other>",
  "merchant": "merchant or app name if visible",
  "items": [
    { "name": "item name", "price": <price as number> }
  ],
  "confidence": "<high|medium|low>"
}

Rules:
- amount must be the FINAL total paid (including tax, delivery charges etc)
- For PhonePe/GPay/Paytm screenshots, amount is the money sent/paid
- items array can be empty [] if no itemized list is visible
- Return ONLY the JSON, nothing else`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.log("Gemini HTTP error:", res.status, errText);
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      console.log("Gemini full response:", JSON.stringify(data, null, 2));

      if (data.error) throw new Error(data.error.message || "Gemini API error");

      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Gemini raw text:", raw);

      if (!raw) throw new Error("Empty response from Gemini");

      const clean  = raw.replace(/```json\n?|```\n?/g, "").trim();
      const parsed = JSON.parse(clean);

      setAiResult(parsed);
    } catch (e) {
      console.log("Gemini error:", e);
      const msg = e?.message || "";
      if (msg.includes("403") || msg.includes("API_KEY")) {
        setAiError("Invalid API key. Check your VITE_GEMINI_API_KEY in .env file.");
      } else if (msg.includes("404")) {
        setAiError("Gemini model not found. Check your API key has access.");
      } else if (msg.includes("Empty response")) {
        setAiError("Gemini returned empty response. Try a clearer image.");
      } else {
        setAiError("Could not read the bill. Try a clearer image or fill in manually.");
      }
    } finally {
      setScanning(false);
    }
  };

  const applyAiResult = () => {
    if (!aiResult) return;
    if (aiResult.title)    setTitle(aiResult.title);
    if (aiResult.amount)   setAmount(aiResult.amount);
    if (aiResult.category) {
      const matched = CATS.find(
        (c) => c.v.toLowerCase() === aiResult.category.toLowerCase()
      );
      if (matched) setCategory(matched.v);
    }
    if (aiResult.merchant && !aiResult.title) setTitle(aiResult.merchant);
    setAiResult(null);
  };

  const handleAddExpense = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!groupId)        { alert("Group ID missing from route"); return; }
      if (!title)          { alert("Please enter a title"); return; }
      if (!members.length) { alert("No members found in group"); return; }

      const totalAmount    = Number(amount);
      const sharePerPerson = totalAmount / members.length;

      const payload = {
        group:    groupId,
        title,
        amount:   totalAmount,
        category,
        paidBy:   members[selectedPayer]?.name,
        participants: members.map((m) => ({
          user:  m.name,
          share: parseFloat(sharePerPerson.toFixed(2)),
        })),
        notes,
      };

      console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

      await axios.post("https://settleji.onrender.com/api/expenses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Expense added successfully");
      navigate(`/trips/${groupId}`);
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount    = Number(amount);
  const sharePerPerson = members.length > 0 ? totalAmount / members.length : 0;
  const payer          = members[selectedPayer];

  /* ── Section label ── */
  const SectionLabel = ({ children }) => (
    <div className="font-outfit flex items-center gap-3 px-4 pt-4 pb-2.5 text-[10px] font-bold tracking-[1.1px] uppercase text-slate-400">
      {children}
      <span className="flex-1 h-[1.5px] bg-gradient-to-r from-indigo-100 to-transparent" />
    </div>
  );

  return (
    <>
      <style>{globalStyles}</style>

      <div className="font-outfit min-h-screen bg-[#f3f2ff] flex justify-center pb-28">
        <div className="w-full max-w-[480px] bg-white relative anim-fadeUp">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b-[1.5px] border-indigo-100 sticky top-0 z-30">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-indigo-50 border-none flex items-center justify-center text-indigo-600 hover:bg-indigo-100 hover:-translate-x-0.5 transition-all"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-fraunces text-[17px] font-black text-slate-900 tracking-tight">
              Add Expense
            </span>
            <button className="w-9 h-9 rounded-xl bg-indigo-50 border-none flex items-center justify-center text-slate-500 text-lg">
              ⋮
            </button>
          </div>

          {/* ── GROUP BANNER ── */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b-[1.5px] border-indigo-100">
            <img
              src={
                group?.coverImage ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&q=60"
              }
              alt="group"
              className="w-11 h-9 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0"
            />
            <div>
              <div className="text-[13px] font-extrabold text-slate-900">
                {group?.groupName || group?.name || "Trip"}
              </div>
              <div className="flex gap-2 mt-0.5 flex-wrap">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-md px-2 py-0.5 tracking-wide">
                  👥 {members.length} members
                </span>
                {group?.category && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-md px-2 py-0.5 tracking-wide">
                    🏷️ {group.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── AMOUNT HERO ── */}
          <div
            className="relative overflow-hidden px-5 pt-6 pb-5"
            style={{ background: "linear-gradient(145deg,#4338ca 0%,#6d28d9 50%,#7c3aed 100%)" }}
          >
            {/* orbs */}
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/[.07] pointer-events-none" />
            <div className="absolute -bottom-10 -left-5 w-32 h-32 rounded-full bg-white/[.05] pointer-events-none" />
            <div className="absolute top-5 left-1/2 w-20 h-20 rounded-full bg-white/[.04] pointer-events-none" />

            <p className="relative z-10 text-[10px] font-bold tracking-[1.4px] uppercase text-white/60 mb-1.5">
              Total Amount
            </p>

            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-1">
                <span className="font-fraunces text-[28px] font-black text-white/75 leading-none">₹</span>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0"
                  className="font-fraunces hero-input text-[52px] font-black text-white bg-transparent border-none outline-none w-52 tracking-[-3px] leading-none caret-white/80"
                />
              </div>
              <div className="bg-white/15 border-[1.5px] border-white/28 rounded-xl px-4 py-2 text-xs font-extrabold text-white tracking-[.8px] backdrop-blur-md">
                INR
              </div>
            </div>

            {/* quick chips */}
            <div className="relative z-10 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {[100, 200, 500, 1000, 2000, 5000].map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount((a) => a + n)}
                  className="flex-shrink-0 bg-white/14 border-[1.5px] border-white/22 rounded-full px-3.5 py-1.5 text-xs font-bold text-white/90 hover:bg-white/25 hover:-translate-y-0.5 transition-all backdrop-blur-md"
                >
                  +₹{n}
                </button>
              ))}
            </div>

            {members.length > 0 && (
              <div className="relative z-10 flex items-center justify-between bg-white/10 border-[1.5px] border-white/18 rounded-xl px-4 py-2.5 mt-3.5 backdrop-blur-md">
                <div>
                  <p className="text-[11px] font-semibold text-white/70">
                    Split equally among {members.length} people
                  </p>
                  <p className="text-[10px] text-white/55 mt-0.5">Each person pays their share</p>
                </div>
                <span className="font-fraunces text-lg font-black text-white">
                  ₹{Math.round(sharePerPerson)} / person
                </span>
              </div>
            )}
          </div>

          {/* ── AI SCAN ── */}
          <SectionLabel>Scan Bill with AI</SectionLabel>
          <div className="mx-4 mb-1">

            <button
              disabled={scanning}
              onClick={() => scanInputRef.current?.click()}
              className="w-full py-4 rounded-2xl border-none flex items-center justify-center gap-2.5 text-sm font-extrabold text-white mb-2.5 transition-all disabled:opacity-65 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#0d9488,#2dd4bf)",
                boxShadow: "0 6px 20px rgba(13,148,136,.35)",
              }}
            >
              {scanning ? (
                <>
                  <div className="scan-spinner" />
                  <span>Reading bill...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🤖</span>
                  <span>Scan Bill / Payment Screenshot</span>
                </>
              )}
            </button>
            <input
              ref={scanInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleScanBill}
            />

            {/* preview with scan overlay */}
            {preview && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 mb-2.5">
                <img src={preview} alt="bill" className="w-full block max-h-52 object-cover" />
                {scanning && (
                  <div className="absolute inset-0 bg-indigo-600/55 flex flex-col items-center justify-center gap-3">
                    <div className="scan-line" />
                    <div className="scan-spinner" />
                    <p className="text-[13px] font-bold text-white">Analysing with Gemini AI...</p>
                  </div>
                )}
              </div>
            )}

            {/* error */}
            {aiError && (
              <div className="bg-red-50 border-[1.5px] border-red-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-red-600 flex items-center gap-2 mb-2">
                ⚠️ {aiError}
              </div>
            )}

            {/* AI result card */}
            {aiResult && (
              <div
                className="anim-popIn rounded-2xl p-4 mb-2.5 border-2 border-green-300"
                style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-green-600 tracking-wide uppercase mb-3">
                  <span>✅</span> Bill Detected
                  {aiResult.confidence && (
                    <span className="ml-auto text-[10px] bg-green-200 px-2 py-0.5 rounded-md text-green-600">
                      {aiResult.confidence} confidence
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* full-width amount */}
                  <div className="col-span-2 bg-white rounded-xl p-2.5 border border-green-200">
                    <p className="text-[10px] font-bold text-green-300 uppercase tracking-wide mb-1">Total Amount</p>
                    <p className="font-fraunces text-[22px] font-black text-green-500">₹{aiResult.amount}</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-green-200">
                    <p className="text-[10px] font-bold text-green-300 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm font-extrabold text-green-900">{aiResult.title}</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-green-200">
                    <p className="text-[10px] font-bold text-green-300 uppercase tracking-wide mb-1">Category</p>
                    <p className="text-sm font-extrabold text-green-900">
                      {CATS.find((c) => c.v.toLowerCase() === aiResult.category?.toLowerCase())?.e}{" "}
                      {aiResult.category}
                    </p>
                  </div>
                  {aiResult.merchant && (
                    <div className="col-span-2 bg-white rounded-xl p-2.5 border border-green-200">
                      <p className="text-[10px] font-bold text-green-300 uppercase tracking-wide mb-1">Merchant</p>
                      <p className="text-sm font-extrabold text-green-900">{aiResult.merchant}</p>
                    </div>
                  )}
                </div>

                {aiResult.items?.length > 0 && (
                  <div className="bg-white rounded-xl p-2.5 border border-green-200 mb-3">
                    <p className="text-[10px] font-bold text-green-600 uppercase mb-2">📋 Items Detected</p>
                    {aiResult.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-1 border-b border-green-50 last:border-0"
                      >
                        <span className="text-xs font-semibold text-green-800">{item.name}</span>
                        <span className="text-xs font-extrabold text-green-500">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {members.length > 0 && (
                  <div className="bg-white rounded-xl p-2.5 border border-green-200 mb-3">
                    <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Split Preview</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-green-800">
                        ₹{aiResult.amount} ÷ {members.length} people
                      </span>
                      <span className="font-fraunces text-lg font-black text-green-500">
                        = ₹{Math.round(aiResult.amount / members.length)} each
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={applyAiResult}
                  className="w-full py-3 border-none rounded-xl text-sm font-extrabold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg,#16a34a,#15803d)",
                    boxShadow: "0 4px 14px rgba(22,163,74,.3)",
                  }}
                >
                  ✨ Apply to Expense Form
                </button>
              </div>
            )}
          </div>

          {/* ── EXPENSE DETAILS ── */}
          <SectionLabel>Expense Details</SectionLabel>
          <div className="px-4">
            <div className="relative mb-3">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">✏️</span>
              <input
                className="w-full border-[1.5px] border-indigo-100 rounded-xl py-3 pl-10 pr-3.5 outline-none bg-slate-50 font-outfit text-[13px] font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,.1)] focus:bg-white transition-all"
                placeholder="What's this expense for?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="relative mb-3">
              <span className="absolute left-3.5 top-4 text-base pointer-events-none">📝</span>
              <textarea
                className="w-full border-[1.5px] border-indigo-100 rounded-xl py-3 pl-10 pr-3.5 outline-none bg-slate-50 font-outfit text-[13px] font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,.1)] focus:bg-white transition-all resize-none min-h-[80px] leading-relaxed"
                placeholder="Add a note or description..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* ── CATEGORY ── */}
          <SectionLabel>Category</SectionLabel>
          <div className="grid grid-cols-4 gap-2 px-4 mb-1">
            {CATS.map((cat) => (
              <button
                key={cat.v}
                onClick={() => setCategory(cat.v)}
                className={`flex flex-col items-center gap-1.5 py-3 px-1.5 border-[1.5px] rounded-2xl font-outfit text-[10px] font-bold transition-all ${
                  category === cat.v
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-[0_0_0_3px_rgba(79,70,229,.12)]"
                    : "border-indigo-100 bg-slate-50 text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,70,229,.15)]"
                }`}
              >
                <span className={`text-[22px] ${category === cat.v ? "anim-pop" : ""}`}>{cat.e}</span>
                {cat.v}
              </button>
            ))}
          </div>

          {/* ── RECEIPT ── */}
          <SectionLabel>Receipt</SectionLabel>
          <label className="block mx-4 border-2 border-dashed border-indigo-200 rounded-2xl p-4 bg-indigo-50 text-center cursor-pointer hover:border-indigo-500 hover:bg-blue-100 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(79,70,229,.12)] transition-all">
            {preview ? (
              <img
                src={preview}
                alt="receipt"
                className="w-full rounded-xl mt-3 object-cover max-h-48 border-2 border-indigo-200"
              />
            ) : (
              <>
                <div className="text-[32px] mb-1.5">🧾</div>
                <p className="text-[13px] font-extrabold text-indigo-600 mb-0.5">Tap to upload bill manually</p>
                <p className="text-[11px] text-slate-400 font-medium">JPG, PNG supported</p>
              </>
            )}
            <input type="file" hidden onChange={handleBillUpload} />
          </label>

          {/* ── PAID BY ── */}
          <SectionLabel>Paid By</SectionLabel>
          <div className="flex gap-3 px-4 pb-5 overflow-x-auto scrollbar-hide">
            {members.map((m, i) => (
              <div
                key={m._id || i}
                className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
                onClick={() => setSelectedPayer(i)}
              >
                <div
                  className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white text-[15px] font-extrabold relative shadow-lg transition-all hover:-translate-y-1 ${
                    selectedPayer === i
                      ? "border-[3px] border-indigo-500 shadow-[0_0_0_3px_rgba(79,70,229,.25),0_4px_14px_rgba(0,0,0,.18)]"
                      : "border-[3px] border-transparent"
                  }`}
                  style={{ background: m.color }}
                >
                  {m.initials}
                  {selectedPayer === i && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-600 border-[2.5px] border-white flex items-center justify-center text-[9px] text-white font-black">
                      ✓
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500 max-w-[56px] text-center truncate">
                  {m.name}
                </span>
              </div>
            ))}
          </div>

          {/* ── SPLIT TABLE ── */}
          {members.length > 0 && (
            <>
              <SectionLabel>Split Breakdown</SectionLabel>
              <div className="mx-4 mb-2 border-[1.5px] border-indigo-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(79,70,229,.06)]">
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
                >
                  <span className="text-xs font-extrabold text-white/90 tracking-wide">EQUAL SPLIT</span>
                  <span className="bg-white/20 rounded-lg px-2.5 py-1 text-xs font-bold text-white">
                    ₹{Math.round(sharePerPerson)} each
                  </span>
                </div>
                {members.map((m, i) => (
                  <div
                    key={m._id || i}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-indigo-50 last:border-0 bg-slate-50 hover:bg-indigo-50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0"
                      style={{ background: m.color }}
                    >
                      {m.initials}
                    </div>
                    <span className="text-[13px] font-bold text-slate-900 flex-1">{m.name}</span>
                    <span className="font-fraunces text-base font-black text-indigo-600">
                      ₹{Math.round(sharePerPerson)}
                    </span>
                    {i === selectedPayer ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-600 ml-1.5">
                        paid
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-600 ml-1.5">
                        owes
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SUMMARY ── */}
          {members.length > 0 && payer && (
            <div className="mx-4 mt-3 mb-2 rounded-[18px] overflow-hidden border-[1.5px] border-indigo-100 shadow-[0_4px_16px_rgba(79,70,229,.08)]">
              <div
                className="px-4 py-3.5 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                <span className="text-xs font-extrabold text-white/85 tracking-wide">EXPENSE SUMMARY</span>
                <span className="bg-white/20 rounded-lg px-2.5 py-1 text-xs font-bold text-white">
                  {members.length} people
                </span>
              </div>
              <div className="bg-slate-50 px-4 py-3.5 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="font-fraunces text-lg font-black text-indigo-600 mb-0.5">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total</p>
                </div>
                <div className="text-center">
                  <p className="font-fraunces text-lg font-black text-violet-600 mb-0.5">
                    ₹{Math.round(sharePerPerson)}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Each</p>
                </div>
                <div className="text-center">
                  <p className="font-fraunces text-lg font-black text-teal-600 mb-0.5">{members.length}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Members</p>
                </div>
              </div>
              <div className="h-[1.5px] bg-indigo-100" />
              <div className="bg-white px-4 py-3 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                  style={{ background: payer.color }}
                >
                  {payer.initials}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Paid by</p>
                  <p className="text-sm font-extrabold text-slate-900">{payer.name}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[11px] text-slate-400 font-semibold">Category</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    {CATS.find((c) => c.v === category)?.e} {category}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── CTA ── */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pt-3.5 pb-6 bg-white border-t-[1.5px] border-indigo-100">
            <button
              onClick={handleAddExpense}
              disabled={loading}
              className="w-full py-[17px] rounded-2xl border-none text-white font-outfit text-[15px] font-extrabold flex items-center justify-center gap-2.5 tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                boxShadow: "0 8px 24px rgba(79,70,229,.4)",
              }}
            >
              {loading ? "⏳ Adding..." : "➤ Add Expense"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}