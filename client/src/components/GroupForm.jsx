import { useState, useRef } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:    #FDFAF5; --cream2:   #F5EFE6; --white:    #FFFFFF;
    --ink:      #1C1917; --ink2:     #57534E; --ink3:     #A8A29E;
    --border:   rgba(28,25,23,0.09);
    --coral:    #F26B5B; --coral-bg: #FEF0EE; --coral-bd: #FBCDC8;
    --teal:     #0D9488; --teal-bg:  #F0FDFA; --teal-bd:  #99F6E4;
    --amber:    #D97706; --amber-bg: #FFFBEB;
    --purple:   #7C3AED; --purple-bg:#F5F3FF; --purple-bd:#DDD6FE;
    --shadow-sm: 0 2px 8px rgba(28,25,23,0.06);
    --shadow-md: 0 8px 28px rgba(28,25,23,0.09);
    --r-sm: 10px; --r-md: 16px; --r-lg: 22px; --r-xl: 28px;
  }

  body { font-family: 'Outfit', sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; }
  .page { min-height: 100vh; background: var(--cream); position: relative; }

  .topnav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 40px; background: var(--white);
    border-bottom: 1.5px solid var(--border);
    position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);
  }
  .back-btn {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700; color: var(--ink2); cursor: pointer;
    padding: 0; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--coral); }
  .nav-brand { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 900; color: var(--ink); letter-spacing: -0.3px; }
  .nav-actions { display: flex; gap: 10px; }
  .btn-cancel {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 999px;
    padding: 9px 22px; font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif;
    cursor: pointer; color: var(--ink2); transition: border-color 0.15s, color 0.15s;
  }
  .btn-cancel:hover { border-color: var(--coral); color: var(--coral); }
  .btn-create {
    background: var(--ink); border: none; border-radius: 999px; padding: 9px 22px;
    font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer;
    color: #fff; display: flex; align-items: center; gap: 7px;
    transition: background 0.15s, transform 0.2s; box-shadow: 0 4px 14px rgba(28,25,23,0.18);
  }
  .btn-create:hover { background: #2C2724; transform: translateY(-1px); }
  .btn-create:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .hero-banner {
    background: var(--white); border-bottom: 1.5px solid var(--border);
    padding: 36px 48px 32px; display: flex; align-items: center; gap: 28px;
    position: relative; overflow: hidden;
  }
  .hero-banner::before {
    content: ''; position: absolute; right: -60px; top: -80px;
    width: 280px; height: 280px; border-radius: 50%;
    background: radial-gradient(circle, #FBCDC8 0%, transparent 70%); opacity: .6;
  }
  .hero-banner::after {
    content: ''; position: absolute; left: 36%; bottom: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, #99F6E4 0%, transparent 70%); opacity: .5;
  }
  .hero-icon-wrap {
    width: 64px; height: 64px; background: var(--cream); border: 1.5px solid var(--border);
    border-radius: 20px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 28px; position: relative; z-index: 1; box-shadow: var(--shadow-sm);
  }
  .hero-text { position: relative; z-index: 1; }
  .hero-text h2 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 900; color: var(--ink); letter-spacing: -0.5px; line-height: 1.1; }
  .hero-text p  { font-size: 14px; color: var(--ink3); margin-top: 6px; font-weight: 500; }
  .hero-text p span { color: var(--coral); font-weight: 700; }
  .hero-badges { display: flex; gap: 10px; margin-top: 14px; position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 999px; border: 1.5px solid; }
  .hero-badge.coral { background: var(--coral-bg); color: var(--coral); border-color: var(--coral-bd); }
  .hero-badge.teal  { background: var(--teal-bg);  color: var(--teal);  border-color: var(--teal-bd); }
  .hero-badge.amber { background: var(--amber-bg); color: var(--amber); border-color: #FDE68A; }
  .hero-illustration { position: absolute; right: 56px; top: 50%; transform: translateY(-50%); font-size: 72px; opacity: .15; user-select: none; z-index: 0; }

  .form-area {
    display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
    padding: 36px 48px 48px; max-width: 1200px; margin: 0 auto;
  }

  .field-block { margin-bottom: 24px; }
  .field-label {
    font-size: 12px; font-weight: 800; color: var(--ink2); margin-bottom: 9px;
    display: flex; align-items: center; gap: 4px; letter-spacing: .6px; text-transform: uppercase;
  }
  .required { color: var(--coral); }

  .input-shell {
    background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-md);
    padding: 13px 16px; display: flex; align-items: center; gap: 10px;
    transition: border-color .18s, box-shadow .18s; box-shadow: var(--shadow-sm);
  }
  .input-shell:focus-within { border-color: var(--coral); box-shadow: 0 0 0 3px rgba(242,107,91,0.1); }
  .input-shell input, .input-shell select {
    border: none; outline: none; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--ink); width: 100%; background: transparent;
  }
  .input-shell input::placeholder { color: var(--ink3); }
  .input-shell select { font-weight: 600; appearance: none; cursor: pointer; }
  .input-shell .prefix { font-size: 16px; font-weight: 800; color: var(--coral); flex-shrink: 0; }
  .chevron-icon { flex-shrink: 0; color: var(--ink3); pointer-events: none; }

  .textarea-shell {
    background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-md);
    padding: 13px 16px; transition: border-color .18s, box-shadow .18s; box-shadow: var(--shadow-sm);
  }
  .textarea-shell:focus-within { border-color: var(--coral); box-shadow: 0 0 0 3px rgba(242,107,91,0.1); }
  .textarea-shell textarea {
    border: none; outline: none; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--ink); width: 100%;
    resize: none; background: transparent; min-height: 88px; line-height: 1.65;
  }
  .textarea-shell textarea::placeholder { color: var(--ink3); }
  .char-count { text-align: right; font-size: 11px; color: var(--ink3); font-weight: 600; margin-top: 6px; }

  .category-grid { display: flex; gap: 10px; flex-wrap: wrap; }
  .cat-btn {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 14px 16px; border: 1.5px solid var(--border); border-radius: var(--r-md);
    background: var(--white); cursor: pointer; font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 700; color: var(--ink2); transition: all 0.18s;
    min-width: 72px; box-shadow: var(--shadow-sm);
  }
  .cat-btn span.cat-icon { font-size: 22px; }
  .cat-btn:hover { border-color: var(--coral); color: var(--coral); background: var(--coral-bg); transform: translateY(-2px); }
  .cat-btn.active { border-color: var(--coral); background: var(--coral-bg); color: var(--coral); box-shadow: 0 4px 14px rgba(242,107,91,0.18); }

  .split-grid { display: flex; gap: 10px; }
  .split-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 12px 10px; border: 1.5px solid var(--border); border-radius: var(--r-md);
    background: var(--white); cursor: pointer; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--ink2); transition: all 0.18s; box-shadow: var(--shadow-sm);
  }
  .split-btn:hover  { border-color: var(--teal); color: var(--teal); background: var(--teal-bg); }
  .split-btn.active { border-color: var(--teal); background: var(--teal-bg); color: var(--teal); box-shadow: 0 4px 14px rgba(13,148,136,0.15); }
  .info-box {
    display: flex; align-items: center; gap: 9px; background: var(--teal-bg);
    border: 1.5px solid var(--teal-bd); border-radius: var(--r-sm); padding: 10px 14px;
    font-size: 12.5px; color: var(--teal); font-weight: 600; margin-top: 10px;
  }

  .right-col { display: flex; flex-direction: column; gap: 0; }

  .cover-box {
    border: 1.5px solid var(--border); border-radius: var(--r-lg); overflow: hidden;
    background: var(--white); display: flex; align-items: stretch;
    min-height: 180px; box-shadow: var(--shadow-sm); margin-bottom: 24px;
  }
  .cover-upload-area {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 8px; padding: 28px 20px; cursor: pointer; transition: background .2s;
  }
  .cover-upload-area:hover { background: var(--cream); }
  .upload-icon-circle {
    width: 50px; height: 50px; border-radius: 50%; background: var(--cream2);
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; font-size: 20px; margin-bottom: 4px;
  }
  .cover-upload-area p    { font-size: 13px; font-weight: 700; color: var(--ink); text-align: center; }
  .cover-upload-area span { font-size: 11px; color: var(--ink3); font-weight: 500; }
  .btn-choose {
    background: var(--ink); color: #fff; border: none; border-radius: 999px;
    padding: 8px 20px; font-size: 12px; font-weight: 700; font-family: 'Outfit', sans-serif;
    cursor: pointer; margin-top: 4px; transition: background 0.15s;
  }
  .btn-choose:hover { background: #2C2724; }
  .cover-preview { width: 190px; flex-shrink: 0; overflow: hidden; position: relative; }
  .cover-preview img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
  .cover-preview:hover img { transform: scale(1.05); }
  .cover-preview-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(253,250,245,.3), transparent); }

  /* ── MEMBERS ── */
  .member-input-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .member-input-wrap {
    flex: 1; display: flex; align-items: center; gap: 10px;
    border: 1.5px solid var(--border); border-radius: var(--r-md);
    padding: 12px 16px; background: var(--white);
    transition: border-color .18s, box-shadow .18s; box-shadow: var(--shadow-sm);
  }
  .member-input-wrap:focus-within { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .member-input-wrap input {
    border: none; outline: none; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--ink); width: 100%; background: transparent;
  }
  .member-input-wrap input::placeholder { color: var(--ink3); }
  .btn-add {
    background: var(--purple-bg); color: var(--purple); border: 1.5px solid var(--purple-bd);
    border-radius: var(--r-md); padding: 12px 22px; font-size: 14px; font-weight: 800;
    font-family: 'Outfit', sans-serif; cursor: pointer; transition: background .15s, color .15s; white-space: nowrap;
  }
  .btn-add:hover { background: var(--purple); color: white; border-color: var(--purple); }

  .selected-label { font-size: 11px; color: var(--ink3); font-weight: 700; margin-bottom: 10px; letter-spacing: .5px; text-transform: uppercase; }

  /* ── MEMBER CARD (expanded with UPI) ── */
  .member-card {
    background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-md);
    padding: 14px 16px; margin-bottom: 10px; box-shadow: var(--shadow-sm);
    transition: border-color .15s;
  }
  .member-card:hover { border-color: var(--purple-bd); }

  .member-card-top {
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .member-avatar-placeholder {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .member-card-name { font-size: 14px; font-weight: 800; color: var(--ink); flex: 1; }
  .chip-remove {
    background: var(--cream2); border: none; border-radius: 50%;
    width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 11px; color: var(--ink2); padding: 0;
    transition: background .15s, color .15s; line-height: 1;
  }
  .chip-remove:hover { background: var(--coral); color: white; }

  .upi-input-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--cream); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 9px 12px;
    transition: border-color .15s, box-shadow .15s;
  }
  .upi-input-wrap:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
  .upi-icon { font-size: 14px; flex-shrink: 0; }
  .upi-input-wrap input {
    border: none; outline: none; font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 600; color: var(--ink); width: 100%; background: transparent;
  }
  .upi-input-wrap input::placeholder { color: var(--ink3); font-weight: 500; }
  .upi-badge {
    font-size: 10px; font-weight: 700; color: var(--teal);
    background: var(--teal-bg); border-radius: 6px; padding: 2px 7px; white-space: nowrap;
  }

  .dates-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .date-input-wrap {
    display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--border);
    border-radius: var(--r-md); padding: 12px 16px; background: var(--white);
    transition: border-color .18s, box-shadow .18s; box-shadow: var(--shadow-sm);
  }
  .date-input-wrap:focus-within { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(217,119,6,0.1); }
  .date-input-wrap input {
    border: none; outline: none; font-family: 'Outfit', sans-serif;
    font-size: 13.5px; font-weight: 500; color: var(--ink3); width: 100%; background: transparent; cursor: pointer;
  }
  .date-input-wrap input:valid { color: var(--ink); }

  .hint-box {
    display: flex; align-items: flex-start; gap: 14px; background: var(--white);
    border: 1.5px solid var(--border); border-radius: var(--r-lg); padding: 18px 22px;
    box-shadow: var(--shadow-sm); margin: 0 48px 40px;
  }
  .hint-icon { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
  .hint-text strong { font-size: 14px; font-weight: 800; color: var(--ink); }
  .hint-text p { font-size: 13px; color: var(--ink3); font-weight: 500; margin-top: 3px; line-height: 1.6; }
  .hint-text p span { color: var(--coral); font-weight: 700; }

  .form-section {
    background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-xl);
    padding: 28px; box-shadow: var(--shadow-sm); margin-bottom: 24px;
  }
  .section-heading {
    font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: var(--ink);
    margin-bottom: 22px; display: flex; align-items: center; gap: 10px;
    padding-bottom: 14px; border-bottom: 1.5px solid var(--border);
  }
  .section-heading-icon {
    width: 32px; height: 32px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
  }
  .icon-coral  { background: var(--coral-bg); }
  .icon-teal   { background: var(--teal-bg); }
  .icon-purple { background: var(--purple-bg); }
  .icon-amber  { background: var(--amber-bg); }

  .bottom-bar {
    display: flex; justify-content: flex-end; align-items: center; gap: 12px;
    background: var(--white); border-top: 1.5px solid var(--border);
    padding: 18px 48px; position: sticky; bottom: 0; z-index: 50;
  }
  .bar-hint { flex: 1; font-size: 13px; color: var(--ink3); font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .btn-cancel-lg {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 999px;
    padding: 13px 34px; font-size: 14px; font-weight: 700; font-family: 'Outfit', sans-serif;
    cursor: pointer; color: var(--ink2); transition: border-color .15s, color .15s;
  }
  .btn-cancel-lg:hover { border-color: var(--coral); color: var(--coral); }
  .btn-create-lg {
    background: var(--ink); border: none; border-radius: 999px; padding: 13px 36px;
    font-size: 14px; font-weight: 800; font-family: 'Outfit', sans-serif; cursor: pointer; color: #fff;
    display: flex; align-items: center; gap: 9px; transition: background .15s, transform .2s;
    box-shadow: 0 6px 20px rgba(28,25,23,0.2);
  }
  .btn-create-lg:hover { background: #2C2724; transform: translateY(-2px); }
  .btn-create-lg:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  @media(max-width: 900px) {
    .form-area { grid-template-columns: 1fr; padding: 24px 24px 40px; }
    .hero-banner { padding: 28px 28px; }
    .hero-illustration { display: none; }
    .bottom-bar { padding: 16px 24px; }
    .hint-box { margin: 0 24px 32px; }
    .bar-hint { display: none; }
  }
  @media(max-width: 600px) {
    .topnav { padding: 12px 18px; }
    .nav-brand { display: none; }
    .hero-badges { flex-wrap: wrap; }
    .form-section { padding: 20px; }
    .split-grid { flex-direction: column; }
    .dates-row { grid-template-columns: 1fr; }
  }
`;

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
      upiId:  "",  // ✅ UPI ID field
    }]);
    setMemberInput("");
  };

  const removeMember = (id) => setMembers(prev => prev.filter(m => m.id !== id));

  // ✅ update UPI ID for a specific member
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

      // ✅ include upiId per member
      formData.append("members", JSON.stringify(
        members.map(m => ({
          name:     m.name,
          initials: m.initials,
          color:    m.color,
          upiId:    m.upiId || "",
        }))
      ));

      if (coverImage) formData.append("coverImage", coverImage);

      const { data } = await axios.post("http://localhost:5000/api/groups", formData, {
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

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* TOP NAV */}
        <div className="topnav">
          <button className="back-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Groups
          </button>
          <div className="nav-brand">✈️ SplitTrip</div>
          <div className="nav-actions">
            <button className="btn-cancel">Cancel</button>
            <button className="btn-create" onClick={handleCreateGroup} disabled={loading}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="hero-banner">
          <div className="hero-icon-wrap">👥</div>
          <div className="hero-text">
            <h2>Create New Group</h2>
            <p>Set up a group and <span>manage shared expenses</span> effortlessly.</p>
            <div className="hero-badges">
              <span className="hero-badge coral">🧾 AI Receipt Split</span>
              <span className="hero-badge teal">⚡ Real-Time Sync</span>
              <span className="hero-badge amber">💸 UPI Settlement</span>
            </div>
          </div>
          <div className="hero-illustration">👨‍👩‍👧‍👦</div>
        </div>

        {/* FORM */}
        <div className="form-area">

          {/* LEFT */}
          <div>
            <div className="form-section">
              <div className="section-heading">
                <div className="section-heading-icon icon-coral">📝</div>
                Group Details
              </div>
              <div className="field-block">
                <div className="field-label">Group Name <span className="required">*</span></div>
                <div className="input-shell">
                  <input placeholder="e.g. Goa Trip 2026" value={groupName} onChange={e => setGroupName(e.target.value)} />
                </div>
              </div>
              <div className="field-block">
                <div className="field-label">Description</div>
                <div className="textarea-shell">
                  <textarea placeholder="Write a short description..." value={description} maxLength={200} onChange={e => setDescription(e.target.value)} />
                  <div className="char-count">{description.length}/200</div>
                </div>
              </div>
              <div className="field-block" style={{marginBottom:0}}>
                <div className="field-label">Category <span className="required">*</span></div>
                <div className="category-grid">
                  {CATEGORIES.map(cat => (
                    <button type="button" key={cat.id} className={`cat-btn${category === cat.id ? " active" : ""}`} onClick={() => setCategory(cat.id)}>
                      <span className="cat-icon">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-heading">
                <div className="section-heading-icon icon-teal">⚙️</div>
                Settings
              </div>
              <div className="field-block">
                <div className="field-label">Currency</div>
                <div className="input-shell">
                  <span className="prefix">₹</span>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                  <svg className="chevron-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <div className="field-block" style={{marginBottom:0}}>
                <div className="field-label">Default Split Type</div>
                <div className="split-grid">
                  {[{id:"equal",icon:"⚖️",label:"Equal Split"},{id:"percentage",icon:"%",label:"Percentage"},{id:"custom",icon:"✏️",label:"Custom"}].map(s => (
                    <button type="button" key={s.id} className={`split-btn${splitType === s.id ? " active" : ""}`} onClick={() => setSplitType(s.id)}>
                      <span>{s.icon}</span> {s.label}
                    </button>
                  ))}
                </div>
                <div className="info-box"><span>ℹ️</span> You can change the split type for individual expenses later.</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-col">

            {/* Cover Image */}
            <div className="form-section">
              <div className="section-heading">
                <div className="section-heading-icon icon-amber">🖼️</div>
                Cover Image
              </div>
              <div className="cover-box">
                <div className="cover-upload-area" onClick={() => fileRef.current?.click()}>
                  <div className="upload-icon-circle">📷</div>
                  <p>Upload Cover Image</p>
                  <span>PNG, JPG up to 10MB</span>
                  <button type="button" className="btn-choose" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                    Choose Image
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImageChange} />
                </div>
                {coverPreview && (
                  <div className="cover-preview">
                    <img src={coverPreview} alt="Cover preview" />
                    <div className="cover-preview-overlay" />
                  </div>
                )}
              </div>
            </div>

            {/* Members — with UPI ID */}
            <div className="form-section">
              <div className="section-heading">
                <div className="section-heading-icon icon-purple">👤</div>
                Add Members <span className="required" style={{marginLeft:2}}>*</span>
              </div>

              <div className="member-input-row">
                <div className="member-input-wrap">
                  <input
                    placeholder="Enter member name"
                    value={memberInput}
                    onChange={e => setMemberInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addMember()}
                  />
                </div>
                <button type="button" className="btn-add" onClick={addMember}>+ Add</button>
              </div>

              <div className="selected-label">Members ({members.length}) — add UPI ID for QR payments</div>

              {/* ✅ Member cards with UPI input */}
              {members.map(m => (
                <div className="member-card" key={m.id}>
                  <div className="member-card-top">
                    <div className="member-avatar-placeholder" style={{background: m.color}}>
                      {m.initials}
                    </div>
                    <span className="member-card-name">{m.name}</span>
                    <button className="chip-remove" onClick={() => removeMember(m.id)}>✕</button>
                  </div>
                  {/* UPI ID input */}
                  <div className="upi-input-wrap">
                    <span className="upi-icon">📱</span>
                    <input
                      placeholder="UPI ID e.g. name@upi (optional)"
                      value={m.upiId}
                      onChange={e => updateUpiId(m.id, e.target.value)}
                    />
                    {m.upiId && <span className="upi-badge">✓ UPI</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Dates */}
            <div className="form-section">
              <div className="section-heading">
                <div className="section-heading-icon icon-amber">📅</div>
                Trip Dates
              </div>
              <div className="dates-row">
                <div>
                  <div className="field-label">Start Date</div>
                  <div className="date-input-wrap">
                    <svg width="15" height="15" fill="none" stroke="#A8A29E" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className="field-label">End Date</div>
                  <div className="date-input-wrap">
                    <svg width="15" height="15" fill="none" stroke="#A8A29E" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* HINT */}
        <div className="hint-box">
          <div className="hint-icon">💡</div>
          <div className="hint-text">
            <strong>Pro Tip</strong>
            <p>Add each member's <span>UPI ID</span> so others can scan their QR code and pay directly from the expense overview.</p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="bottom-bar">
          <div className="bar-hint">
            <span style={{fontSize:16}}>👥</span>
            {members.length > 0 ? `${members.length} member${members.length > 1 ? "s" : ""} added` : "No members added yet"}
          </div>
          <button className="btn-cancel-lg">Cancel</button>
          <button className="btn-create-lg" onClick={handleCreateGroup} disabled={loading}>
            {loading ? "Creating..." : "🚀 Create Group"}
          </button>
        </div>

      </div>
    </>
  );
}