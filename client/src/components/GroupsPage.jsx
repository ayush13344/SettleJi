import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/groups";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

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
    --shadow-lg: 0 20px 50px rgba(28,25,23,0.11);
    --r-sm: 12px;
    --r-md: 18px;
    --r-lg: 24px;
    --r-xl: 32px;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    color: var(--ink);
  }

  .dashboard {
    min-height: 100vh;
    padding: 36px 40px 60px;
    background: var(--cream);
    position: relative;
  }

  .dashboard::before {
    content: '';
    position: fixed;
    top: -120px;
    right: -120px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #FBCDC8 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    opacity: .55;
  }

  .dashboard::after {
    content: '';
    position: fixed;
    bottom: -80px;
    left: -80px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #99F6E4 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    opacity: .4;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 36px;
    gap: 20px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .header-title h1 {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 900;
    color: var(--ink);
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  .header-title p {
    color: var(--ink3);
    margin-top: 7px;
    font-size: 15px;
    font-weight: 500;
  }

  .btn-new-group {
    background: var(--ink);
    color: white;
    border: none;
    border-radius: 999px;
    padding: 15px 28px;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform .22s, box-shadow .22s, background .2s;
    box-shadow: 0 6px 20px rgba(28,25,23,0.2);
    letter-spacing: .2px;
  }

  .btn-new-group:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(28,25,23,0.28);
    background: #2C2724;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }

  .stat-card {
    background: var(--white);
    padding: 22px 24px;
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    border: 1.5px solid var(--border);
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }

  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  .stat-card:nth-child(1) { border-top: 4px solid var(--purple); }
  .stat-card:nth-child(2) { border-top: 4px solid var(--coral); }
  .stat-card:nth-child(3) { border-top: 4px solid var(--amber); }
  .stat-card:nth-child(4) { border-top: 4px solid var(--teal); }

  .stat-title {
    font-size: 12px;
    color: var(--ink3);
    margin-bottom: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
  }

  .stat-value {
    font-family: 'Fraunces', serif;
    font-size: 34px;
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    position: relative;
  }

  .toolbar {
    display: flex;
    gap: 14px;
    margin-bottom: 28px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .search-box {
    flex: 1;
    min-width: 260px;
    position: relative;
  }

  .search-box::before {
    content: '🔍';
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    pointer-events: none;
  }

  .search-box input {
    width: 100%;
    padding: 14px 18px 14px 46px;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    outline: none;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    background: var(--white);
    color: var(--ink);
  }

  .select-box {
    padding: 14px 20px;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    outline: none;
    background: var(--white);
    min-width: 170px;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: var(--ink);
    cursor: pointer;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
    position: relative;
    z-index: 1;
  }

  .group-card {
    background: var(--white);
    border-radius: var(--r-xl);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1.5px solid var(--border);
    transition: transform .28s, box-shadow .28s;
    display: flex;
    flex-direction: column;
  }

  .group-card:hover {
    transform: translateY(-7px);
    box-shadow: var(--shadow-lg);
  }

  .card-img {
    height: 190px;
    overflow: hidden;
    position: relative;
  }

  .card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    background: rgba(255,255,255,0.88);
    color: var(--teal);
    z-index: 2;
  }

  .card-body {
    padding: 22px 22px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .group-name {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .group-desc {
    color: var(--ink3);
    font-size: 13px;
    line-height: 1.55;
    margin-bottom: 18px;
    font-weight: 500;
  }

  .members-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
  }

  .member-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: white;
    border: 2.5px solid white;
    margin-left: -9px;
  }

  .member-avatar:first-child {
    margin-left: 0;
  }

  .extra-members {
    background: var(--ink) !important;
    font-size: 11px;
  }

  .card-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }

  .card-stat-box {
    background: var(--cream);
    border: 1.5px solid var(--border);
    padding: 12px 10px;
    border-radius: var(--r-md);
    text-align: center;
  }

  .card-stat-label {
    font-size: 10px;
    color: var(--ink3);
    margin-bottom: 5px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .card-stat-value {
    font-family: 'Fraunces', serif;
    font-size: 19px;
    font-weight: 900;
    color: var(--ink);
  }

  .progress-wrapper {
    margin-bottom: 18px;
  }

  .progress-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 700;
    color: var(--ink3);
  }

  .progress-bar {
    height: 7px;
    background: var(--cream2);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--teal), #2DD4BF);
  }

  .card-footer {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }

  .btn-view {
    flex: 1;
    border: none;
    background: var(--ink);
    color: white;
    padding: 13px 16px;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    cursor: pointer;
    font-size: 13px;
  }

  .btn-delete {
    border: 1.5px solid var(--coral-bd);
    background: var(--coral-bg);
    color: var(--coral);
    padding: 13px 18px;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    cursor: pointer;
    font-size: 13px;
  }

  .loading {
    text-align: center;
    margin-top: 100px;
    color: var(--ink3);
    font-size: 16px;
    font-weight: 600;
  }

  .empty-wrapper {
    background: var(--white);
    border-radius: var(--r-xl);
    padding: 80px 40px;
    text-align: center;
    box-shadow: var(--shadow-sm);
    border: 1.5px solid var(--border);
    margin-top: 12px;
  }

  .empty-image {
    width: 100px;
    margin-bottom: 24px;
  }

  .empty-title {
    font-family: 'Fraunces', serif;
    font-size: 30px;
    font-weight: 900;
    color: var(--ink);
    margin-bottom: 12px;
  }

  .empty-text {
    color: var(--ink3);
    max-width: 400px;
    margin: 0 auto 32px;
    line-height: 1.75;
    font-size: 15px;
    font-weight: 500;
  }

  .btn-create-first {
    background: var(--ink);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  @media(max-width: 1100px) {
    .cards-grid  {
      grid-template-columns: repeat(2, 1fr);
    }

    .stats-grid  {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media(max-width: 700px) {
    .dashboard {
      padding: 20px 18px 48px;
    }

    .cards-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .header-title h1 {
      font-size: 28px;
    }
  }
`;

function GroupCard({
  group,
  navigate,
  handleDeleteGroup,
}) {
  const avatarColors = [
    "#F26B5B",
    "#7C3AED",
    "#0D9488",
    "#D97706",
    "#DB2777",
    "#2563EB",
  ];

  const visibleMembers =
    group.members?.slice(0, 4) || [];

  const extraMembers =
    (group.members?.length || 0) - 4;

  const handleViewDetails = () => {
    if (!group?._id) {
      alert("Group ID not found");
      return;
    }

    navigate(`/trips/${group._id}`);
  };

  return (
    <div className="group-card">
      <div className="card-img">
        <img
          src={
            group.coverImage ||
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200"
          }
          alt={group.groupName}
        />

        <span className="status-badge">
          {group.status || "Active"}
        </span>
      </div>

      <div className="card-body">
        <h3 className="group-name">
          {group.groupName}
        </h3>

        <p className="group-desc">
          {group.description ||
            "No description added"}
        </p>

        <div className="members-wrapper">
          {visibleMembers.map(
            (member, index) => (
              <div
                key={index}
                className="member-avatar"
                style={{
                  background:
                    avatarColors[
                      index %
                        avatarColors.length
                    ],
                }}
              >
                {member?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
            )
          )}

          {extraMembers > 0 && (
            <div className="member-avatar extra-members">
              +{extraMembers}
            </div>
          )}
        </div>

        <div className="card-stats">
          <div className="card-stat-box">
            <div className="card-stat-label">
              Total
            </div>

            <div className="card-stat-value">
              ₹{group.totalSpent || 0}
            </div>
          </div>

          <div className="card-stat-box">
            <div className="card-stat-label">
              Members
            </div>

            <div className="card-stat-value">
              {group.members?.length || 0}
            </div>
          </div>

          <div className="card-stat-box">
            <div className="card-stat-label">
              Pending
            </div>

            <div className="card-stat-value">
              ₹{group.pendingAmount || 0}
            </div>
          </div>
        </div>

        <div className="progress-wrapper">
          <div className="progress-top">
            <span>Settlement Progress</span>

            <span>{group.progress || 0}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${group.progress || 0}%`,
              }}
            />
          </div>
        </div>

        <div className="card-footer">
          <button
            className="btn-view"
            onClick={handleViewDetails}
          >
            View Details →
          </button>

          <button
            className="btn-delete"
            onClick={() =>
              handleDeleteGroup(group._id)
            }
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups(data.groups || []);
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to fetch groups"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Delete this group?"
      );

      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups((prev) =>
        prev.filter((group) => group._id !== id)
      );
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete group"
      );
    }
  };

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchSearch = group.groupName
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "All" ||
        (group.status || "active")
          .toLowerCase()
          .includes(status.toLowerCase());

      return matchSearch && matchStatus;
    });
  }, [groups, search, status]);

  const totalSpent = groups.reduce(
    (acc, curr) => acc + (curr.totalSpent || 0),
    0
  );

  const totalPending = groups.reduce(
    (acc, curr) =>
      acc + (curr.pendingAmount || 0),
    0
  );

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard">
        <div className="header">
          <div className="header-title">
            <h1>Groups & Trips</h1>

            <p>
              Manage all your trips and shared
              expenses in one place
            </p>
          </div>

          <button
            className="btn-new-group"
            onClick={() => navigate("/form")}
          >
            + Create New Group
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">
              Total Groups
            </div>

            <div className="stat-value">
              {groups.length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              Total Spent
            </div>

            <div className="stat-value">
              ₹{totalSpent}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              Pending Amount
            </div>

            <div className="stat-value">
              ₹{totalPending}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              Active Trips
            </div>

            <div className="stat-value">
              {groups.length}
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="select-box"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="settled">
              Settled
            </option>
          </select>
        </div>

        {loading ? (
          <div className="loading">
            Loading groups...
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="empty-wrapper">
            <img
              className="empty-image"
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="empty"
            />

            <h2 className="empty-title">
              No Groups Yet
            </h2>

            <p className="empty-text">
              Start creating your first trip or
              expense group.
            </p>

            <button
              className="btn-create-first"
              onClick={() => navigate("/form")}
            >
              + Create Your First Group
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                navigate={navigate}
                handleDeleteGroup={
                  handleDeleteGroup
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}