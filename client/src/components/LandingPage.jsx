import { useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [activeFeature, setActiveFeature] = useState(0);

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
          --r-sm: 16px;
          --r-md: 24px;
          --r-lg: 32px;
          --r-xl: 48px;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          padding: 80px 7% 80px;
          display: flex;
          align-items: center;
          gap: 64px;
          position: relative;
          overflow: hidden;
        }

        /* floating blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 { width:480px; height:480px; background:#FFE0CC; top:-160px; right:-80px; filter:blur(90px); opacity:.7; }
        .blob-2 { width:360px; height:360px; background:#C5F0E8; bottom:-100px; left:-80px; filter:blur(80px); opacity:.65; }
        .blob-3 { width:200px; height:200px; background:#E0DBFF; top:40%; left:42%; filter:blur(60px); opacity:.55; }

        /* decorative geometric shapes */
        .deco { position:absolute; pointer-events:none; z-index:0; }
        .deco-ring {
          width:120px; height:120px;
          border:14px solid #FFD4B3;
          border-radius:50%;
          top:12%; right:10%;
          animation: spin 18s linear infinite;
        }
        .deco-dot-grid {
          width:140px; height:140px;
          top:62%; right:7%;
          background-image: radial-gradient(circle, #C5A8FF 1.5px, transparent 1.5px);
          background-size: 18px 18px;
          opacity:.5;
        }
        .deco-pill {
          width:60px; height:22px;
          background:#B3F5E6;
          border-radius:999px;
          bottom:18%; left:8%;
          opacity:.8;
        }
        .deco-sq {
          width:44px; height:44px;
          background:#FFE499;
          border-radius:10px;
          bottom:28%; left:5%;
          transform: rotate(20deg);
          opacity:.7;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadein {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .hero-left {
          flex: 1;
          position: relative;
          z-index: 2;
          max-width: 600px;
          animation: fadein .7s ease both;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1.5px solid #E8D8FF;
          border-radius: 999px;
          padding: 10px 20px 10px 12px;
          font-size: 13px;
          font-weight: 700;
          color: #5B3FBF;
          margin-bottom: 34px;
          box-shadow: 0 4px 20px rgba(124,111,205,.12);
        }

        .hero-badge-icon {
          width: 28px; height: 28px;
          background: linear-gradient(135deg,#9D7BFF,#6C63FF);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: 80px;
          line-height: 1.0;
          font-weight: 800;
          letter-spacing: -3px;
          color: var(--ink);
          margin-bottom: 28px;
        }

        .hero h1 em {
          font-style: normal;
          position: relative;
          display: inline-block;
        }

        .hero h1 em::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 0; right: 0;
          height: 12px;
          background: #FFE480;
          border-radius: 4px;
          z-index: -1;
          transform: rotate(-1deg);
        }

        .hero-sub {
          font-size: 18px;
          line-height: 1.8;
          color: var(--ink2);
          font-weight: 500;
          max-width: 520px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 44px;
          flex-wrap: wrap;
          align-items: center;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--ink);
          color: white;
          border: none;
          padding: 18px 36px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform .25s, box-shadow .25s;
          box-shadow: 0 8px 28px rgba(26,18,40,.22);
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(26,18,40,.28); }

        .btn-primary .arrow-box {
          width: 30px; height: 30px;
          background: rgba(255,255,255,.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--ink);
          border: 2px solid var(--border);
          padding: 16px 30px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .btn-ghost:hover { border-color: var(--purple); background: #F5F3FF; }

        .play-icon {
          width: 26px; height: 26px;
          background: var(--ink);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white;
          font-size: 10px;
          padding-left: 2px;
        }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 44px;
        }

        .avatar-stack {
          display: flex;
        }

        .avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 2.5px solid white;
          margin-left: -10px;
          overflow: hidden;
          background: linear-gradient(135deg, #FFB347, #FF6B6B);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-weight: 800;
          color: white;
        }

        .avatar:first-child { margin-left: 0; }
        .av2 { background: linear-gradient(135deg, #6C63FF, #00C9A7); }
        .av3 { background: linear-gradient(135deg, #FF6B6B, #E040FB); }
        .av4 { background: linear-gradient(135deg, #2ECC71, #FFB347); }

        .trust-text { font-size: 14px; font-weight: 600; color: var(--ink2); }
        .trust-text strong { color: var(--ink); }

        /* ── HERO RIGHT — CARD ── */
        .hero-right {
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 2;
          animation: fadein .9s .2s ease both;
        }

        .hero-card-wrap {
          animation: float 6s ease-in-out infinite;
          width: 100%;
          max-width: 440px;
        }

        .expense-card {
          background: white;
          border-radius: var(--r-xl);
          padding: 32px;
          border: 1.5px solid rgba(0,0,0,.06);
          box-shadow: 0 32px 80px rgba(26,18,40,.12), 0 2px 8px rgba(0,0,0,.04);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 26px;
        }

        .card-title-row h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 4px;
        }

        .card-title-row p { font-size: 13px; color: var(--ink3); font-weight: 500; }

        .status-chip {
          background: #E8FBF4;
          color: #006B50;
          border: 1.5px solid #A3EDD0;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .exp-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          border-radius: 18px;
          margin-bottom: 12px;
          transition: transform .2s;
        }
        .exp-row:hover { transform: translateX(4px); }

        .exp-row.purple { background:#F0EEFF; }
        .exp-row.orange { background:#FFF4E6; }

        .exp-label { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
        .exp-sub   { font-size: 12px; color: var(--ink3); font-weight: 500; }

        .exp-amount { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--ink); text-align:right; margin-bottom:4px; }
        .tag-settled { font-size: 11px; font-weight: 700; color: #006B50; background:#D4F7EA; padding:3px 10px; border-radius:999px; display:inline-block; }
        .tag-pending { font-size: 11px; font-weight: 700; color: #A34800; background:#FFE8CC; padding:3px 10px; border-radius:999px; display:inline-block; }

        .ai-insight {
          background: linear-gradient(135deg,#F0EEFF,#E8F8FF);
          border: 1.5px solid #D4CCFF;
          border-radius: 20px;
          padding: 18px 20px;
          margin-top: 16px;
        }

        .ai-insight-head {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #3D2DBF;
          margin-bottom: 10px;
        }

        .ai-dot {
          width: 8px; height: 8px;
          background: #7C6FCD;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

        .ai-insight p { font-size: 13px; color: #3D2DBF; font-weight: 500; line-height: 1.7; }

        /* floating mini cards */
        .mini-card {
          position: absolute;
          background: white;
          border-radius: 18px;
          padding: 14px 18px;
          border: 1.5px solid rgba(0,0,0,.07);
          box-shadow: 0 12px 32px rgba(0,0,0,.1);
          z-index: 3;
          white-space: nowrap;
        }

        .mini-card-1 {
          top: -18px; left: -30px;
          animation: float 5s 1s ease-in-out infinite;
        }

        .mini-card-2 {
          bottom: 30px; right: -24px;
          animation: float 7s 2s ease-in-out infinite;
        }

        .mini-label { font-size: 11px; font-weight: 700; color: var(--ink3); margin-bottom: 4px; }
        .mini-value { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--ink); }
        .mini-sub   { font-size: 11px; color: #00C896; font-weight: 700; margin-top: 2px; }

        /* ── STATS STRIP ── */
        .stats-strip {
          background: var(--ink);
          margin: 0 7%;
          border-radius: var(--r-lg);
          padding: 44px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .stat-item { text-align: center; flex: 1; min-width: 120px; }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 46px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .stat-num.c1 { color: #FFB347; }
        .stat-num.c2 { color: #00C9A7; }
        .stat-num.c3 { color: #9D7BFF; }

        .stat-desc { font-size: 14px; color: rgba(255,255,255,.55); font-weight: 500; }

        .stat-divider {
          width: 1px;
          height: 60px;
          background: rgba(255,255,255,.12);
        }

        /* ── FEATURES ── */
        .features {
          padding: 110px 7%;
          position: relative;
          overflow: hidden;
        }

        .sec-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--purple);
          background: #F0EEFF;
          border: 1.5px solid #D4CCFF;
          padding: 8px 18px;
          border-radius: 999px;
          margin-bottom: 20px;
        }

        .sec-title {
          font-family: 'Syne', sans-serif;
          font-size: 54px;
          font-weight: 800;
          letter-spacing: -2px;
          color: var(--ink);
          line-height: 1.1;
          margin-bottom: 14px;
        }

        .sec-title span { color: var(--coral); }

        .sec-sub {
          font-size: 17px;
          color: var(--ink2);
          font-weight: 500;
          max-width: 480px;
          line-height: 1.75;
        }

        .features-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
          margin-top: 64px;
        }

        .features-list { display: flex; flex-direction: column; gap: 12px; }

        .feat-row {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 24px 26px;
          border-radius: 24px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all .25s;
          background: white;
        }

        .feat-row.active {
          border-color: rgba(0,0,0,.08);
          box-shadow: 0 8px 32px rgba(0,0,0,.08);
        }

        .feat-row:not(.active):hover {
          background: white;
          border-color: rgba(0,0,0,.05);
        }

        .feat-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
        }

        .feat-text h4 {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          margin-bottom: 6px;
          color: var(--ink);
        }

        .feat-text p { font-size: 14px; color: var(--ink2); line-height: 1.7; font-weight: 500; }

        .features-preview {
          position: sticky;
          top: 40px;
        }

        .feat-preview-card {
          border-radius: 36px;
          padding: 44px 40px;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: background .4s;
          position: relative;
          overflow: hidden;
        }

        .feat-preview-card::before {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,.4);
          bottom: -60px; right: -60px;
        }

        .feat-preview-card::after {
          content: '';
          position: absolute;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,.25);
          top: 20px; left: -30px;
        }

        .feat-big-icon { font-size: 72px; margin-bottom: 28px; position: relative; z-index: 1; }

        .feat-preview-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 14px;
          position: relative; z-index: 1;
        }

        .feat-preview-desc {
          font-size: 16px;
          line-height: 1.8;
          font-weight: 500;
          opacity: .8;
          position: relative; z-index: 1;
        }

        .feat-preview-pill {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 28px;
          position: relative; z-index: 1;
        }

        /* ── TRIPS ── */
        .trips {
          padding: 100px 7%;
          background: white;
          position: relative;
          overflow: hidden;
        }

        .trips::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: #FFF0FA;
          top: -160px; right: -120px;
          filter: blur(80px);
          opacity: .7;
        }

        .trips-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .see-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 2px solid var(--border);
          padding: 12px 24px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .2s, background .2s;
        }
        .see-all-btn:hover { border-color: var(--purple); background: #F5F3FF; }

        .trip-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .trip-card {
          background: var(--cream);
          border-radius: 32px;
          overflow: hidden;
          border: 1.5px solid rgba(0,0,0,.06);
          transition: transform .3s, box-shadow .3s;
        }
        .trip-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(0,0,0,.1); }

        .trip-img-wrap { position: relative; overflow: hidden; }

        .trip-img-wrap img {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
          transition: transform .4s;
        }

        .trip-card:hover .trip-img-wrap img { transform: scale(1.06); }

        .trip-tag {
          position: absolute;
          top: 16px; left: 16px;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          border: 1.5px solid rgba(0,0,0,.06);
        }

        .trip-body { padding: 24px; }

        .trip-body h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 14px;
        }

        .trip-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .meta-chip {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          background: white;
          border: 1.5px solid rgba(0,0,0,.07);
          color: var(--ink2);
        }

        .meta-chip.amount { background: var(--ink); color: white; border-color: var(--ink); }

        .trip-open-btn {
          width: 100%;
          border: none;
          padding: 14px;
          border-radius: 18px;
          background: var(--ink);
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity .2s, transform .2s;
        }
        .trip-open-btn:hover { opacity: .86; transform: translateY(-2px); }

        /* ── HOW IT WORKS ── */
        .how {
          padding: 100px 7%;
          background: var(--ink);
          border-radius: 0;
          position: relative;
          overflow: hidden;
        }

        .how::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: #6C63FF;
          border-radius: 50%;
          top: -150px; right: -100px;
          filter: blur(100px);
          opacity: .25;
        }

        .how::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: #00C9A7;
          border-radius: 50%;
          bottom: -100px; left: -80px;
          filter: blur(80px);
          opacity: .2;
        }

        .how .sec-eyebrow { background: rgba(255,255,255,.08); color: #A89FFF; border-color: rgba(255,255,255,.15); }
        .how .sec-title { color: white; }
        .how .sec-sub { color: rgba(255,255,255,.55); }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 20px;
          margin-top: 64px;
          position: relative;
          z-index: 1;
        }

        .step-card {
          background: rgba(255,255,255,.06);
          border: 1.5px solid rgba(255,255,255,.1);
          border-radius: 28px;
          padding: 32px 26px;
          position: relative;
          transition: background .2s;
        }
        .step-card:hover { background: rgba(255,255,255,.1); }

        .step-num {
          font-family: 'Syne', sans-serif;
          font-size: 48px;
          font-weight: 800;
          opacity: .12;
          color: white;
          position: absolute;
          top: 16px; right: 22px;
          line-height: 1;
        }

        .step-icon {
          font-size: 36px;
          margin-bottom: 20px;
          display: block;
        }

        .step-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
        }

        .step-card p { font-size: 14px; color: rgba(255,255,255,.55); line-height: 1.7; font-weight: 500; }

        .step-connector {
          position: absolute;
          top: 50%;
          right: -14px;
          transform: translateY(-50%);
          color: rgba(255,255,255,.25);
          font-size: 22px;
          z-index: 2;
        }

        /* ── CTA ── */
        .cta {
          margin: 80px 7%;
          padding: 96px 64px;
          border-radius: var(--r-xl);
          background: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 35%, #C45CFF 70%, #7C6FCD 100%);
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta-ring-1 {
          position: absolute;
          width: 360px; height: 360px;
          border: 48px solid rgba(255,255,255,.1);
          border-radius: 50%;
          top: -140px; right: -100px;
        }

        .cta-ring-2 {
          position: absolute;
          width: 240px; height: 240px;
          border: 32px solid rgba(255,255,255,.07);
          border-radius: 50%;
          bottom: -80px; left: -60px;
        }

        .cta-ring-3 {
          position: absolute;
          width: 160px; height: 160px;
          border: 24px solid rgba(255,255,255,.08);
          border-radius: 50%;
          bottom: 40px; right: 180px;
        }

        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,.2);
          border: 1.5px solid rgba(255,255,255,.3);
          border-radius: 999px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 700;
          color: white;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .cta h2 {
          font-family: 'Syne', sans-serif;
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -2.5px;
          line-height: 1.08;
          margin-bottom: 22px;
          position: relative;
          z-index: 1;
        }

        .cta p {
          font-size: 18px;
          opacity: .88;
          margin-bottom: 48px;
          font-weight: 500;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .cta-btn-white {
          background: white;
          color: #6C63FF;
          border: none;
          padding: 19px 44px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 12px 32px rgba(0,0,0,.15);
          transition: transform .25s, box-shadow .25s;
        }
        .cta-btn-white:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(0,0,0,.2); }

        .cta-btn-outline {
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,.45);
          padding: 17px 40px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .2s, background .2s;
        }
        .cta-btn-outline:hover { border-color: white; background: rgba(255,255,255,.12); }

        /* ── FOOTER ── */
        .footer {
          background: var(--ink);
          padding: 56px 7% 36px;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 48px;
          flex-wrap: wrap;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,.1);
          margin-bottom: 32px;
        }

        .footer-brand h2 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
        }

        .footer-brand p { font-size: 14px; color: rgba(255,255,255,.45); font-weight: 500; max-width: 240px; line-height: 1.7; }

        .footer-links h5 {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
          margin-bottom: 18px;
        }

        .footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }

        .footer-links a {
          text-decoration: none;
          font-size: 14px;
          color: rgba(255,255,255,.6);
          font-weight: 500;
          transition: color .2s;
        }

        .footer-links a:hover { color: white; }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-bottom p { font-size: 13px; color: rgba(255,255,255,.3); font-weight: 500; }

        .footer-chips { display: flex; gap: 10px; }

        .footer-chip {
          font-size: 11px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.45);
        }

        /* ── RESPONSIVE ── */
        @media(max-width:1100px) {
          .hero h1 { font-size: 62px; }
          .features-layout { grid-template-columns: 1fr; }
          .features-preview { position: static; }
          .steps-grid { grid-template-columns: repeat(2,1fr); }
          .trip-grid { grid-template-columns: repeat(2,1fr); }
        }

        @media(max-width:820px) {
          .hero { flex-direction: column; padding: 80px 6% 72px; text-align: center; }
          .hero h1 { font-size: 52px; }
          .hero-sub { margin: 0 auto; }
          .hero-actions { justify-content: center; }
          .hero-trust { justify-content: center; }
          .hero-card-wrap { max-width: 380px; }
          .sec-title { font-size: 40px; }
          .cta h2 { font-size: 44px; }
          .stats-strip { flex-direction: column; gap: 24px; padding: 36px 32px; }
          .stat-divider { display: none; }
          .trip-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr 1fr; }
          .trips-header { flex-direction: column; align-items: flex-start; }
        }

        @media(max-width:520px) {
          .hero h1 { font-size: 40px; letter-spacing: -1.5px; }
          .hero { padding: 72px 5% 60px; }
          .sec-title { font-size: 32px; }
          .cta { padding: 64px 28px; margin: 60px 5%; }
          .cta h2 { font-size: 34px; }
          .steps-grid { grid-template-columns: 1fr; }
          .mini-card { display: none; }
          .features, .trips, .how { padding: 72px 5%; }
          .stats-strip { margin: 0 5%; border-radius: 24px; }
        }
      `}</style>

      <div style={{width:'100%',overflow:'hidden'}}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="deco deco-ring" />
          <div className="deco deco-dot-grid" />
          <div className="deco deco-pill" />
          <div className="deco deco-sq" />

          <div className="hero-left">
            <div className="hero-badge">
              <div className="hero-badge-icon">✨</div>
              AI-Powered Expense Platform
            </div>

            <h1>
              Split <em>Smarter</em>,<br />
              Travel Better.
            </h1>

            <p className="hero-sub">
              Track group trips, scan receipts with AI, split
              expenses fairly and settle instantly with UPI — all in one beautiful app.
            </p>

            <div className="hero-actions">
              <Link href="/groups" >
              <button className="btn-primary">
                Start Free Trip
                <div className="arrow-box">→</div>
              </button>
              </Link>
              <button className="btn-ghost">
                <div className="play-icon">▶</div>
                Watch Demo
              </button>
            </div>

            <div className="hero-trust">
              <div className="avatar-stack">
                <div className="avatar">R</div>
                <div className="avatar av2">P</div>
                <div className="avatar av3">S</div>
                <div className="avatar av4">A</div>
              </div>
              <p className="trust-text"><strong>10,000+</strong> trips managed this month</p>
            </div>
          </div>

          <div className="hero-right">
            <div style={{position:'relative',width:'100%',maxWidth:'440px'}}>

              <div className="mini-card mini-card-1">
                <div className="mini-label">Total Saved</div>
                <div className="mini-value">₹8,400</div>
                <div className="mini-sub">↑ 24% vs last trip</div>
              </div>

              <div className="mini-card mini-card-2">
                <div className="mini-label">Settlement Rate</div>
                <div className="mini-value">99%</div>
                <div className="mini-sub">✓ All settled in 2 hrs</div>
              </div>

              <div className="hero-card-wrap">
                <div className="expense-card">
                  <div className="card-header">
                    <div className="card-title-row">
                      <h3>🏖️ Goa Beach Trip</h3>
                      <p>6 Friends · 5 Days</p>
                    </div>
                    <div className="status-chip">✅ On Budget</div>
                  </div>

                  <div className="exp-row purple">
                    <div>
                      <div className="exp-label">🍽️ Beach Dinner</div>
                      <div className="exp-sub">AI split by consumed items</div>
                    </div>
                    <div>
                      <div className="exp-amount">₹4,200</div>
                      <span className="tag-settled">Settled</span>
                    </div>
                  </div>

                  <div className="exp-row orange">
                    <div>
                      <div className="exp-label">🛵 Scooter Rental</div>
                      <div className="exp-sub">Shared among 3 members</div>
                    </div>
                    <div>
                      <div className="exp-amount">₹2,800</div>
                      <span className="tag-pending">Pending</span>
                    </div>
                  </div>

                  <div className="ai-insight">
                    <div className="ai-insight-head">
                      <div className="ai-dot" />
                      🧠 AI Insight
                    </div>
                    <p>Food expenses 18% above average. Consider reducing café visits tomorrow to stay within budget.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-num c1">10K+</div>
            <div className="stat-desc">Trips Managed</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num c2">₹1.2Cr</div>
            <div className="stat-desc">Expenses Tracked</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num c3">99%</div>
            <div className="stat-desc">Faster Settlements</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num" style={{color:'#FF6B6B'}}>4.9★</div>
            <div className="stat-desc">Average Rating</div>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="features">
          <div className="sec-eyebrow">⚡ Why Choose Us</div>
          <h2 className="sec-title">More Than <span>Splitwise</span></h2>
          <p className="sec-sub">Everything your group needs — from AI receipt scanning to instant UPI settlement.</p>

          <div className="features-layout">
            <div className="features-list">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`feat-row${activeFeature === i ? ' active' : ''}`}
                  onClick={() => setActiveFeature(i)}
                  style={activeFeature === i ? {background: f.bg, borderColor: 'rgba(0,0,0,.08)'} : {}}
                >
                  <div className="feat-icon-wrap" style={{background: f.pill}}>
                    {f.icon}
                  </div>
                  <div className="feat-text">
                    <h4>{f.title}</h4>
                    {activeFeature === i && <p>{f.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="features-preview">
              <div
                className="feat-preview-card"
                style={{background: features[activeFeature].bg, color: features[activeFeature].pillText}}
              >
                <div
                  className="feat-preview-pill"
                  style={{background: features[activeFeature].pill, color: features[activeFeature].pillText}}
                >
                  #{activeFeature + 1} Feature
                </div>
                <div className="feat-big-icon">{features[activeFeature].icon}</div>
                <div className="feat-preview-title">{features[activeFeature].title}</div>
                <div className="feat-preview-desc">{features[activeFeature].desc}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRIPS ── */}
        <section className="trips">
          <div className="trips-header">
            <div>
              <div className="sec-eyebrow">🗺️ Popular Trips</div>
              <h2 className="sec-title">Shared<br /><span style={{color:'#00C9A7'}}>Adventures</span></h2>
            </div>
            <button className="see-all-btn">See All Trips →</button>
          </div>

          <div className="trip-grid">
            {trips.map((trip, i) => (
              <div className="trip-card" key={i}>
                <div className="trip-img-wrap">
                  <img src={trip.image} alt={trip.name} />
                  <div
                    className="trip-tag"
                    style={{background: trip.tagBg, color: trip.tagColor}}
                  >
                    {trip.tag}
                  </div>
                </div>
                <div className="trip-body">
                  <h3>{trip.name}</h3>
                  <div className="trip-meta">
                    <span className="meta-chip">👥 {trip.members} Members</span>
                    <span className="meta-chip">📅 {trip.days} Days</span>
                    <span className="meta-chip amount">💰 {trip.amount}</span>
                  </div>
                  <button className="trip-open-btn">
                    Open Trip →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how">
          <div className="sec-eyebrow">🚀 How It Works</div>
          <h2 className="sec-title">Up & Running in<br /><span style={{color:'#FFB347'}}>4 Simple Steps</span></h2>
          <p className="sec-sub">From creating a trip to settling debts — the whole flow takes under 2 minutes.</p>

          <div className="steps-grid">
            {[
              { icon:'🧳', num:'01', title:'Create a Trip', desc:'Name your trip, set a budget and invite friends via link or phone number — no sign-up required for guests.' },
              { icon:'🧾', num:'02', title:'Add Expenses', desc:'Scan a receipt with AI, enter manually, or let bank SMS auto-import transactions directly.' },
              { icon:'🧠', num:'03', title:'AI Splits Fairly', desc:'Our model analyses who ordered what, consumption patterns and shared vs individual costs.' },
              { icon:'💸', num:'04', title:'Settle via UPI', desc:'One tap generates personalised UPI payment links for each member. Debts vanish in seconds.' },
            ].map((step, i) => (
              <div className="step-card" key={i} style={{position:'relative'}}>
                <div className="step-num">{step.num}</div>
                <span className="step-icon">{step.icon}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta">
          <div className="cta-ring-1" />
          <div className="cta-ring-2" />
          <div className="cta-ring-3" />

          <div className="cta-badge">🎉 Free forever for groups up to 10</div>

          <h2>
            Make Every Trip<br />Stress-Free.
          </h2>

          <p>Join thousands of friend groups, flatmates and travel crews who split smarter with AI.</p>

          <div className="cta-buttons">
            <button className="cta-btn-white">🚀 Create Your First Trip</button>
            <button className="cta-btn-outline">Explore Features →</button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-brand">
              <h2>✈️ SplitTrip</h2>
              <p>AI-powered expense splitting for modern travelers and friend groups.</p>
            </div>

            <div className="footer-links">
              <h5>Product</h5>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">API Docs</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h5>Company</h5>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h5>Support</h5>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 SplitTrip. Made with ❤️ for travellers everywhere.</p>
            <div className="footer-chips">
              <span className="footer-chip">Privacy</span>
              <span className="footer-chip">Terms</span>
              <span className="footer-chip">Cookies</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;