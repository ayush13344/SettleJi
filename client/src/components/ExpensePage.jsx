import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --indigo:      #4f46e5;
    --indigo-d:    #3730a3;
    --violet:      #7c3aed;
    --sky:         #0ea5e9;
    --amber:       #f59e0b;
    --rose:        #f43f5e;
    --emerald:     #10b981;
    --pink:        #ec4899;
    --teal:        #0d9488;
    --white:       #ffffff;
    --bg:          #f3f2ff;
    --card:        #ffffff;
    --ink:         #0f172a;
    --ink2:        #475569;
    --ink3:        #94a3b8;
    --border:      #e8e4ff;
    --indigo-lt:   #eef2ff;
    --indigo-md:   #c7d2fe;
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.18)} 100%{transform:scale(1)} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scanLine {
    0%   { top: 0%; opacity: 1; }
    50%  { top: 90%; opacity: 1; }
    100% { top: 0%; opacity: 0; }
  }
  @keyframes popIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

  .ep-root {
    min-height: 100vh; background: var(--bg);
    font-family: 'Outfit', sans-serif; color: var(--ink);
    display: flex; justify-content: center; padding-bottom: 110px;
  }
  .ep-shell {
    width: 100%; max-width: 480px; background: var(--card);
    position: relative; animation: fadeUp .45s ease both;
  }

  /* HEADER */
  .ep-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; background: var(--white);
    border-bottom: 1.5px solid var(--border);
    position: sticky; top: 0; z-index: 30;
  }
  .ep-back {
    width: 36px; height: 36px; border-radius: 12px;
    background: var(--indigo-lt); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--indigo); transition: background .15s, transform .15s;
  }
  .ep-back:hover { background: var(--indigo-md); transform: translateX(-2px); }
  .ep-header-title {
    font-family: 'Fraunces', serif; font-size: 17px; font-weight: 900;
    color: var(--ink); letter-spacing: -0.3px;
  }
  .ep-menu-btn {
    width: 36px; height: 36px; border-radius: 12px;
    background: var(--indigo-lt); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink2); font-size: 18px;
  }

  /* GROUP BANNER */
  .ep-group-banner {
    display: flex; align-items: center; gap: 12px; padding: 10px 16px;
    background: linear-gradient(90deg,#eef2ff 0%,#faf5ff 100%);
    border-bottom: 1.5px solid var(--border);
  }
  .ep-group-img {
    width: 44px; height: 38px; border-radius: 10px; object-fit: cover;
    border: 2px solid var(--white); box-shadow: 0 2px 8px rgba(79,70,229,.18); flex-shrink: 0;
  }
  .ep-group-name { font-size: 13px; font-weight: 800; color: var(--ink); }
  .ep-group-meta { display: flex; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
  .ep-group-chip {
    font-size: 10px; font-weight: 700; color: var(--indigo);
    background: var(--indigo-lt); border-radius: 6px; padding: 2px 8px; letter-spacing: .3px;
  }

  /* AMOUNT HERO */
  .ep-hero {
    background: linear-gradient(145deg,#4338ca 0%,#6d28d9 50%,#7c3aed 100%);
    padding: 24px 20px 20px; position: relative; overflow: hidden;
  }
  .ep-hero-orb1 { position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.07);pointer-events:none; }
  .ep-hero-orb2 { position:absolute;bottom:-40px;left:-20px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.05);pointer-events:none; }
  .ep-hero-orb3 { position:absolute;top:20px;left:50%;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.04);pointer-events:none; }
  .ep-hero-label { font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px;position:relative;z-index:1; }
  .ep-hero-amt-row { display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;margin-bottom:16px; }
  .ep-hero-amt-left { display:flex;align-items:baseline;gap:4px; }
  .ep-hero-rs { font-family:'Fraunces',serif;font-size:28px;font-weight:900;color:rgba(255,255,255,.75);line-height:1; }
  .ep-hero-input {
    font-family:'Fraunces',serif;font-size:52px;font-weight:900;
    color:#fff;background:none;border:none;outline:none;
    width:210px;letter-spacing:-3px;line-height:1;caret-color:rgba(255,255,255,.8);
  }
  .ep-hero-input::placeholder { color:rgba(255,255,255,.35); }
  .ep-currency-pill {
    background:rgba(255,255,255,.16);border:1.5px solid rgba(255,255,255,.28);
    border-radius:10px;padding:8px 16px;font-size:12px;font-weight:800;color:#fff;
    cursor:pointer;backdrop-filter:blur(8px);letter-spacing:.8px;position:relative;z-index:1;
  }
  .ep-quick-row { display:flex;gap:8px;position:relative;z-index:1;overflow-x:auto;padding-bottom:2px; }
  .ep-quick-row::-webkit-scrollbar { display:none; }
  .ep-quick-chip {
    flex-shrink:0;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.22);
    border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;color:rgba(255,255,255,.9);
    cursor:pointer;transition:background .15s,transform .15s;backdrop-filter:blur(6px);
  }
  .ep-quick-chip:hover { background:rgba(255,255,255,.26);transform:translateY(-2px); }
  .ep-per-strip {
    display:flex;align-items:center;justify-content:space-between;
    background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.18);
    border-radius:12px;padding:10px 16px;margin-top:14px;position:relative;z-index:1;backdrop-filter:blur(6px);
  }
  .ep-per-label { font-size:11px;font-weight:600;color:rgba(255,255,255,.7); }
  .ep-per-val   { font-family:'Fraunces',serif;font-size:18px;font-weight:900;color:#fff; }
  .ep-per-sub   { font-size:10px;color:rgba(255,255,255,.55);margin-top:1px; }

  /* SECTION LABEL */
  .ep-sec {
    padding:16px 16px 10px;font-size:10px;font-weight:700;letter-spacing:1.1px;
    text-transform:uppercase;color:var(--ink3);display:flex;align-items:center;gap:10px;
  }
  .ep-sec::after { content:'';flex:1;height:1.5px;background:linear-gradient(90deg,var(--border),transparent); }

  /* FORM FIELDS */
  .ep-form { padding:0 16px; }
  .ep-field-wrap { position:relative;margin-bottom:12px; }
  .ep-field-icon { position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none; }
  .ep-input, .ep-textarea {
    width:100%;border:1.5px solid var(--border);border-radius:12px;
    padding:13px 14px 13px 40px;outline:none;background:#fafafe;
    font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:var(--ink);
    box-sizing:border-box;transition:border-color .15s,box-shadow .15s,background .15s;
  }
  .ep-input:focus, .ep-textarea:focus { border-color:var(--indigo);box-shadow:0 0 0 3px rgba(79,70,229,.1);background:var(--white); }
  .ep-input::placeholder, .ep-textarea::placeholder { color:var(--ink3);font-weight:500; }
  .ep-textarea { min-height:80px;resize:none;padding-top:13px;line-height:1.5; }

  /* CATEGORY GRID */
  .ep-cat-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 16px;margin-bottom:4px; }
  .ep-cat-item {
    display:flex;flex-direction:column;align-items:center;gap:5px;
    padding:12px 6px 10px;border:1.5px solid var(--border);border-radius:14px;
    background:#fafafe;cursor:pointer;font-size:10px;font-weight:700;color:var(--ink2);
    transition:all .18s;font-family:'Outfit',sans-serif;
  }
  .ep-cat-item .ci { font-size:22px; }
  .ep-cat-item:hover { border-color:var(--indigo);background:var(--indigo-lt);color:var(--indigo);transform:translateY(-2px);box-shadow:0 4px 12px rgba(79,70,229,.15); }
  .ep-cat-item.sel { border-color:var(--indigo);background:var(--indigo-lt);color:var(--indigo);box-shadow:0 0 0 3px rgba(79,70,229,.12); }
  .ep-cat-item.sel .ci { animation:pop .3s ease; }

  /* ── AI SCAN AREA ── */
  .ep-scan-wrap { margin: 0 16px 4px; }

  .ep-scan-btn {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #0d9488, #2dd4bf);
    border: none; border-radius: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 800; color: #fff;
    box-shadow: 0 6px 20px rgba(13,148,136,.35);
    transition: transform .2s, box-shadow .2s;
    margin-bottom: 10px;
  }
  .ep-scan-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(13,148,136,.45); }
  .ep-scan-btn:disabled { opacity: .65; cursor: not-allowed; }

  .ep-scan-preview-wrap {
    position: relative; border-radius: 14px; overflow: hidden;
    border: 2px solid var(--indigo-md); margin-bottom: 10px;
  }
  .ep-scan-preview-img { width: 100%; display: block; max-height: 200px; object-fit: cover; }
  .ep-scan-overlay {
    position: absolute; inset: 0;
    background: rgba(79,70,229,.55);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  }
  .ep-scan-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 4px solid rgba(255,255,255,.3); border-top-color: #fff;
    animation: spin 1s linear infinite;
  }
  .ep-scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    animation: scanLine 1.8s ease-in-out infinite;
  }
  .ep-scan-status { font-size: 13px; font-weight: 700; color: #fff; }

  /* AI RESULT CARD */
  .ep-ai-result {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 2px solid #86efac; border-radius: 16px;
    padding: 16px; margin-bottom: 10px;
    animation: popIn .3s ease;
  }
  .ep-ai-result-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 800; color: #16a34a;
    letter-spacing: .5px; text-transform: uppercase; margin-bottom: 12px;
  }
  .ep-ai-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .ep-ai-result-item { background: #fff; border-radius: 10px; padding: 10px 12px; border: 1px solid #bbf7d0; }
  .ep-ai-result-label { font-size: 10px; font-weight: 700; color: #86efac; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 3px; }
  .ep-ai-result-val   { font-size: 14px; font-weight: 800; color: #14532d; }
  .ep-ai-result-val.big { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; color: #16a34a; }

  .ep-ai-items { background: #fff; border-radius: 10px; padding: 10px 12px; border: 1px solid #bbf7d0; margin-bottom: 12px; }
  .ep-ai-items-title { font-size: 10px; font-weight: 700; color: #16a34a; text-transform: uppercase; margin-bottom: 8px; }
  .ep-ai-item-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #f0fdf4; }
  .ep-ai-item-row:last-child { border-bottom: none; }
  .ep-ai-item-name { font-size: 12px; font-weight: 600; color: #166534; }
  .ep-ai-item-price { font-size: 12px; font-weight: 800; color: #16a34a; }

  .ep-ai-apply-btn {
    width: 100%; padding: 13px; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 800; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 14px rgba(22,163,74,.3);
    transition: transform .15s, box-shadow .15s;
  }
  .ep-ai-apply-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(22,163,74,.4); }

  .ep-ai-error {
    background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px;
    padding: 12px 14px; font-size: 12px; font-weight: 600; color: #dc2626;
    display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  }

  /* UPLOAD */
  .ep-upload {
    display: block; border: 2px dashed var(--indigo-md);
    border-radius: 16px; padding: 18px 16px;
    background: var(--indigo-lt); text-align: center;
    cursor: pointer; transition: all .18s;
  }
  .ep-upload:hover { border-color:var(--indigo);background:#e0e7ff;transform:translateY(-2px);box-shadow:0 6px 18px rgba(79,70,229,.12); }
  .ep-upload-icon  { font-size:32px;margin-bottom:6px; }
  .ep-upload-title { font-size:13px;font-weight:800;color:var(--indigo);margin-bottom:3px; }
  .ep-upload-sub   { font-size:11px;color:var(--ink3);font-weight:500; }
  .ep-upload-preview { width:100%;border-radius:12px;margin-top:12px;object-fit:cover;max-height:190px;border:2px solid var(--indigo-md); }

  /* PAID BY */
  .ep-payer-scroll { display:flex;gap:12px;padding:4px 16px 20px;overflow-x:auto; }
  .ep-payer-scroll::-webkit-scrollbar { display:none; }
  .ep-payer { display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;flex-shrink:0; }
  .ep-av {
    width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    color:#fff;font-size:15px;font-weight:800;position:relative;
    box-shadow:0 4px 14px rgba(0,0,0,.18);transition:transform .2s,box-shadow .2s;border:3px solid transparent;
  }
  .ep-payer:hover .ep-av { transform:translateY(-4px);box-shadow:0 8px 20px rgba(0,0,0,.22); }
  .ep-av.sel { border-color:var(--indigo);box-shadow:0 0 0 3px rgba(79,70,229,.25),0 4px 14px rgba(0,0,0,.18); }
  .ep-av-check {
    position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;border-radius:50%;
    background:var(--indigo);border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;
    font-size:9px;color:#fff;font-weight:900;
  }
  .ep-av-name { font-size:10px;font-weight:700;color:var(--ink2);max-width:56px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }

  /* SPLIT TABLE */
  .ep-split-table { margin:0 16px 8px;border:1.5px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(79,70,229,.06); }
  .ep-split-head { background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:12px 16px;display:flex;align-items:center;justify-content:space-between; }
  .ep-split-head-title { font-size:12px;font-weight:800;color:rgba(255,255,255,.9);letter-spacing:.4px; }
  .ep-split-head-badge { background:rgba(255,255,255,.2);border-radius:8px;padding:3px 10px;font-size:11px;font-weight:700;color:#fff; }
  .ep-split-row { display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border);background:#fafafe;transition:background .15s; }
  .ep-split-row:last-child { border-bottom:none; }
  .ep-split-row:hover { background:var(--indigo-lt); }
  .ep-split-av { width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;flex-shrink:0; }
  .ep-split-name  { font-size:13px;font-weight:700;color:var(--ink);flex:1; }
  .ep-split-share { font-family:'Fraunces',serif;font-size:16px;font-weight:900;color:var(--indigo); }
  .ep-split-tag { font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;background:#dcfce7;color:#16a34a;margin-left:6px; }
  .ep-split-tag.payer { background:#ede9fe;color:var(--indigo); }

  /* SUMMARY */
  .ep-summary { margin:0 16px 8px;border-radius:18px;overflow:hidden;border:1.5px solid var(--border);box-shadow:0 4px 16px rgba(79,70,229,.08); }
  .ep-summary-header { background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:14px 18px;display:flex;align-items:center;justify-content:space-between; }
  .ep-summary-title { font-size:12px;font-weight:800;color:rgba(255,255,255,.85);letter-spacing:.4px; }
  .ep-summary-badge { background:rgba(255,255,255,.2);border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;color:#fff; }
  .ep-summary-body { background:#fafafe;padding:14px 18px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px; }
  .ep-sum-stat { text-align:center; }
  .ep-sum-val { font-family:'Fraunces',serif;font-size:18px;font-weight:900;color:var(--ink);margin-bottom:2px; }
  .ep-sum-val.indigo { color:var(--indigo); }
  .ep-sum-val.violet { color:var(--violet); }
  .ep-sum-val.teal   { color:var(--teal); }
  .ep-sum-lbl { font-size:10px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.6px; }
  .ep-summary-divider { height:1.5px;background:var(--border); }
  .ep-summary-payer { background:var(--white);padding:12px 18px;display:flex;align-items:center;gap:12px; }
  .ep-sum-av { width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;flex-shrink:0; }
  .ep-sum-payer-label { font-size:11px;color:var(--ink3);font-weight:600; }
  .ep-sum-payer-name  { font-size:14px;font-weight:800;color:var(--ink); }

  /* CTA */
  .ep-cta { position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:14px 16px 26px;background:var(--white);border-top:1.5px solid var(--border); }
  .ep-cta-btn {
    width:100%;padding:17px 0;background:linear-gradient(135deg,#4f46e5,#7c3aed);
    color:#fff;border:none;border-radius:16px;font-family:'Outfit',sans-serif;
    font-size:15px;font-weight:800;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:10px;
    box-shadow:0 8px 24px rgba(79,70,229,.4);transition:transform .2s,box-shadow .2s;letter-spacing:.3px;
  }
  .ep-cta-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 12px 32px rgba(79,70,229,.5); }
  .ep-cta-btn:disabled { opacity:.6;cursor:not-allowed; }
`;

const CATS = [
  { v:"Food",e:"🍽️" },{ v:"Travel",e:"✈️" },{ v:"Hotel",e:"🏨" },{ v:"Shopping",e:"🛍️" },
  { v:"Fuel",e:"⛽" },{ v:"Entertainment",e:"🎉" },{ v:"Other",e:"💳" },{ v:"Drinks",e:"🍻" },
];
const COLORS = ["#7c3aed","#0ea5e9","#f59e0b","#f43f5e","#10b981","#ec4899","#6366f1","#0d9488"];

// convert File/Blob to base64
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload  = () => resolve(reader.result.split(",")[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function ExpensePage() {
  const navigate  = useNavigate();
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

  // AI scan state
  const [scanning,    setScanning]    = useState(false);
  const [aiResult,    setAiResult]    = useState(null);   // { title, amount, category, items[] }
  const [aiError,     setAiError]     = useState("");
  const scanInputRef = useRef();

  useEffect(() => { if (groupId) fetchGroup(); }, [groupId]);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`https://settleji.onrender.com/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gd = data.group || data;
      setGroup(gd);
      setMembers(gd.members?.map((m,i) => ({
        _id:      m._id || m.user?._id,
        name:     m.name || m.user?.name,
        initials: (m.name||m.user?.name)?.split(" ")?.map(n=>n[0])?.join("")?.slice(0,2)?.toUpperCase(),
        color:    COLORS[i % COLORS.length],
      })) || []);
    } catch(e) { console.log(e); alert("Failed to fetch group"); }
  };

  const handleBillUpload = (e) => {
    const f = e.target.files[0];
    if (f) { setBillFile(f); setPreview(URL.createObjectURL(f)); setAiResult(null); setAiError(""); }
  };

  // ── GEMINI AI BILL SCAN ──
  const handleScanBill = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setBillFile(f);
    setPreview(URL.createObjectURL(f));
    setAiResult(null);
    setAiError("");
    setScanning(true);

    try {
      const base64 = await fileToBase64(f);
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

      // ✅ use gemini-2.0-flash — latest stable free model
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
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

      // ✅ check HTTP status before parsing
      if (!res.ok) {
        const errText = await res.text();
        console.log("Gemini HTTP error:", res.status, errText);
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      console.log("Gemini full response:", JSON.stringify(data, null, 2));

      // ✅ check for API-level errors
      if (data.error) {
        throw new Error(data.error.message || "Gemini API error");
      }

      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Gemini raw text:", raw);

      if (!raw) throw new Error("Empty response from Gemini");

      // strip markdown fences if present
      const clean = raw.replace(/```json\n?|```\n?/g, "").trim();
      const parsed = JSON.parse(clean);

      setAiResult(parsed);
    } catch(e) {
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

  // apply AI result to form fields
  const applyAiResult = () => {
    if (!aiResult) return;
    if (aiResult.title)    setTitle(aiResult.title);
    if (aiResult.amount)   setAmount(aiResult.amount);
    if (aiResult.category) {
      const matched = CATS.find(c => c.v.toLowerCase() === aiResult.category.toLowerCase());
      if (matched) setCategory(matched.v);
    }
    if (aiResult.merchant && !aiResult.title) setTitle(aiResult.merchant);
    setAiResult(null); // collapse after applying
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
        participants: members.map(m => ({
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
    } catch(e) {
      console.log(e);
      alert(e?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount    = Number(amount);
  const sharePerPerson = members.length > 0 ? totalAmount / members.length : 0;
  const payer          = members[selectedPayer];

  return (
    <>
      <style>{css}</style>
      <div className="ep-root">
        <div className="ep-shell">

          {/* HEADER */}
          <div className="ep-header">
            <button className="ep-back" onClick={() => navigate(-1)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <span className="ep-header-title">Add Expense</span>
            <button className="ep-menu-btn">⋮</button>
          </div>

          {/* GROUP BANNER */}
          <div className="ep-group-banner">
            <img src={group?.coverImage||"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&q=60"} alt="group" className="ep-group-img"/>
            <div>
              <div className="ep-group-name">{group?.groupName||group?.name||"Trip"}</div>
              <div className="ep-group-meta">
                <span className="ep-group-chip">👥 {members.length} members</span>
                {group?.category && <span className="ep-group-chip">🏷️ {group.category}</span>}
              </div>
            </div>
          </div>

          {/* AMOUNT HERO */}
          <div className="ep-hero">
            <div className="ep-hero-orb1"/><div className="ep-hero-orb2"/><div className="ep-hero-orb3"/>
            <div className="ep-hero-label">Total Amount</div>
            <div className="ep-hero-amt-row">
              <div className="ep-hero-amt-left">
                <span className="ep-hero-rs">₹</span>
                <input type="number" value={amount||""} onChange={e=>setAmount(Number(e.target.value))} className="ep-hero-input" placeholder="0"/>
              </div>
              <div className="ep-currency-pill">INR</div>
            </div>
            <div className="ep-quick-row">
              {[100,200,500,1000,2000,5000].map(n => (
                <button key={n} className="ep-quick-chip" onClick={()=>setAmount(a=>a+n)}>+₹{n}</button>
              ))}
            </div>
            {members.length > 0 && (
              <div className="ep-per-strip">
                <div>
                  <div className="ep-per-label">Split equally among {members.length} people</div>
                  <div className="ep-per-sub">Each person pays their share</div>
                </div>
                <div className="ep-per-val">₹{Math.round(sharePerPerson)} / person</div>
              </div>
            )}
          </div>

          {/* ── AI SCAN SECTION ── */}
          <div className="ep-sec">Scan Bill with AI</div>
          <div className="ep-scan-wrap">

            {/* scan button */}
            <button
              className="ep-scan-btn"
              disabled={scanning}
              onClick={() => scanInputRef.current?.click()}
            >
              {scanning ? (
                <><div className="ep-scan-spinner"/><span>Reading bill...</span></>
              ) : (
                <><span style={{fontSize:20}}>🤖</span><span>Scan Bill / Payment Screenshot</span></>
              )}
            </button>
            <input ref={scanInputRef} type="file" accept="image/*" hidden onChange={handleScanBill}/>

            {/* scanning overlay on preview */}
            {preview && (
              <div className="ep-scan-preview-wrap">
                <img src={preview} alt="bill" className="ep-scan-preview-img"/>
                {scanning && (
                  <div className="ep-scan-overlay">
                    <div className="ep-scan-line"/>
                    <div className="ep-scan-spinner"/>
                    <div className="ep-scan-status">Analysing with Gemini AI...</div>
                  </div>
                )}
              </div>
            )}

            {/* error */}
            {aiError && (
              <div className="ep-ai-error">⚠️ {aiError}</div>
            )}

            {/* AI result card */}
            {aiResult && (
              <div className="ep-ai-result">
                <div className="ep-ai-result-title">
                  <span>✅</span> Bill Detected
                  {aiResult.confidence && (
                    <span style={{marginLeft:"auto",fontSize:10,background:"#bbf7d0",padding:"2px 8px",borderRadius:6,color:"#16a34a"}}>
                      {aiResult.confidence} confidence
                    </span>
                  )}
                </div>

                <div className="ep-ai-result-grid">
                  <div className="ep-ai-result-item" style={{gridColumn:"1/-1"}}>
                    <div className="ep-ai-result-label">Total Amount</div>
                    <div className="ep-ai-result-val big">₹{aiResult.amount}</div>
                  </div>
                  <div className="ep-ai-result-item">
                    <div className="ep-ai-result-label">Description</div>
                    <div className="ep-ai-result-val">{aiResult.title}</div>
                  </div>
                  <div className="ep-ai-result-item">
                    <div className="ep-ai-result-label">Category</div>
                    <div className="ep-ai-result-val">
                      {CATS.find(c=>c.v.toLowerCase()===aiResult.category?.toLowerCase())?.e} {aiResult.category}
                    </div>
                  </div>
                  {aiResult.merchant && (
                    <div className="ep-ai-result-item" style={{gridColumn:"1/-1"}}>
                      <div className="ep-ai-result-label">Merchant</div>
                      <div className="ep-ai-result-val">{aiResult.merchant}</div>
                    </div>
                  )}
                </div>

                {/* itemized list */}
                {aiResult.items?.length > 0 && (
                  <div className="ep-ai-items">
                    <div className="ep-ai-items-title">📋 Items Detected</div>
                    {aiResult.items.map((item,i) => (
                      <div key={i} className="ep-ai-item-row">
                        <span className="ep-ai-item-name">{item.name}</span>
                        <span className="ep-ai-item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* per-person preview */}
                {members.length > 0 && (
                  <div style={{background:"#fff",borderRadius:10,padding:"10px 12px",border:"1px solid #bbf7d0",marginBottom:12}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#16a34a",textTransform:"uppercase",marginBottom:4}}>Split Preview</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:600,color:"#166534"}}>₹{aiResult.amount} ÷ {members.length} people</span>
                      <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:900,color:"#16a34a"}}>= ₹{Math.round(aiResult.amount/members.length)} each</span>
                    </div>
                  </div>
                )}

                <button className="ep-ai-apply-btn" onClick={applyAiResult}>
                  ✨ Apply to Expense Form
                </button>
              </div>
            )}
          </div>

          {/* EXPENSE DETAILS */}
          <div className="ep-sec">Expense Details</div>
          <div className="ep-form">
            <div className="ep-field-wrap">
              <span className="ep-field-icon">✏️</span>
              <input className="ep-input" placeholder="What's this expense for?" value={title} onChange={e=>setTitle(e.target.value)}/>
            </div>
            <div className="ep-field-wrap">
              <span className="ep-field-icon">📝</span>
              <textarea className="ep-textarea" style={{paddingTop:13}} placeholder="Add a note or description..." value={notes} onChange={e=>setNotes(e.target.value)}/>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="ep-sec">Category</div>
          <div className="ep-cat-grid">
            {CATS.map(cat => (
              <div key={cat.v} className={`ep-cat-item${category===cat.v?" sel":""}`} onClick={()=>setCategory(cat.v)}>
                <span className="ci">{cat.e}</span>{cat.v}
              </div>
            ))}
          </div>

          {/* RECEIPT (manual upload fallback) */}
          <div className="ep-sec">Receipt</div>
          <label className="ep-upload">
            {preview ? (
              <img src={preview} alt="receipt" className="ep-upload-preview"/>
            ) : (
              <>
                <div className="ep-upload-icon">🧾</div>
                <div className="ep-upload-title">Tap to upload bill manually</div>
                <div className="ep-upload-sub">JPG, PNG supported</div>
              </>
            )}
            <input type="file" hidden onChange={handleBillUpload}/>
          </label>

          {/* PAID BY */}
          <div className="ep-sec">Paid By</div>
          <div className="ep-payer-scroll">
            {members.map((m,i) => (
              <div key={m._id||i} className="ep-payer" onClick={()=>setSelectedPayer(i)}>
                <div className={`ep-av${selectedPayer===i?" sel":""}`} style={{background:m.color}}>
                  {m.initials}
                  {selectedPayer===i && <div className="ep-av-check">✓</div>}
                </div>
                <span className="ep-av-name">{m.name}</span>
              </div>
            ))}
          </div>

          {/* SPLIT TABLE */}
          {members.length > 0 && (
            <>
              <div className="ep-sec">Split Breakdown</div>
              <div className="ep-split-table">
                <div className="ep-split-head">
                  <span className="ep-split-head-title">EQUAL SPLIT</span>
                  <span className="ep-split-head-badge">₹{Math.round(sharePerPerson)} each</span>
                </div>
                {members.map((m,i) => (
                  <div key={m._id||i} className="ep-split-row">
                    <div className="ep-split-av" style={{background:m.color}}>{m.initials}</div>
                    <span className="ep-split-name">{m.name}</span>
                    <span className="ep-split-share">₹{Math.round(sharePerPerson)}</span>
                    {i===selectedPayer
                      ? <span className="ep-split-tag payer">paid</span>
                      : <span className="ep-split-tag">owes</span>
                    }
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SUMMARY */}
          {members.length > 0 && payer && (
            <div className="ep-summary" style={{marginTop:12}}>
              <div className="ep-summary-header">
                <span className="ep-summary-title">EXPENSE SUMMARY</span>
                <span className="ep-summary-badge">{members.length} people</span>
              </div>
              <div className="ep-summary-body">
                <div className="ep-sum-stat">
                  <div className="ep-sum-val indigo">₹{totalAmount.toLocaleString()}</div>
                  <div className="ep-sum-lbl">Total</div>
                </div>
                <div className="ep-sum-stat">
                  <div className="ep-sum-val violet">₹{Math.round(sharePerPerson)}</div>
                  <div className="ep-sum-lbl">Each</div>
                </div>
                <div className="ep-sum-stat">
                  <div className="ep-sum-val teal">{members.length}</div>
                  <div className="ep-sum-lbl">Members</div>
                </div>
              </div>
              <div className="ep-summary-divider"/>
              <div className="ep-summary-payer">
                <div className="ep-sum-av" style={{background:payer.color}}>{payer.initials}</div>
                <div>
                  <div className="ep-sum-payer-label">Paid by</div>
                  <div className="ep-sum-payer-name">{payer.name}</div>
                </div>
                <div style={{marginLeft:"auto",textAlign:"right"}}>
                  <div className="ep-sum-payer-label">Category</div>
                  <div className="ep-sum-payer-name">{CATS.find(c=>c.v===category)?.e} {category}</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="ep-cta">
            <button className="ep-cta-btn" onClick={handleAddExpense} disabled={loading}>
              {loading ? "⏳ Adding..." : "➤ Add Expense"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}