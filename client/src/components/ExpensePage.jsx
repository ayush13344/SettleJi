import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────── */
const c = {
  page: {
    minHeight: "100vh",
    background: "#f8f7ff",
    fontFamily: "'Outfit','Segoe UI',sans-serif",
    fontSize: 13,
    color: "#1e293b",
    display: "flex",
    justifyContent: "center",
    paddingBottom: 120,
  },

  shell: {
    width: "100%",
    maxWidth: 480,
    background: "#fff",
    position: "relative",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: "1px solid #f1f0ff",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },

  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
  },

  headerRight: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },

  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    color: "#64748b",
    fontSize: 18,
  },

  groupBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    background: "#faf9ff",
    borderBottom: "1px solid #f1f0ff",
  },

  groupLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  groupImg: {
    width: 40,
    height: 34,
    borderRadius: 8,
    objectFit: "cover",
  },

  groupName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },

  groupSub: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 1,
  },

  amtRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px 8px",
  },

  amtDisplay: {
    fontSize: 36,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: -1,
  },

  amtRs: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
    marginRight: 2,
  },

  currencyPill: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#f1f0ff",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 600,
    color: "#4f46e5",
    cursor: "pointer",
  },

  quickRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 18px 14px",
    overflowX: "auto",
  },

  quickBtn: {
    padding: "6px 14px",
    borderRadius: 20,
    background: "#f8f7ff",
    border: "1px solid #e8e4ff",
    fontSize: 12,
    fontWeight: 600,
    color: "#4f46e5",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  divider: {
    height: 1,
    background: "#f1f0ff",
    margin: "0 0 16px",
  },

  payerRow: {
    display: "flex",
    gap: 16,
    padding: "0 18px",
    marginBottom: 20,
    overflowX: "auto",
  },

  payerItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    flexShrink: 0,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    position: "relative",
  },

  avatarSel: {
    outline: "2.5px solid #4f46e5",
    outlineOffset: 2,
  },

  checkDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "#4f46e5",
    border: "2px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 8,
    color: "#fff",
  },

  payerName: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },

  input: {
    width: "100%",
    border: "1px solid #e8e4ff",
    borderRadius: 10,
    padding: 12,
    outline: "none",
    background: "#faf9ff",
    marginBottom: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: 90,
    border: "1px solid #e8e4ff",
    borderRadius: 10,
    padding: 12,
    outline: "none",
    background: "#faf9ff",
    marginBottom: 14,
    resize: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    border: "1px solid #e8e4ff",
    borderRadius: 10,
    padding: 12,
    outline: "none",
    background: "#faf9ff",
    marginBottom: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
  },

  uploadBox: {
    border: "2px dashed #d6d3ff",
    borderRadius: 14,
    padding: 18,
    textAlign: "center",
    background: "#faf9ff",
    marginBottom: 16,
    cursor: "pointer",
  },

  uploadText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
  },

  previewImage: {
    width: "100%",
    borderRadius: 12,
    marginTop: 12,
    objectFit: "cover",
    maxHeight: 220,
  },

  ctaWrap: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 480,
    padding: "14px 18px 20px",
    background: "#fff",
    borderTop: "1px solid #f1f0ff",
  },

  ctaBtn: {
    width: "100%",
    padding: "15px 0",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 18px rgba(79,70,229,.35)",
  },

  label: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    padding: "0 18px",
  },
};

export default function ExpensePage() {
  const navigate = useNavigate();

  // ✅ FIX 1: Read :groupId from the URL param (route must be /expense/:groupId)
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedPayer, setSelectedPayer] = useState(0);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(2450);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Food");
  const [billImage, setBillImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const groupData = data.group || data;

      setGroup(groupData);

      const groupMembers =
        groupData.members?.map((member, index) => ({
          _id: member._id || member.user?._id,
          name: member.name || member.user?.name,
          initials: (member.name || member.user?.name)
            ?.split(" ")
            ?.map((n) => n[0])
            ?.join("")
            ?.slice(0, 2)
            ?.toUpperCase(),
          color: [
            "#7c3aed",
            "#0ea5e9",
            "#f59e0b",
            "#f43f5e",
            "#10b981",
            "#ec4899",
          ][index % 6],
        })) || [];

      setMembers(groupMembers);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch group");
    }
  };

  const addAmount = (n) => {
    setAmount((prev) => prev + n);
  };

  const handleBillUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBillImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddExpense = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!groupId) {
        alert("Group ID missing from route");
        return;
      }

      if (!title) {
        alert("Please enter title");
        return;
      }

      const payload = {
        group: groupId,
        title,
        amount: Number(amount),
        category,
        paidBy: members[selectedPayer]?._id,
        // ✅ FIX 2: Use "share" instead of "amount" to match the Expense schema
        participants: members.map((m) => ({
          user: m._id,
          share: Number(amount) / members.length,
        })),
        notes,
      };

      console.log("PAYLOAD:", payload);

      await axios.post(
        "http://localhost:5000/api/expenses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Expense added successfully");

      // ✅ FIX 3: Navigate back using groupId from params
      navigate(`/trips/${groupId}`);
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={c.page}>
      <div style={c.shell}>
        {/* HEADER */}
        <div style={c.header}>
          <button
            style={c.backBtn}
            onClick={() => navigate(-1)}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span style={c.headerTitle}>Add Expense</span>

          <div style={c.headerRight}>
            <button style={c.iconBtn}>⋮</button>
          </div>
        </div>

        {/* GROUP */}
        <div style={c.groupBar}>
          <div style={c.groupLeft}>
            <img
              src={
                group?.coverImage ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&q=60"
              }
              alt="group"
              style={c.groupImg}
            />

            <div>
              <p style={c.groupName}>
                {group?.groupName || group?.name || "Trip"}
              </p>

              <p style={c.groupSub}>
                {members.length} Members
              </p>
            </div>
          </div>
        </div>

        {/* AMOUNT */}
        <p style={c.label}>Total Amount</p>

        <div style={c.amtRow}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={c.amtRs}>₹</span>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{
                ...c.amtDisplay,
                background: "none",
                border: "none",
                outline: "none",
                width: 200,
              }}
            />
          </div>

          <div style={c.currencyPill}>INR</div>
        </div>

        {/* QUICK ADD */}
        <div style={c.quickRow}>
          {[100, 500, 1000, 2000].map((n) => (
            <button
              key={n}
              style={c.quickBtn}
              onClick={() => addAmount(n)}
            >
              +{n}
            </button>
          ))}
        </div>

        <div style={c.divider} />

        {/* FORM */}
        <div style={{ padding: "0 18px" }}>
          <input
            style={c.input}
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            style={c.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Hotel">Hotel</option>
            <option value="Shopping">Shopping</option>
            <option value="Fuel">Fuel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            style={c.textarea}
            placeholder="Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* BILL UPLOAD */}
          <label style={c.uploadBox}>
            📄 Upload Bill / Receipt
            <div style={c.uploadText}>JPG, PNG or PDF</div>
            <input type="file" hidden onChange={handleBillUpload} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={c.previewImage}
              />
            )}
          </label>
        </div>

        {/* PAID BY */}
        <p style={c.label}>Paid by</p>

        <div style={c.payerRow}>
          {members.map((member, index) => (
            <div
              key={member._id}
              style={c.payerItem}
              onClick={() => setSelectedPayer(index)}
            >
              <div
                style={{
                  ...c.avatar,
                  background: member.color,
                  ...(selectedPayer === index ? c.avatarSel : {}),
                }}
              >
                {member.initials}

                {selectedPayer === index && (
                  <div style={c.checkDot}>✓</div>
                )}
              </div>

              <span style={c.payerName}>{member.name}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={c.ctaWrap}>
          <button
            style={c.ctaBtn}
            onClick={handleAddExpense}
            disabled={loading}
          >
            {loading ? "Adding..." : "➤ Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}