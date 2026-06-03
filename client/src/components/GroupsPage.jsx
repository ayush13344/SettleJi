import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL     = "https://settleji.onrender.com/api";
const GROUPS_URL   = `${BASE_URL}/groups`;
const EXPENSES_URL = `${BASE_URL}/expenses`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:    #FDFAF5;
    --cream2:   #F5EFE6;
    --ink:      #1C1917;
    --ink2:     #57534E;
    --ink3:     #A8A29E;
    --coral:    #F26B5B;
    --coral-bg: #FEF0EE;
    --coral-bd: #FBCDC8;
    --teal:     #0D9488;
    --teal-bg:  #F0FDFA;
    --teal-bd:  #99F6E4;
    --amber:    #D97706;
    --amber-bg: #FFFBEB;
    --amber-bd: #FDE68A;
    --purple:   #7C3AED;
    --purple-bg:#F5F3FF;
    --purple-bd:#DDD6FE;
    --white:    #FFFFFF;
    --border:   rgba(28,25,23,0.08);
    --shadow-sm: 0 2px 8px rgba(28,25,23,0.06);
    --shadow-md: 0 8px 28px rgba(28,25,23,0.09);
    --shadow-lg: 0 24px 56px rgba(28,25,23,0.13);
    --r-sm: 12px; --r-md: 18px; --r-lg: 24px; --r-xl: 28px;
  }

  body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--ink); }

  .dashboard {
    min-height:100vh; padding:36px 40px 80px;
    background:var(--cream); position:relative;
  }
  .dashboard::before {
    content:''; position:fixed; top:-120px; right:-120px;
    width:420px; height:420px;
    background:radial-gradient(circle,#FBCDC8 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.5;
  }
  .dashboard::after {
    content:''; position:fixed; bottom:-80px; left:-80px;
    width:320px; height:320px;
    background:radial-gradient(circle,#99F6E4 0%,transparent 68%);
    border-radius:50%; pointer-events:none; z-index:0; opacity:.35;
  }

  /* HEADER */
  .header {
    display:flex; justify-content:space-between; align-items:center;
    margin-bottom:36px; gap:20px; flex-wrap:wrap;
    position:relative; z-index:1;
  }
  .header-title h1 {
    font-family:'Fraunces',serif; font-size:36px; font-weight:900;
    color:var(--ink); letter-spacing:-0.5px; line-height:1.1;
  }
  .header-title p { color:var(--ink3); margin-top:7px; font-size:15px; font-weight:500; }

  .btn-new-group {
    background:var(--ink); color:white; border:none; border-radius:999px;
    padding:15px 28px; font-family:'Outfit',sans-serif; font-weight:700;
    cursor:pointer; font-size:14px; display:flex; align-items:center; gap:8px;
    transition:transform .22s,box-shadow .22s,background .2s;
    box-shadow:0 6px 20px rgba(28,25,23,0.2); letter-spacing:.2px;
  }
  .btn-new-group:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(28,25,23,0.28); background:#2C2724; }

  /* STATS */
  .stats-grid {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:16px; margin-bottom:32px; position:relative; z-index:1;
  }
  .stat-card {
    background:var(--white); padding:22px 24px; border-radius:var(--r-lg);
    box-shadow:var(--shadow-sm); border:1.5px solid var(--border);
    position:relative; overflow:hidden; transition:transform .2s,box-shadow .2s;
  }
  .stat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
  .stat-card:nth-child(1) { border-top:4px solid var(--purple); }
  .stat-card:nth-child(2) { border-top:4px solid var(--coral); }
  .stat-card:nth-child(3) { border-top:4px solid var(--amber); }
  .stat-card:nth-child(4) { border-top:4px solid var(--teal); }
  .stat-title { font-size:11px; color:var(--ink3); margin-bottom:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; }
  .stat-value { font-family:'Fraunces',serif; font-size:34px; font-weight:900; color:var(--ink); line-height:1; }

  /* TOOLBAR */
  .toolbar { display:flex; gap:14px; margin-bottom:28px; flex-wrap:wrap; position:relative; z-index:1; }

  .search-box { flex:1; min-width:260px; position:relative; }
  .search-box::before {
    content:'🔍'; position:absolute; left:18px; top:50%;
    transform:translateY(-50%); font-size:15px; pointer-events:none;
  }
  .search-box input {
    width:100%; padding:14px 18px 14px 46px; border-radius:999px;
    border:1.5px solid var(--border); outline:none; font-size:14px;
    font-family:'Outfit',sans-serif; font-weight:500;
    background:var(--white); color:var(--ink);
    transition:border-color .15s,box-shadow .15s;
  }
  .search-box input:focus { border-color:var(--ink); box-shadow:0 0 0 3px rgba(28,25,23,0.06); }

  .select-box {
    padding:14px 20px; border-radius:999px; border:1.5px solid var(--border);
    outline:none; background:var(--white); min-width:170px;
    font-family:'Outfit',sans-serif; font-weight:700; font-size:14px; color:var(--ink); cursor:pointer;
  }

  .btn-refresh {
    padding:14px 20px; border-radius:999px; border:1.5px solid var(--border);
    background:var(--white); font-family:'Outfit',sans-serif; font-weight:700;
    font-size:13px; color:var(--ink2); cursor:pointer;
    display:flex; align-items:center; gap:6px;
    transition:background .15s,border-color .15s;
  }
  .btn-refresh:hover { background:var(--cream2); border-color:var(--ink3); }
  .btn-refresh:disabled { opacity:.5; cursor:not-allowed; }
  .spin { display:inline-block; animation:spinning .7s linear infinite; }
  @keyframes spinning { to { transform:rotate(360deg); } }

  /* CARDS */
  .cards-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; position:relative; z-index:1; }

  .group-card {
    background:var(--white); border-radius:var(--r-xl); overflow:hidden;
    box-shadow:0 2px 12px rgba(28,25,23,0.07); border:1.5px solid var(--border);
    transition:transform .28s cubic-bezier(.22,.68,0,1.2),box-shadow .28s;
    display:flex; flex-direction:column; position:relative;
  }
  .group-card:hover { transform:translateY(-8px); box-shadow:var(--shadow-lg); }

  .card-img { height:200px; overflow:hidden; position:relative; }
  .card-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
  .group-card:hover .card-img img { transform:scale(1.06); }
  .card-img::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(to bottom,transparent 30%,rgba(28,25,23,0.62) 100%);
    pointer-events:none;
  }

  .card-category-pill {
    position:absolute; top:14px; left:14px; z-index:3;
    padding:5px 12px; border-radius:999px; font-size:11px; font-weight:800;
    letter-spacing:.4px; background:rgba(255,255,255,0.92); color:var(--ink2);
    backdrop-filter:blur(6px);
  }
  .status-badge {
    position:absolute; top:14px; right:14px; padding:5px 12px; border-radius:999px;
    font-size:11px; font-weight:800; letter-spacing:.3px;
    background:rgba(13,148,136,0.15); color:var(--teal);
    border:1.5px solid rgba(13,148,136,0.25); backdrop-filter:blur(6px); z-index:3;
  }
  .card-img-title {
    position:absolute; bottom:14px; left:16px; right:16px; z-index:3;
    font-family:'Fraunces',serif; font-size:21px; font-weight:900;
    color:#fff; line-height:1.15; text-shadow:0 2px 8px rgba(0,0,0,0.35);
  }

  .card-body { padding:18px 20px 20px; display:flex; flex-direction:column; flex:1; gap:14px; }

  .group-desc { color:var(--ink3); font-size:13px; line-height:1.6; font-weight:500; }

  .members-wrapper { display:flex; align-items:center; }
  .member-avatar {
    width:32px; height:32px; border-radius:50%; display:flex; align-items:center;
    justify-content:center; font-size:11px; font-weight:800; color:white;
    border:2.5px solid white; margin-left:-8px;
    box-shadow:0 1px 4px rgba(0,0,0,0.12); transition:transform .15s;
  }
  .member-avatar:first-child { margin-left:0; }
  .members-wrapper:hover .member-avatar { transform:translateX(-2px); }
  .extra-members { background:var(--ink) !important; font-size:10px; }
  .members-count-label { margin-left:10px; font-size:12px; font-weight:600; color:var(--ink3); }

  .card-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
  .card-stat-box {
    background:var(--cream); border:1.5px solid var(--border);
    padding:12px 8px 10px; border-radius:16px; text-align:center;
    transition:background .15s;
  }
  .card-stat-box:first-child  { border-top:3px solid var(--purple); }
  .card-stat-box:nth-child(2) { border-top:3px solid var(--teal);   }
  .card-stat-box:last-child   { border-top:3px solid var(--coral);  }
  .group-card:hover .card-stat-box { background:#FAF9F7; }
  .card-stat-label { font-size:9px; color:var(--ink3); margin-bottom:5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; }
  .card-stat-value { font-family:'Fraunces',serif; font-size:18px; font-weight:900; color:var(--ink); line-height:1; }

  /* shimmer skeleton */
  .stat-skeleton {
    display:inline-block; width:52px; height:16px; border-radius:6px;
    background:linear-gradient(90deg,#e8e0d5 25%,#f5efe6 50%,#e8e0d5 75%);
    background-size:200% 100%; animation:shimmer 1.2s infinite; vertical-align:middle;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .progress-wrapper { display:flex; flex-direction:column; gap:7px; }
  .progress-top { display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:var(--ink3); }
  .progress-top span:last-child { color:var(--teal); font-weight:800; }
  .progress-bar { height:6px; background:var(--cream2); border-radius:999px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:999px; background:linear-gradient(90deg,var(--teal),#2DD4BF); transition:width .8s cubic-bezier(.22,.68,0,1.2); }

  .card-footer { display:flex; gap:10px; margin-top:auto; padding-top:2px; }
  .btn-view {
    flex:1; border:none; background:var(--ink); color:white;
    padding:13px 16px; border-radius:999px; font-family:'Outfit',sans-serif;
    font-weight:700; cursor:pointer; font-size:13px; letter-spacing:.2px;
    transition:background .18s,transform .18s,box-shadow .18s;
    box-shadow:0 4px 14px rgba(28,25,23,0.18);
  }
  .btn-view:hover { background:#2C2724; transform:translateY(-1px); box-shadow:0 7px 20px rgba(28,25,23,0.24); }
  .btn-delete {
    border:1.5px solid var(--coral-bd); background:var(--coral-bg); color:var(--coral);
    padding:13px 16px; border-radius:999px; font-family:'Outfit',sans-serif;
    font-weight:700; cursor:pointer; font-size:14px; transition:background .18s,transform .18s;
  }
  .btn-delete:hover { background:#FBCDC8; transform:translateY(-1px); }

  .loading { text-align:center; margin-top:100px; color:var(--ink3); font-size:16px; font-weight:600; }

  .empty-wrapper {
    background:var(--white); border-radius:var(--r-xl); padding:80px 40px;
    text-align:center; box-shadow:var(--shadow-sm); border:1.5px solid var(--border); margin-top:12px;
  }
  .empty-image { width:100px; margin-bottom:24px; }
  .empty-title { font-family:'Fraunces',serif; font-size:30px; font-weight:900; color:var(--ink); margin-bottom:12px; }
  .empty-text { color:var(--ink3); max-width:400px; margin:0 auto 32px; line-height:1.75; font-size:15px; font-weight:500; }
  .btn-create-first {
    background:var(--ink); color:white; border:none; padding:16px 32px;
    border-radius:999px; font-family:'Outfit',sans-serif; font-size:14px; font-weight:700;
    cursor:pointer; box-shadow:0 6px 20px rgba(28,25,23,0.2); transition:transform .2s,box-shadow .2s;
  }
  .btn-create-first:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(28,25,23,0.26); }

  @media(max-width:1100px) {
    .cards-grid { grid-template-columns:repeat(2,1fr); }
    .stats-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:700px) {
    .dashboard { padding:20px 18px 56px; }
    .cards-grid { grid-template-columns:1fr; }
    .stats-grid { grid-template-columns:repeat(2,1fr); }
    .header-title h1 { font-size:28px; }
  }
`;

const AVATAR_COLORS = ["#F26B5B","#7C3AED","#0D9488","#D97706","#DB2777","#2563EB"];

/* ─────────────────────────────────────────────
   Compute live stats for one group from its
   expenses:
     totalSpent = sum of all expense amounts
     settledAmt = sum where ALL participants settled
     pendingAmt = totalSpent - settledAmt
     progress%  = (settledAmt / totalSpent) * 100
───────────────────────────────────────────── */
function computeStats(expenses = []) {
  let totalSpent = 0;
  let settledAmt = 0;

  for (const exp of expenses) {
    const amt = Number(exp.amount) || 0;
    totalSpent += amt;

    const participants = exp.participants || [];
    let expSettled = false;
    if (participants.length > 0) {
      expSettled = participants.every(p => p.settled === true);
    } else {
      expSettled = exp.settled === true;
    }
    if (expSettled) settledAmt += amt;
  }

  const pendingAmt = totalSpent - settledAmt;
  const progress   = totalSpent > 0 ? Math.round((settledAmt / totalSpent) * 100) : 0;
  return { totalSpent, pendingAmt, settledAmt, progress };
}

/* ── GROUP CARD ── */
function GroupCard({ group, navigate, handleDeleteGroup, statsMap }) {
  const visibleMembers = group.members?.slice(0, 4) || [];
  const extraMembers   = (group.members?.length || 0) - 4;

  const live       = statsMap[group._id];
  const isLoading  = !live;
  const totalSpent = live ? live.totalSpent : (group.totalSpent   || 0);
  const pendingAmt = live ? live.pendingAmt : (group.pendingAmount || 0);
  const progress   = live ? live.progress   : (group.progress      || 0);

  return (
    <div className="group-card">
      <div className="card-img">
        <img
          src={group.coverImage || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=75"}
          alt={group.groupName}
        />
        {group.category && <span className="card-category-pill">{group.category}</span>}
        <span className="status-badge">● {group.status || "Active"}</span>
        <div className="card-img-title">{group.groupName}</div>
      </div>

      <div className="card-body">
        <p className="group-desc">{group.description || "No description added"}</p>

        <div className="members-wrapper">
          {visibleMembers.map((member, index) => (
            <div
              key={index}
              className="member-avatar"
              style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              title={member?.name || "Member"}
            >
              {member?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          ))}
          {extraMembers > 0 && <div className="member-avatar extra-members">+{extraMembers}</div>}
          <span className="members-count-label">
            {group.members?.length || 0} member{group.members?.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="card-stats">
          <div className="card-stat-box">
            <div className="card-stat-label">Total Spent</div>
            <div className="card-stat-value">
              {isLoading ? <span className="stat-skeleton"/> : `₹${totalSpent}`}
            </div>
          </div>
          <div className="card-stat-box">
            <div className="card-stat-label">Members</div>
            <div className="card-stat-value">{group.members?.length || 0}</div>
          </div>
          <div className="card-stat-box">
            <div className="card-stat-label">Pending</div>
            <div className="card-stat-value">
              {isLoading ? <span className="stat-skeleton"/> : `₹${pendingAmt}`}
            </div>
          </div>
        </div>

        <div className="progress-wrapper">
          <div className="progress-top">
            <span>Settlement Progress</span>
            <span>{isLoading ? "—" : `${progress}%`}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        <div className="card-footer">
          <button className="btn-view" onClick={() => {
            if (!group?._id) { alert("Group ID not found"); return; }
            navigate(`/trips/${group._id}`);
          }}>
            View Details →
          </button>
          <button className="btn-delete" onClick={() => handleDeleteGroup(group._id)}>🗑</button>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE ── */
export default function GroupsPage() {
  const navigate = useNavigate();

  const [groups,     setGroups]     = useState([]);
  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState("All");
  const [loading,    setLoading]    = useState(true);
  const [statsMap,   setStatsMap]   = useState({});   // groupId -> { totalSpent, pendingAmt, settledAmt, progress }
  const [refreshing, setRefreshing] = useState(false);

  /* fetch expenses for every group and populate statsMap */
  const fetchAllExpenses = useCallback(async (groupList) => {
    const token = localStorage.getItem("token");
    const results = await Promise.allSettled(
      groupList.map(g =>
        axios.get(`${EXPENSES_URL}?group=${g._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    const map = {};
    results.forEach((res, i) => {
      const gId = groupList[i]._id;
      if (res.status === "fulfilled") {
        const raw = res.value.data;
        // handle { expenses: [] } OR direct array
        const expenses = raw?.expenses || (Array.isArray(raw) ? raw : []);
        map[gId] = computeStats(expenses);
      } else {
        map[gId] = { totalSpent: 0, pendingAmt: 0, settledAmt: 0, progress: 0 };
      }
    });

    setStatsMap(map);
  }, []);

  /* fetch groups then their expenses */
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(GROUPS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetched = data.groups || [];
      setGroups(fetched);
      // fire expense fetches in background — no await so groups render immediately
      fetchAllExpenses(fetched);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, [fetchAllExpenses]);

  /* re-fetch on mount and when user navigates back to this tab */
  useEffect(() => {
    fetchGroups();
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchGroups();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchGroups]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  };

  const handleDeleteGroup = async (id) => {
    try {
      if (!window.confirm("Delete this group?")) return;
      const token = localStorage.getItem("token");
      await axios.delete(`${GROUPS_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGroups(prev => prev.filter(g => g._id !== id));
      setStatsMap(prev => { const s = { ...prev }; delete s[id]; return s; });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to delete group");
    }
  };

  const filteredGroups = useMemo(() => groups.filter(group => {
    const matchSearch = group.groupName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" ||
      (group.status || "active").toLowerCase().includes(status.toLowerCase());
    return matchSearch && matchStatus;
  }), [groups, search, status]);

  /* dashboard totals from live statsMap */
  const dashTotalSpent   = Object.values(statsMap).reduce((a, s) => a + s.totalSpent, 0);
  const dashTotalPending = Object.values(statsMap).reduce((a, s) => a + s.pendingAmt, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">

        <div className="header">
          <div className="header-title">
            <h1>Groups & Trips</h1>
            <p>Manage all your trips and shared expenses in one place</p>
          </div>
          <button className="btn-new-group" onClick={() => navigate("/form")}>
            + Create New Group
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Groups</div>
            <div className="stat-value">{groups.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Spent</div>
            <div className="stat-value">₹{dashTotalSpent}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Pending Amount</div>
            <div className="stat-value">₹{dashTotalPending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Active Trips</div>
            <div className="stat-value">{groups.length}</div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select-box" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="settled">Settled</option>
          </select>
          <button className="btn-refresh" onClick={handleRefresh} disabled={refreshing || loading} title="Refresh stats">
            <span className={refreshing ? "spin" : ""}>↻</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading groups...</div>
        ) : filteredGroups.length === 0 ? (
          <div className="empty-wrapper">
            <img className="empty-image" src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" alt="empty"/>
            <h2 className="empty-title">No Groups Yet</h2>
            <p className="empty-text">Start creating your first trip or expense group.</p>
            <button className="btn-create-first" onClick={() => navigate("/form")}>
              + Create Your First Group
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredGroups.map(group => (
              <GroupCard
                key={group._id}
                group={group}
                navigate={navigate}
                handleDeleteGroup={handleDeleteGroup}
                statsMap={statsMap}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}