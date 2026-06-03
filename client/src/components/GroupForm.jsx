import { useState, useRef } from "react";
import axios from "axios";

const CATEGORIES = [
  { id: "trip",    label: "Trip",    icon: "🧳" },
  { id: "flat",    label: "Flat",    icon: "🏠" },
  { id: "friends", label: "Friends", icon: "👥" },
  { id: "office",  label: "Office",  icon: "🏢" },
  { id: "event",   label: "Event",   icon: "📅" },
];

const AVATAR_COLORS = ["#F26B5B", "#7C3AED", "#0D9488", "#D97706", "#DB2777"];

export default function GroupForm() {
  const [groupName,    setGroupName]    = useState("");
  const [description,  setDescription]  = useState("");
  const [category,     setCategory]     = useState("trip");
  const [currency,     setCurrency]     = useState("INR");
  const [splitType,    setSplitType]    = useState("equal");
  const [memberInput,  setMemberInput]  = useState("");
  const [members,      setMembers]      = useState([]);
  const [startDate,    setStartDate]    = useState("");
  const [endDate,      setEndDate]      = useState("");
  const [loading,      setLoading]      = useState(false);
  const [coverPreview, setCoverPreview] = useState(
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"
  );
  const [coverImage, setCoverImage] = useState(null);
  const fileRef = useRef();

  const addMember = () => {
    if (!memberInput.trim()) return;
    const name = memberInput.trim();
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setMembers(prev => [...prev, {
      id:      Date.now(),
      name,
      initials,
      color:  AVATAR_COLORS[prev.length % AVATAR_COLORS.length],
      upiId:  "",
    }]);
    setMemberInput("");
  };

  const removeMember = (id) => setMembers(prev => prev.filter(m => m.id !== id));

  const updateUpiId = (id, upiId) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, upiId } : m));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setCoverImage(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim())     return alert("Group name is required");
      if (members.length === 0)  return alert("Please add at least 1 member");
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");

      const formData = new FormData();
      formData.append("groupName",   groupName);
      formData.append("description", description);
      formData.append("category",    category);
      formData.append("currency",    currency);
      formData.append("splitType",   splitType);
      if (startDate) formData.append("startDate", startDate);
      if (endDate)   formData.append("endDate",   endDate);

      formData.append("members", JSON.stringify(
        members.map(m => ({
          name:     m.name,
          initials: m.initials,
          color:    m.color,
          upiId:    m.upiId || "",
        }))
      ));

      if (coverImage) formData.append("coverImage", coverImage);

      const { data } = await axios.post("https://settleji.onrender.com/api/groups", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(data);
      alert("Group Created Successfully");

      setGroupName(""); setDescription(""); setCategory("trip"); setCurrency("INR");
      setSplitType("equal"); setMembers([]); setStartDate(""); setEndDate("");
      setCoverImage(null);
      setCoverPreview("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input ring classes ── */
  const inputShell = "flex items-center gap-2.5 bg-white border border-stone-200 rounded-2xl px-4 py-3.5 shadow-sm focus-within:border-[#F26B5B] focus-within:ring-2 focus-within:ring-[#F26B5B]/10 transition-all";
  const inputBase  = "border-none outline-none font-medium text-[14px] text-stone-800 w-full bg-transparent placeholder-stone-400";

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-[Outfit,sans-serif] text-stone-900">

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .font-fraunces { font-family: 'Fraunces', serif; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; width: 100%; position: absolute; left: 0; cursor: pointer; }
        select { -webkit-appearance: none; appearance: none; }
      `}</style>

      {/* ══ TOP NAV ══ */}
      <nav className="flex items-center justify-between px-5 sm:px-10 py-3.5 bg-white border-b border-stone-100 sticky top-0 z-50 backdrop-blur-md">
        <button className="flex items-center gap-2 bg-transparent border-none font-bold text-sm text-stone-500 cursor-pointer hover:text-[#F26B5B] transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Groups
        </button>

        <span className="font-fraunces text-lg font-black tracking-tight hidden sm:block">✈️ SettleJi</span>

        <div className="flex gap-2.5">
          <button className="hidden sm:block bg-white border border-stone-200 rounded-full px-5 py-2 text-[13px] font-bold text-stone-500 hover:border-[#F26B5B] hover:text-[#F26B5B] transition-all cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="bg-stone-900 border-none rounded-full px-5 py-2 text-[13px] font-bold text-white flex items-center gap-1.5 shadow-[0_4px_14px_rgba(28,25,23,0.18)] hover:bg-stone-800 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </nav>

      {/* ══ HERO BANNER ══ */}
      <div className="bg-white border-b border-stone-100 px-6 sm:px-12 py-8 sm:py-9 flex items-center gap-7 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-[radial-gradient(circle,#FBCDC8_0%,transparent_70%)] opacity-60 pointer-events-none" />
        <div className="absolute left-[36%] -bottom-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,#99F6E4_0%,transparent_70%)] opacity-50 pointer-events-none" />

        <div className="w-16 h-16 bg-[#FDFAF5] border border-stone-200 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-sm relative z-10">
          👥
        </div>

        <div className="relative z-10">
          <h2 className="font-fraunces text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
            Create New Group
          </h2>
          <p className="text-sm text-stone-400 font-medium mt-1.5">
            Set up a group and <span className="text-[#F26B5B] font-bold">manage shared expenses</span> effortlessly.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-3.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#FEF0EE] text-[#F26B5B] border border-[#FBCDC8]">🧾 AI Receipt Split</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#F0FDFA] text-[#0D9488] border border-[#99F6E4]">⚡ Real-Time Sync</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">💸 UPI Settlement</span>
          </div>
        </div>

        <div className="absolute right-14 top-1/2 -translate-y-1/2 text-7xl opacity-15 select-none z-0 hidden lg:block">
          👨‍👩‍👧‍👦
        </div>
      </div>

      {/* ══ FORM GRID ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 sm:px-12 py-9 max-w-[1200px] mx-auto">

        {/* ── LEFT COLUMN ── */}
        <div>

          {/* Group Details Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm mb-6">
            <div className="flex items-center gap-2.5 font-fraunces text-base font-bold text-stone-900 mb-5 pb-3.5 border-b border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-[#FEF0EE] flex items-center justify-center text-base flex-shrink-0">📝</span>
              Group Details
            </div>

            {/* Group Name */}
            <div className="mb-6">
              <label className="block text-[11px] font-extrabold text-stone-500 mb-2.5 uppercase tracking-widest">
                Group Name <span className="text-[#F26B5B]">*</span>
              </label>
              <div className={inputShell}>
                <input className={inputBase} placeholder="e.g. Goa Trip 2026" value={groupName} onChange={e => setGroupName(e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-[11px] font-extrabold text-stone-500 mb-2.5 uppercase tracking-widest">
                Description
              </label>
              <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3.5 shadow-sm focus-within:border-[#F26B5B] focus-within:ring-2 focus-within:ring-[#F26B5B]/10 transition-all">
                <textarea
                  className="border-none outline-none font-medium text-[14px] text-stone-800 w-full bg-transparent resize-none min-h-[88px] leading-relaxed placeholder-stone-400"
                  placeholder="Write a short description..."
                  value={description}
                  maxLength={200}
                  onChange={e => setDescription(e.target.value)}
                />
                <div className="text-right text-[11px] text-stone-400 font-semibold mt-1.5">{description.length}/200</div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-500 mb-2.5 uppercase tracking-widest">
                Category <span className="text-[#F26B5B]">*</span>
              </label>
              <div className="flex gap-2.5 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1.5 px-4 py-3.5 border rounded-2xl text-[12px] font-bold min-w-[68px] shadow-sm transition-all cursor-pointer
                      ${category === cat.id
                        ? "border-[#F26B5B] bg-[#FEF0EE] text-[#F26B5B] shadow-[0_4px_14px_rgba(242,107,91,0.18)]"
                        : "border-stone-200 bg-white text-stone-500 hover:border-[#F26B5B] hover:text-[#F26B5B] hover:bg-[#FEF0EE] hover:-translate-y-0.5"
                      }`}
                  >
                    <span className="text-[22px]">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm">
            <div className="flex items-center gap-2.5 font-fraunces text-base font-bold text-stone-900 mb-5 pb-3.5 border-b border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-base flex-shrink-0">⚙️</span>
              Settings
            </div>

            {/* Currency */}
            <div className="mb-6">
              <label className="block text-[11px] font-extrabold text-stone-500 mb-2.5 uppercase tracking-widest">Currency</label>
              <div className={inputShell}>
                <span className="text-base font-extrabold text-[#F26B5B] flex-shrink-0">₹</span>
                <select className={inputBase + " font-semibold cursor-pointer"} value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
                <svg className="flex-shrink-0 text-stone-400 pointer-events-none" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            {/* Split Type */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-500 mb-2.5 uppercase tracking-widest">Default Split Type</label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {[{id:"equal",icon:"⚖️",label:"Equal Split"},{id:"percentage",icon:"%",label:"Percentage"},{id:"custom",icon:"✏️",label:"Custom"}].map(s => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSplitType(s.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 border rounded-2xl text-[13px] font-bold shadow-sm transition-all cursor-pointer
                      ${splitType === s.id
                        ? "border-[#0D9488] bg-[#F0FDFA] text-[#0D9488] shadow-[0_4px_14px_rgba(13,148,136,0.15)]"
                        : "border-stone-200 bg-white text-stone-500 hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
                      }`}
                  >
                    <span>{s.icon}</span> {s.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5 bg-[#F0FDFA] border border-[#99F6E4] rounded-xl px-3.5 py-2.5 text-[12.5px] text-[#0D9488] font-semibold mt-2.5">
                <span>ℹ️</span> You can change the split type for individual expenses later.
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-0">

          {/* Cover Image Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm mb-6">
            <div className="flex items-center gap-2.5 font-fraunces text-base font-bold text-stone-900 mb-5 pb-3.5 border-b border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-base flex-shrink-0">🖼️</span>
              Cover Image
            </div>
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white flex items-stretch min-h-[180px] shadow-sm">
              <div
                className="flex-1 flex flex-col items-center justify-center gap-2 px-5 py-7 cursor-pointer hover:bg-[#FDFAF5] transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-[#F5EFE6] border border-stone-200 flex items-center justify-center text-xl mb-1">📷</div>
                <p className="text-[13px] font-bold text-stone-800 text-center">Upload Cover Image</p>
                <span className="text-[11px] text-stone-400 font-medium">PNG, JPG up to 10MB</span>
                <button
                  type="button"
                  className="bg-stone-900 text-white border-none rounded-full px-5 py-2 text-xs font-bold mt-1 hover:bg-stone-800 transition-colors cursor-pointer"
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                >
                  Choose Image
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              {coverPreview && (
                <div className="w-48 flex-shrink-0 overflow-hidden relative group">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Members Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm mb-6">
            <div className="flex items-center gap-2.5 font-fraunces text-base font-bold text-stone-900 mb-5 pb-3.5 border-b border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-base flex-shrink-0">👤</span>
              Add Members <span className="text-[#F26B5B] ml-0.5">*</span>
            </div>

            {/* Member Input Row */}
            <div className="flex gap-2 mb-3.5">
              <div className="flex-1 flex items-center gap-2.5 border border-stone-200 rounded-2xl px-4 py-3 bg-white shadow-sm focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/10 transition-all">
                <input
                  className="border-none outline-none font-medium text-[14px] text-stone-800 w-full bg-transparent placeholder-stone-400"
                  placeholder="Enter member name"
                  value={memberInput}
                  onChange={e => setMemberInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addMember()}
                />
              </div>
              <button
                type="button"
                onClick={addMember}
                className="bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] rounded-2xl px-5 py-3 text-[14px] font-extrabold whitespace-nowrap hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-all cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="text-[11px] text-stone-400 font-bold mb-2.5 uppercase tracking-wider">
              Members ({members.length}) — add UPI ID for QR payments
            </div>

            {/* Member Cards */}
            {members.map(m => (
              <div
                key={m.id}
                className="bg-white border border-stone-200 rounded-2xl px-4 py-3.5 mb-2.5 shadow-sm hover:border-[#DDD6FE] transition-colors"
              >
                {/* Top row */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                    style={{ background: m.color }}
                  >
                    {m.initials}
                  </div>
                  <span className="text-[14px] font-extrabold text-stone-900 flex-1">{m.name}</span>
                  <button
                    className="bg-[#F5EFE6] border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-[11px] text-stone-500 hover:bg-[#F26B5B] hover:text-white transition-all leading-none p-0"
                    onClick={() => removeMember(m.id)}
                  >
                    ✕
                  </button>
                </div>
                {/* UPI Input */}
                <div className="flex items-center gap-2 bg-[#FDFAF5] border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-[#0D9488] focus-within:ring-2 focus-within:ring-[#0D9488]/10 transition-all">
                  <span className="text-sm flex-shrink-0">📱</span>
                  <input
                    className="border-none outline-none font-semibold text-[12px] text-stone-800 w-full bg-transparent placeholder-stone-400"
                    placeholder="UPI ID e.g. name@upi (optional)"
                    value={m.upiId}
                    onChange={e => updateUpiId(m.id, e.target.value)}
                  />
                  {m.upiId && (
                    <span className="text-[10px] font-bold text-[#0D9488] bg-[#F0FDFA] rounded-md px-1.5 py-0.5 whitespace-nowrap">
                      ✓ UPI
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dates Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm">
            <div className="flex items-center gap-2.5 font-fraunces text-base font-bold text-stone-900 mb-5 pb-3.5 border-b border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-base flex-shrink-0">📅</span>
              Trip Dates
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { label: "Start Date", value: startDate, setter: setStartDate },
                { label: "End Date",   value: endDate,   setter: setEndDate   },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block text-[11px] font-extrabold text-stone-500 mb-2.5 uppercase tracking-widest">{label}</label>
                  <div className="relative flex items-center gap-2 border border-stone-200 rounded-2xl px-4 py-3 bg-white shadow-sm focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-[#D97706]/10 transition-all">
                    <svg className="flex-shrink-0" width="15" height="15" fill="none" stroke="#A8A29E" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <input
                      type="date"
                      className="border-none outline-none font-medium text-[13.5px] text-stone-400 [&:valid]:text-stone-900 w-full bg-transparent cursor-pointer"
                      value={value}
                      onChange={e => setter(e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══ HINT BOX ══ */}
      <div className="flex items-start gap-3.5 bg-white border border-stone-200 rounded-3xl px-5 sm:px-6 py-5 shadow-sm mx-6 sm:mx-12 mb-10">
        <span className="text-[22px] flex-shrink-0 mt-0.5">💡</span>
        <div>
          <strong className="block text-[14px] font-extrabold text-stone-900">Pro Tip</strong>
          <p className="text-[13px] text-stone-400 font-medium mt-1 leading-relaxed">
            Add each member's <span className="text-[#F26B5B] font-bold">UPI ID</span> so others can scan their QR code and pay directly from the expense overview.
          </p>
        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="flex justify-end sm:justify-between items-center gap-3 bg-white border-t border-stone-100 px-6 sm:px-12 py-4 sticky bottom-0 z-50">
        <div className="hidden sm:flex items-center gap-2 flex-1 text-[13px] text-stone-400 font-semibold">
          <span className="text-base">👥</span>
          {members.length > 0 ? `${members.length} member${members.length > 1 ? "s" : ""} added` : "No members added yet"}
        </div>
        <button className="bg-white border border-stone-200 rounded-full px-8 py-3 text-[14px] font-bold text-stone-500 hover:border-[#F26B5B] hover:text-[#F26B5B] transition-all cursor-pointer">
          Cancel
        </button>
        <button
          onClick={handleCreateGroup}
          disabled={loading}
          className="bg-stone-900 border-none rounded-full px-9 py-3 text-[14px] font-extrabold text-white flex items-center gap-2 shadow-[0_6px_20px_rgba(28,25,23,0.2)] hover:bg-stone-800 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
        >
          {loading ? "Creating..." : "🚀 Create Group"}
        </button>
      </div>

    </div>
  );
}