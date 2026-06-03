import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const navItems = ["Features", "Trips", "Analytics", "Pricing"];

function App() {
  const navigate    = useNavigate();
  const dropdownRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [user,     setUser]     = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) setUser(userInfo);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const avatarSrc = user?.avatar?.startsWith("http")
    ? user.avatar
    : user?.avatar
    ? `https://settleji.onrender.com/${user.avatar}`
    : "https://i.pravatar.cc/100";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-animate { animation: fadeIn 0.25s ease; }
      `}</style>

      <div className="w-full relative overflow-x-hidden">

        {/* background blobs */}
        <div className="absolute w-80 h-80 bg-violet-300 rounded-full -top-28 -left-28 blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute w-80 h-80 bg-pink-300  rounded-full -top-24 -right-28 blur-[100px] opacity-40 pointer-events-none" />

        {/* ── NAVBAR ── */}
        <div className="w-full flex justify-center pt-6 relative z-50 px-3 sm:px-0">
          <div className="flex items-center justify-between gap-5 px-4 py-3
                          bg-white/65 backdrop-blur-[22px]
                          border border-white/50 rounded-full
                          shadow-[0_10px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.7)]
                          transition-transform duration-300 hover:-translate-y-0.5
                          flex-wrap sm:flex-nowrap w-full sm:w-auto
                          sm:rounded-full rounded-[28px]">

            {/* LEFT — logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-[42px] h-[42px] rounded-2xl bg-gradient-to-br from-violet-600 via-pink-500 to-amber-400 flex items-center justify-center text-white text-lg font-extrabold shadow-[0_8px_18px_rgba(124,58,237,0.25)] flex-shrink-0">
                S
              </div>
              <div>
                <h2 className="text-base font-extrabold text-gray-900 leading-none">SettleJi</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">AI Expense Platform</p>
              </div>
            </div>

            {/* CENTER — nav links */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2.5 rounded-full text-[13px] font-semibold text-gray-700 cursor-pointer transition-all duration-200 hover:bg-white hover:text-violet-600 hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* RIGHT — actions */}
            <div className="flex items-center gap-2.5 relative">

              {/* Notification bell */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[15px] cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-105">
                🔔
              </div>

              {!user ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="border-none px-[18px] py-3 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white text-[13px] font-bold cursor-pointer shadow-[0_8px_18px_rgba(124,58,237,0.25)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Login
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>

                  {/* Profile pill */}
                  <div
                    onClick={() => setShowMenu(prev => !prev)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] cursor-pointer transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <img src={avatarSrc} alt="avatar" className="w-[38px] h-[38px] rounded-full object-cover" />
                    <span className="text-[13px] font-bold text-gray-900">{user?.name}</span>
                  </div>

                  {/* Dropdown */}
                  {showMenu && (
                    <div className="dropdown-animate absolute top-[65px] right-0 w-56 bg-white rounded-[22px] p-[18px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50">
                      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <img src={avatarSrc} alt="avatar" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div>
                          <h3 className="text-[15px] font-semibold text-gray-900">{user?.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="mt-4 w-full h-[46px] border-none rounded-2xl bg-red-500 text-white font-bold cursor-pointer transition-colors duration-300 hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;