import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL     = "https://settleji.onrender.com/api";
const GROUPS_URL   = `${BASE_URL}/groups`;
const EXPENSES_URL = `${BASE_URL}/expenses`;

const AVATAR_COLORS = ["#F26B5B","#7C3AED","#0D9488","#D97706","#DB2777","#2563EB"];

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
    <div className="group bg-white rounded-[28px] overflow-hidden shadow-[0_2px_12px_rgba(28,25,23,0.07)] border border-stone-100 flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(28,25,23,0.13)]">

      {/* Image */}
      <div className="h-[200px] overflow-hidden relative">
        <img
          src={group.coverImage || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=75"}
          alt={group.groupName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(28,25,23,0.62)] pointer-events-none" />

        {group.category && (
          <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-white/90 text-stone-600 backdrop-blur-md">
            {group.category}
          </span>
        )}
        <span className="absolute top-3.5 right-3.5 z-10 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-[rgba(13,148,136,0.15)] text-[#0D9488] border border-[rgba(13,148,136,0.25)] backdrop-blur-md">
          ● {group.status || "Active"}
        </span>
        <div className="absolute bottom-3.5 left-4 right-4 z-10 font-[Fraunces,serif] text-xl font-black text-white leading-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.35)]">
          {group.groupName}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3.5">
        <p className="text-stone-400 text-[13px] leading-relaxed font-medium">
          {group.description || "No description added"}
        </p>

        {/* Members */}
        <div className="flex items-center">
          {visibleMembers.map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white border-[2.5px] border-white -ml-2 first:ml-0 shadow-sm transition-transform duration-150"
              style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              title={member?.name || "Member"}
            >
              {member?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          ))}
          {extraMembers > 0 && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white border-[2.5px] border-white -ml-2 shadow-sm bg-stone-900">
              +{extraMembers}
            </div>
          )}
          <span className="ml-2.5 text-xs font-semibold text-stone-400">
            {group.members?.length || 0} member{group.members?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total Spent", value: isLoading ? null : `₹${totalSpent}`, accent: "border-t-[#7C3AED]" },
            { label: "Members",     value: group.members?.length || 0,           accent: "border-t-[#0D9488]" },
            { label: "Pending",     value: isLoading ? null : `₹${pendingAmt}`,  accent: "border-t-[#F26B5B]" },
          ].map(({ label, value, accent }) => (
            <div key={label} className={`bg-[#FDFAF5] border border-stone-100 border-t-[3px] ${accent} rounded-2xl py-3 px-2 text-center`}>
              <div className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1.5">{label}</div>
              <div className="font-[Fraunces,serif] text-lg font-black text-stone-900 leading-none">
                {value === null
                  ? <span className="inline-block w-12 h-4 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_1.2s_infinite] align-middle" />
                  : value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-bold text-stone-400">
            <span>Settlement Progress</span>
            <span className="text-[#0D9488] font-extrabold">{isLoading ? "—" : `${progress}%`}</span>
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#2DD4BF] transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2.5 mt-auto pt-0.5">
          <button
            className="flex-1 border-none bg-stone-900 text-white py-3 px-4 rounded-full font-[Outfit,sans-serif] font-bold cursor-pointer text-[13px] tracking-wide shadow-[0_4px_14px_rgba(28,25,23,0.18)] hover:bg-stone-800 hover:-translate-y-px hover:shadow-[0_7px_20px_rgba(28,25,23,0.24)] transition-all"
            onClick={() => {
              if (!group?._id) { alert("Group ID not found"); return; }
              navigate(`/trips/${group._id}`);
            }}
          >
            View Details →
          </button>
          <button
            className="border border-[#FBCDC8] bg-[#FEF0EE] text-[#F26B5B] py-3 px-4 rounded-full font-[Outfit,sans-serif] font-bold cursor-pointer text-sm hover:bg-[#FBCDC8] hover:-translate-y-px transition-all"
            onClick={() => handleDeleteGroup(group._id)}
          >
            🗑
          </button>
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
  const [statsMap,   setStatsMap]   = useState({});
  const [refreshing, setRefreshing] = useState(false);

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
        const expenses = raw?.expenses || (Array.isArray(raw) ? raw : []);
        map[gId] = computeStats(expenses);
      } else {
        map[gId] = { totalSpent: 0, pendingAmt: 0, settledAmt: 0, progress: 0 };
      }
    });

    setStatsMap(map);
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(GROUPS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetched = data.groups || [];
      setGroups(fetched);
      fetchAllExpenses(fetched);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, [fetchAllExpenses]);

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

  const dashTotalSpent   = Object.values(statsMap).reduce((a, s) => a + s.totalSpent, 0);
  const dashTotalPending = Object.values(statsMap).reduce((a, s) => a + s.pendingAmt, 0);

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-[Outfit,sans-serif] text-stone-900 px-5 sm:px-10 pt-9 pb-20 relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .font-fraunces { font-family: 'Fraunces', serif; }
        select { -webkit-appearance: none; appearance: none; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spinning { to { transform: rotate(360deg); } }
        .spin { animation: spinning 0.7s linear infinite; display: inline-block; }
      `}</style>

      {/* decorative blobs */}
      <div className="fixed -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,#FBCDC8_0%,transparent_68%)] pointer-events-none z-0 opacity-50" />
      <div className="fixed -bottom-20 -left-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,#99F6E4_0%,transparent_68%)] pointer-events-none z-0 opacity-35" />

      {/* ══ HEADER ══ */}
      <div className="flex justify-between items-center mb-9 gap-5 flex-wrap relative z-10">
        <div>
          <h1 className="font-[Fraunces,serif] text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Groups & Trips
          </h1>
          <p className="text-stone-400 mt-1.5 text-[15px] font-medium">
            Manage all your trips and shared expenses in one place
          </p>
        </div>
        <button
          onClick={() => navigate("/form")}
          className="bg-stone-900 text-white border-none rounded-full px-7 py-4 font-[Outfit,sans-serif] font-bold cursor-pointer text-[14px] flex items-center gap-2 shadow-[0_6px_20px_rgba(28,25,23,0.2)] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(28,25,23,0.28)] hover:bg-stone-800 transition-all"
        >
          + Create New Group
        </button>
      </div>

      {/* ══ STATS GRID ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
        {[
          { label: "Total Groups",   value: groups.length,        accent: "border-t-[#7C3AED]" },
          { label: "Total Spent",    value: `₹${dashTotalSpent}`, accent: "border-t-[#F26B5B]" },
          { label: "Pending Amount", value: `₹${dashTotalPending}`,accent: "border-t-[#D97706]" },
          { label: "Active Trips",   value: groups.length,        accent: "border-t-[#0D9488]" },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className={`bg-white px-6 py-5 rounded-3xl shadow-sm border border-stone-100 border-t-[4px] ${accent} relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(28,25,23,0.09)] transition-all`}
          >
            <div className="text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-3">{label}</div>
            <div className="font-[Fraunces,serif] text-[34px] font-black text-stone-900 leading-none">{value}</div>
          </div>
        ))}
      </div>

      {/* ══ TOOLBAR ══ */}
      <div className="flex gap-3.5 mb-7 flex-wrap relative z-10">
        {/* Search */}
        <div className="flex-1 min-w-[260px] relative">
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[15px] pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-3.5 pr-5 pl-12 rounded-full border border-stone-200 outline-none text-[14px] font-[Outfit,sans-serif] font-medium bg-white text-stone-900 focus:border-stone-800 focus:ring-2 focus:ring-stone-900/5 transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          className="py-3.5 px-5 rounded-full border border-stone-200 outline-none bg-white min-w-[170px] font-[Outfit,sans-serif] font-bold text-[14px] text-stone-900 cursor-pointer"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="settled">Settled</option>
        </select>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="py-3.5 px-5 rounded-full border border-stone-200 bg-white font-[Outfit,sans-serif] font-bold text-[13px] text-stone-500 cursor-pointer flex items-center gap-1.5 hover:bg-[#F5EFE6] hover:border-stone-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={refreshing ? "spin" : ""}>↻</span>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="relative z-10">
        {loading ? (
          <div className="text-center mt-24 text-stone-400 text-base font-semibold">Loading groups...</div>

        ) : filteredGroups.length === 0 ? (
          <div className="bg-white rounded-[28px] py-20 px-10 text-center shadow-sm border border-stone-100 mt-3">
            <img className="w-24 mx-auto mb-6" src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" alt="empty" />
            <h2 className="font-[Fraunces,serif] text-[30px] font-black text-stone-900 mb-3">No Groups Yet</h2>
            <p className="text-stone-400 max-w-sm mx-auto mb-8 leading-[1.75] text-[15px] font-medium">
              Start creating your first trip or expense group.
            </p>
            <button
              onClick={() => navigate("/form")}
              className="bg-stone-900 text-white border-none py-4 px-8 rounded-full font-[Outfit,sans-serif] text-[14px] font-bold cursor-pointer shadow-[0_6px_20px_rgba(28,25,23,0.2)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(28,25,23,0.26)] transition-all"
            >
              + Create Your First Group
            </button>
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
}