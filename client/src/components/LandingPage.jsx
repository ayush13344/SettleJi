import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Receipt Scanner",
      desc: "Point your camera at any receipt. Our AI reads, parses, and splits every line item by who actually ordered it — zero manual input.",
      icon: "🤖",
      bg: "#FFF4E6",
      accent: "#FF8C42",
      pill: "#FFD4B3",
      pillText: "#A34800",
    },
    {
      title: "Smart Fairness Split",
      desc: "Not everyone eats the same. AI weighs individual consumption, dietary choices, and spending patterns for truly fair splits.",
      icon: "🧠",
      bg: "#E8FBF4",
      accent: "#00C896",
      pill: "#B3F0DC",
      pillText: "#006B50",
    },
    {
      title: "Real-Time Sync",
      desc: "Every tap, every payment — your whole crew sees balances update live. No refreshing, no chasing, no confusion.",
      icon: "⚡",
      bg: "#EEF0FF",
      accent: "#6C63FF",
      pill: "#CCCBFF",
      pillText: "#2D1FA3",
    },
    {
      title: "Trip Memories",
      desc: "Attach photos, voice notes and location pins to expenses. Your trip story lives alongside every rupee spent.",
      icon: "📸",
      bg: "#FFF0FA",
      accent: "#E040FB",
      pill: "#F5BBFF",
      pillText: "#7B0098",
    },
    {
      title: "UPI Payments",
      desc: "Generate QR codes, send UPI links, or pay directly inside the app. Settlement happens in seconds, not days.",
      icon: "💸",
      bg: "#EEFBF0",
      accent: "#2ECC71",
      pill: "#B8F5CC",
      pillText: "#0A6B30",
    },
    {
      title: "Budget Prediction",
      desc: "Spot overspending before it happens. AI tracks your burn rate, flags anomalies and forecasts your remaining budget.",
      icon: "📊",
      bg: "#FFFBEA",
      accent: "#F59E0B",
      pill: "#FFE79A",
      pillText: "#7A4900",
    },
  ];

  const trips = [
    {
      name: "Goa Beach Trip",
      amount: "₹42,300",
      members: 6,
      days: 5,
      tag: "🏖️ Beach",
      tagBg: "#FFF4E6",
      tagColor: "#A34800",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Manali Ride",
      amount: "₹18,900",
      members: 4,
      days: 7,
      tag: "🏔️ Mountains",
      tagBg: "#EEF0FF",
      tagColor: "#2D1FA3",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "College Flat",
      amount: "₹9,400",
      members: 5,
      days: 30,
      tag: "🏠 Living",
      tagBg: "#E8FBF4",
      tagColor: "#006B50",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const af = features[activeFeature];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

        :root {
          --cream: #FEFAF4;
          --ink: #1A1228;
          --ink2: #4B4460;
          --ink3: #9188A8;
          --coral: #FF6B6B;
          --teal: #00C9A7;
          --amber: #FFB347;
          --purple: #7C6FCD;
          --white: #FFFFFF;
          --border: rgba(26,18,40,0.08);
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          overflow-x: hidden;
        }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes fadein  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

        .syne { font-family: 'Syne', sans-serif; }

        /* blobs */
        .blob { position:absolute; border-radius:50%; pointer-events:none; z-index:0; }
        .blob-1 { width:480px;height:480px;background:#FFE0CC;top:-160px;right:-80px;filter:blur(90px);opacity:.7; }
        .blob-2 { width:360px;height:360px;background:#C5F0E8;bottom:-100px;left:-80px;filter:blur(80px);opacity:.65; }
        .blob-3 { width:200px;height:200px;background:#E0DBFF;top:40%;left:42%;filter:blur(60px);opacity:.55; }

        /* deco */
        .deco { position:absolute; pointer-events:none; z-index:0; }
        .deco-ring { width:120px;height:120px;border:14px solid #FFD4B3;border-radius:50%;top:12%;right:10%;animation:spin 18s linear infinite; }
        .deco-dot-grid { width:140px;height:140px;top:62%;right:7%;background-image:radial-gradient(circle,#C5A8FF 1.5px,transparent 1.5px);background-size:18px 18px;opacity:.5; }
        .deco-pill { width:60px;height:22px;background:#B3F5E6;border-radius:999px;bottom:18%;left:8%;opacity:.8; }
        .deco-sq { width:44px;height:44px;background:#FFE499;border-radius:10px;bottom:28%;left:5%;transform:rotate(20deg);opacity:.7; }

        /* hero card float */
        .hero-float { animation: float 6s ease-in-out infinite; }
        .mini-float-1 { animation: float 5s 1s ease-in-out infinite; }
        .mini-float-2 { animation: float 7s 2s ease-in-out infinite; }
        .fadein-1 { animation: fadein .7s ease both; }
        .fadein-2 { animation: fadein .9s .2s ease both; }

        /* exp rows */
        .exp-row-hover:hover { transform: translateX(4px); }

        /* feat row */
        .feat-row-hover:not(.feat-active):hover { background:white; border-color:rgba(0,0,0,.05); }

        /* step card */
        .step-hover:hover { background: rgba(255,255,255,.1); }

        /* trip card */
        .trip-hover:hover { transform:translateY(-8px); box-shadow:0 24px 56px rgba(0,0,0,.1); }
        .trip-hover:hover img { transform:scale(1.06); }

        /* ai pulse */
        .ai-dot { width:8px;height:8px;background:#7C6FCD;border-radius:50%;animation:pulse 2s infinite; }
      `}</style>

      <div className="w-full overflow-x-hidden">

        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center gap-16 px-[7%] py-20 overflow-hidden flex-col lg:flex-row">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="deco deco-ring" />
          <div className="deco deco-dot-grid hidden lg:block" />
          <div className="deco deco-pill hidden md:block" />
          <div className="deco deco-sq hidden md:block" />

          {/* LEFT */}
          <div className="relative z-10 flex-1 max-w-[600px] fadein-1 text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2.5 bg-white border border-[#E8D8FF] rounded-full px-5 py-2.5 text-[13px] font-bold text-[#5B3FBF] mb-8 shadow-[0_4px_20px_rgba(124,111,205,.12)]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9D7BFF] to-[#6C63FF] flex items-center justify-center text-sm">✨</div>
              AI-Powered Expense Platform
            </div>

            <h1 className="syne text-5xl sm:text-[62px] lg:text-[80px] leading-[1.0] font-extrabold tracking-[-3px] text-[#1A1228] mb-7">
              Split{" "}
              <em className="not-italic relative inline-block">
                Smarter
                <span className="absolute bottom-1.5 left-0 right-0 h-3 bg-[#FFE480] rounded z-[-1] rotate-[-1deg]" />
              </em>
              ,<br />
              Travel Better.
            </h1>

            <p className="text-[17px] sm:text-lg leading-[1.8] text-[#4B4460] font-medium max-w-[520px] mx-auto lg:mx-0">
              Track group trips, scan receipts with AI, split expenses fairly and settle instantly with UPI — all in one beautiful app.
            </p>

            <div className="flex gap-4 mt-11 flex-wrap items-center justify-center lg:justify-start">
              {/* ✅ GET STARTED → navigates to /groups */}
              <button
                onClick={() => navigate("/groups")}
                className="inline-flex items-center gap-2.5 bg-[#1A1228] text-white border-none px-9 py-[18px] rounded-full text-[15px] font-bold cursor-pointer transition-all duration-250 shadow-[0_8px_28px_rgba(26,18,40,.22)] hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(26,18,40,.28)]"
              >
                Start Free Trip
                <span className="w-[30px] h-[30px] bg-white/20 rounded-full flex items-center justify-center text-base">→</span>
              </button>

              <button className="inline-flex items-center gap-2 bg-transparent text-[#1A1228] border-2 border-[rgba(26,18,40,0.08)] px-[30px] py-4 rounded-full text-[15px] font-bold cursor-pointer transition-all duration-200 hover:border-[#7C6FCD] hover:bg-[#F5F3FF]">
                <span className="w-[26px] h-[26px] bg-[#1A1228] rounded-full flex items-center justify-center text-white text-[10px] pl-[2px]">▶</span>
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-3.5 mt-11 justify-center lg:justify-start">
              <div className="flex">
                {["R","P","S","A"].map((l,i) => (
                  <div key={i} className={`w-[38px] h-[38px] rounded-full border-[2.5px] border-white -ml-2.5 first:ml-0 flex items-center justify-center text-[13px] font-extrabold text-white ${["bg-gradient-to-br from-[#FFB347] to-[#FF6B6B]","bg-gradient-to-br from-[#6C63FF] to-[#00C9A7]","bg-gradient-to-br from-[#FF6B6B] to-[#E040FB]","bg-gradient-to-br from-[#2ECC71] to-[#FFB347]"][i]}`}>{l}</div>
                ))}
              </div>
              <p className="text-sm font-semibold text-[#4B4460]"><strong className="text-[#1A1228]">10,000+</strong> trips managed this month</p>
            </div>
          </div>

          {/* RIGHT — card */}
          <div className="relative z-10 flex-1 flex justify-center fadein-2 w-full lg:w-auto">
            <div className="relative w-full max-w-[440px] mx-auto">

              {/* mini card top-left */}
              <div className="mini-float-1 absolute -top-[18px] -left-[30px] bg-white rounded-[18px] px-[18px] py-3.5 border border-[rgba(0,0,0,.07)] shadow-[0_12px_32px_rgba(0,0,0,.1)] z-30 whitespace-nowrap hidden sm:block">
                <div className="text-[11px] font-bold text-[#9188A8] mb-1">Total Saved</div>
                <div className="syne text-lg font-extrabold text-[#1A1228]">₹8,400</div>
                <div className="text-[11px] font-bold text-[#00C896] mt-0.5">↑ 24% vs last trip</div>
              </div>

              {/* mini card bottom-right */}
              <div className="mini-float-2 absolute bottom-[30px] -right-[24px] bg-white rounded-[18px] px-[18px] py-3.5 border border-[rgba(0,0,0,.07)] shadow-[0_12px_32px_rgba(0,0,0,.1)] z-30 whitespace-nowrap hidden sm:block">
                <div className="text-[11px] font-bold text-[#9188A8] mb-1">Settlement Rate</div>
                <div className="syne text-lg font-extrabold text-[#1A1228]">99%</div>
                <div className="text-[11px] font-bold text-[#00C896] mt-0.5">✓ All settled in 2 hrs</div>
              </div>

              {/* main expense card */}
              <div className="hero-float bg-white rounded-[48px] p-8 border border-[rgba(0,0,0,.06)] shadow-[0_32px_80px_rgba(26,18,40,.12),0_2px_8px_rgba(0,0,0,.04)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="syne text-xl font-extrabold text-[#1A1228] mb-1">🏖️ Goa Beach Trip</h3>
                    <p className="text-[13px] text-[#9188A8] font-medium">6 Friends · 5 Days</p>
                  </div>
                  <div className="bg-[#E8FBF4] text-[#006B50] border border-[#A3EDD0] px-3.5 py-[7px] rounded-full text-xs font-bold whitespace-nowrap">✅ On Budget</div>
                </div>

                <div className="flex justify-between items-center px-[18px] py-4 rounded-[18px] mb-3 bg-[#F0EEFF] transition-transform duration-200 exp-row-hover">
                  <div>
                    <div className="text-sm font-bold text-[#1A1228] mb-1">🍽️ Beach Dinner</div>
                    <div className="text-xs text-[#9188A8] font-medium">AI split by consumed items</div>
                  </div>
                  <div className="text-right">
                    <div className="syne text-lg font-extrabold text-[#1A1228] mb-1">₹4,200</div>
                    <span className="text-[11px] font-bold text-[#006B50] bg-[#D4F7EA] px-2.5 py-0.5 rounded-full">Settled</span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-[18px] py-4 rounded-[18px] mb-4 bg-[#FFF4E6] transition-transform duration-200 exp-row-hover">
                  <div>
                    <div className="text-sm font-bold text-[#1A1228] mb-1">🛵 Scooter Rental</div>
                    <div className="text-xs text-[#9188A8] font-medium">Shared among 3 members</div>
                  </div>
                  <div className="text-right">
                    <div className="syne text-lg font-extrabold text-[#1A1228] mb-1">₹2,800</div>
                    <span className="text-[11px] font-bold text-[#A34800] bg-[#FFE8CC] px-2.5 py-0.5 rounded-full">Pending</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#F0EEFF] to-[#E8F8FF] border border-[#D4CCFF] rounded-[20px] p-[18px]">
                  <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#3D2DBF] mb-2.5">
                    <div className="ai-dot" />
                    🧠 AI Insight
                  </div>
                  <p className="text-[13px] text-[#3D2DBF] font-medium leading-[1.7]">Food expenses 18% above average. Consider reducing café visits tomorrow to stay within budget.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            STATS STRIP
        ═══════════════════════════════════════ */}
        <div className="mx-[5%] sm:mx-[7%] bg-[#1A1228] rounded-[32px] px-8 sm:px-12 py-11 flex justify-between items-center gap-8 flex-wrap">
          {[
            { num:"10K+", color:"#FFB347", desc:"Trips Managed" },
            { num:"₹1.2Cr", color:"#00C9A7", desc:"Expenses Tracked" },
            { num:"99%", color:"#9D7BFF", desc:"Faster Settlements" },
            { num:"4.9★", color:"#FF6B6B", desc:"Average Rating" },
          ].map((s,i,arr) => (
            <>
              <div key={i} className="text-center flex-1 min-w-[120px]">
                <div className="syne text-[46px] font-extrabold mb-1.5" style={{color:s.color}}>{s.num}</div>
                <div className="text-sm text-white/55 font-medium">{s.desc}</div>
              </div>
              {i < arr.length-1 && <div key={`d${i}`} className="w-px h-[60px] bg-white/10 hidden sm:block" />}
            </>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════ */}
        <section className="px-[5%] sm:px-[7%] py-24 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[2px] uppercase text-[#7C6FCD] bg-[#F0EEFF] border border-[#D4CCFF] px-[18px] py-2 rounded-full mb-5">⚡ Why Choose Us</div>
          <h2 className="syne text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-[-2px] text-[#1A1228] leading-[1.1] mb-3.5">More Than <span className="text-[#FF6B6B]">Splitwise</span></h2>
          <p className="text-[17px] text-[#4B4460] font-medium max-w-[480px] leading-[1.75]">Everything your group needs — from AI receipt scanning to instant UPI settlement.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-16">
            {/* list */}
            <div className="flex flex-col gap-3">
              {features.map((f,i) => (
                <div
                  key={i}
                  className={`flex items-start gap-5 px-6 py-6 rounded-3xl border-[1.5px] cursor-pointer transition-all duration-250 feat-row-hover ${activeFeature===i ? "feat-active shadow-[0_8px_32px_rgba(0,0,0,.08)]" : "border-transparent"}`}
                  style={activeFeature===i ? {background:f.bg, borderColor:"rgba(0,0,0,.08)"} : {background:"white"}}
                  onClick={() => setActiveFeature(i)}
                >
                  <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[26px] flex-shrink-0" style={{background:f.pill}}>{f.icon}</div>
                  <div>
                    <h4 className="syne text-[17px] font-extrabold mb-1.5 text-[#1A1228]">{f.title}</h4>
                    {activeFeature===i && <p className="text-sm text-[#4B4460] leading-[1.7] font-medium">{f.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* preview */}
            <div className="lg:sticky lg:top-10">
              <div
                className="rounded-[36px] px-10 py-11 min-h-[380px] flex flex-col justify-center relative overflow-hidden transition-all duration-400"
                style={{background:af.bg, color:af.pillText}}
              >
                <div className="absolute w-[200px] h-[200px] rounded-full bg-white/40 -bottom-[60px] -right-[60px]" />
                <div className="absolute w-[120px] h-[120px] rounded-full bg-white/25 top-5 -left-[30px]" />
                <div className="inline-block px-5 py-2 rounded-full text-xs font-extrabold mb-7 relative z-10" style={{background:af.pill, color:af.pillText}}>#{activeFeature+1} Feature</div>
                <div className="text-7xl mb-7 relative z-10">{af.icon}</div>
                <div className="syne text-[28px] font-extrabold mb-3.5 relative z-10">{af.title}</div>
                <div className="text-base leading-[1.8] font-medium opacity-80 relative z-10">{af.desc}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            TRIPS
        ═══════════════════════════════════════ */}
        <section className="px-[5%] sm:px-[7%] py-24 bg-white relative overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#FFF0FA] -top-[160px] -right-[120px] blur-[80px] opacity-70 pointer-events-none" />

          <div className="flex justify-between items-end mb-14 flex-wrap gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[2px] uppercase text-[#7C6FCD] bg-[#F0EEFF] border border-[#D4CCFF] px-[18px] py-2 rounded-full mb-5">🗺️ Popular Trips</div>
              <h2 className="syne text-4xl sm:text-5xl font-extrabold tracking-[-2px] text-[#1A1228] leading-[1.1]">Shared<br /><span className="text-[#00C9A7]">Adventures</span></h2>
            </div>
            <button className="inline-flex items-center gap-2 border-2 border-[rgba(26,18,40,0.08)] px-6 py-3 rounded-full text-sm font-bold text-[#1A1228] bg-transparent cursor-pointer transition-all hover:border-[#7C6FCD] hover:bg-[#F5F3FF]">See All Trips →</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {trips.map((trip,i) => (
              <div key={i} className="bg-[#FEFAF4] rounded-[32px] overflow-hidden border border-[rgba(0,0,0,.06)] transition-all duration-300 trip-hover">
                <div className="relative overflow-hidden">
                  <img src={trip.image} alt={trip.name} className="w-full h-[210px] object-cover block transition-transform duration-400" />
                  <div className="absolute top-4 left-4 px-3.5 py-[7px] rounded-full text-xs font-extrabold border border-[rgba(0,0,0,.06)]" style={{background:trip.tagBg, color:trip.tagColor}}>{trip.tag}</div>
                </div>
                <div className="p-6">
                  <h3 className="syne text-xl font-extrabold text-[#1A1228] mb-3.5">{trip.name}</h3>
                  <div className="flex gap-2.5 mb-5 flex-wrap">
                    <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white border border-[rgba(0,0,0,.07)] text-[#4B4460]">👥 {trip.members} Members</span>
                    <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white border border-[rgba(0,0,0,.07)] text-[#4B4460]">📅 {trip.days} Days</span>
                    <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#1A1228] border border-[#1A1228] text-white">💰 {trip.amount}</span>
                  </div>
                  <button className="w-full border-none py-3.5 rounded-[18px] bg-[#1A1228] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2 transition-all hover:opacity-85 hover:-translate-y-0.5">Open Trip →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════ */}
        <section className="px-[5%] sm:px-[7%] py-24 bg-[#1A1228] relative overflow-hidden">
          <div className="absolute w-[400px] h-[400px] bg-[#6C63FF] rounded-full -top-[150px] -right-[100px] blur-[100px] opacity-25 pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] bg-[#00C9A7] rounded-full -bottom-[100px] -left-[80px] blur-[80px] opacity-20 pointer-events-none" />

          <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[2px] uppercase text-[#A89FFF] bg-white/[.08] border border-white/[.15] px-[18px] py-2 rounded-full mb-5">🚀 How It Works</div>
          <h2 className="syne text-4xl sm:text-5xl font-extrabold tracking-[-2px] text-white leading-[1.1] mb-3.5">Up & Running in<br /><span style={{color:"#FFB347"}}>4 Simple Steps</span></h2>
          <p className="text-[17px] text-white/55 font-medium max-w-[480px] leading-[1.75]">From creating a trip to settling debts — the whole flow takes under 2 minutes.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16 relative z-10">
            {[
              { icon:"🧳", num:"01", title:"Create a Trip", desc:"Name your trip, set a budget and invite friends via link or phone number — no sign-up required for guests." },
              { icon:"🧾", num:"02", title:"Add Expenses", desc:"Scan a receipt with AI, enter manually, or let bank SMS auto-import transactions directly." },
              { icon:"🧠", num:"03", title:"AI Splits Fairly", desc:"Our model analyses who ordered what, consumption patterns and shared vs individual costs." },
              { icon:"💸", num:"04", title:"Settle via UPI", desc:"One tap generates personalised UPI payment links for each member. Debts vanish in seconds." },
            ].map((step,i) => (
              <div key={i} className="relative bg-white/[.06] border border-white/10 rounded-[28px] p-8 transition-all step-hover">
                <div className="syne text-[48px] font-extrabold text-white/10 absolute top-4 right-5 leading-none">{step.num}</div>
                <span className="text-[36px] mb-5 block">{step.icon}</span>
                <h4 className="syne text-[17px] font-extrabold text-white mb-2.5">{step.title}</h4>
                <p className="text-sm text-white/55 leading-[1.7] font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CTA
        ═══════════════════════════════════════ */}
        <section className="mx-[5%] sm:mx-[7%] my-20 px-8 sm:px-16 py-24 rounded-[48px] bg-gradient-to-br from-[#FF8C42] via-[#FF6B6B] via-60% to-[#7C6FCD] text-center text-white relative overflow-hidden">
          <div className="absolute w-[360px] h-[360px] border-[48px] border-white/10 rounded-full -top-[140px] -right-[100px]" />
          <div className="absolute w-[240px] h-[240px] border-[32px] border-white/[.07] rounded-full -bottom-[80px] -left-[60px]" />
          <div className="absolute w-[160px] h-[160px] border-[24px] border-white/[.08] rounded-full bottom-10 right-[180px]" />

          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2.5 text-[13px] font-bold text-white mb-8 relative z-10">🎉 Free forever for groups up to 10</div>
          <h2 className="syne text-[34px] sm:text-[54px] lg:text-[64px] font-extrabold tracking-[-2.5px] leading-[1.08] mb-5 relative z-10">Make Every Trip<br />Stress-Free.</h2>
          <p className="text-lg opacity-90 max-w-[480px] mx-auto font-medium mb-12 relative z-10">Join thousands of friend groups, flatmates and travel crews who split smarter with AI.</p>
          <div className="flex gap-4 justify-center flex-wrap relative z-10">
            <button
              onClick={() => navigate("/groups")}
              className="bg-white text-[#6C63FF] border-none px-11 py-5 rounded-full text-base font-extrabold cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,.15)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,.2)]"
            >
              🚀 Create Your First Trip
            </button>
            <button className="bg-transparent text-white border-2 border-white/45 px-10 py-[17px] rounded-full text-base font-bold cursor-pointer transition-all hover:border-white hover:bg-white/12">Explore Features →</button>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════ */}
        <footer className="bg-[#1A1228] px-[5%] sm:px-[7%] pt-14 pb-9">
          <div className="flex justify-between items-start gap-12 flex-wrap pb-12 border-b border-white/10 mb-8">
            <div>
              <h2 className="syne text-[28px] font-extrabold text-white mb-2.5">✈️ SplitTrip</h2>
              <p className="text-sm text-white/45 font-medium max-w-[240px] leading-[1.7]">AI-powered expense splitting for modern travelers and friend groups.</p>
            </div>
            {[
              { title:"Product", links:["Features","Pricing","API Docs","Changelog"] },
              { title:"Company", links:["About","Blog","Careers","Press"] },
              { title:"Support", links:["Help Center","Community","Contact","Status"] },
            ].map((col,i) => (
              <div key={i}>
                <h5 className="text-xs font-extrabold tracking-[2px] uppercase text-white/35 mb-[18px]">{col.title}</h5>
                <ul className="flex flex-col gap-3 list-none">
                  {col.links.map((l,j) => <li key={j}><a href="#" className="text-sm text-white/60 font-medium no-underline transition-colors hover:text-white">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <p className="text-[13px] text-white/30 font-medium">© 2025 SplitTrip. Made with ❤️ for travellers everywhere.</p>
            <div className="flex gap-2.5">
              {["Privacy","Terms","Cookies"].map(c => (
                <span key={c} className="text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/12 text-white/45">{c}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;