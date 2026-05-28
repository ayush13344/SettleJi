import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);

  const [user, setUser] = useState(null);

  const navItems = [
    "Features",
    "Trips",
    "Analytics",
    "Pricing",
  ];

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (userInfo) {
      setUser(userInfo.user);
    }
  }, []);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");

    setUser(null);

    navigate("/");
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          body{
            font-family:'Inter',sans-serif;
            background:#f6f7fb;
            min-height:100vh;
            overflow-x:hidden;
          }

          .app{
            width:100%;
            position:relative;
          }

          /* BACKGROUND */

          .bg-blur-1{
            position:absolute;
            width:320px;
            height:320px;
            background:#c4b5fd;
            border-radius:50%;
            top:-120px;
            left:-120px;
            filter:blur(100px);
            opacity:0.5;
          }

          .bg-blur-2{
            position:absolute;
            width:320px;
            height:320px;
            background:#f9a8d4;
            border-radius:50%;
            top:-100px;
            right:-120px;
            filter:blur(100px);
            opacity:0.4;
          }

          /* NAVBAR */

          .navbar-wrapper{
            width:100%;
            display:flex;
            justify-content:center;
            padding-top:24px;
            position:relative;
            z-index:100;
          }

          .dynamic-island{
            display:flex;
            align-items:center;
            justify-content:space-between;

            gap:22px;

            padding:12px 16px;

            background:rgba(255,255,255,0.65);

            backdrop-filter:blur(22px);

            border:1px solid rgba(255,255,255,0.5);

            border-radius:999px;

            box-shadow:
              0 10px 30px rgba(0,0,0,0.06),
              inset 0 1px 1px rgba(255,255,255,0.7);

            transition:0.3s ease;
          }

          .dynamic-island:hover{
            transform:translateY(-2px);
          }

          /* LEFT */

          .logo-section{
            display:flex;
            align-items:center;
            gap:10px;
          }

          .logo-icon{
            width:42px;
            height:42px;

            border-radius:14px;

            background:linear-gradient(
              135deg,
              #7c3aed,
              #ec4899,
              #f59e0b
            );

            display:flex;
            align-items:center;
            justify-content:center;

            color:white;

            font-size:18px;
            font-weight:800;

            box-shadow:
              0 8px 18px rgba(124,58,237,0.25);
          }

          .logo-text h2{
            font-size:16px;
            font-weight:800;
            color:#111827;
            line-height:1;
          }

          .logo-text p{
            font-size:11px;
            color:#6b7280;
            margin-top:3px;
          }

          /* CENTER */

          .nav-links{
            display:flex;
            align-items:center;
            gap:6px;
          }

          .nav-item{
            padding:10px 16px;

            border-radius:999px;

            font-size:13px;
            font-weight:600;

            color:#374151;

            cursor:pointer;

            transition:0.25s ease;
          }

          .nav-item:hover{
            background:white;
            color:#7c3aed;

            box-shadow:
              0 5px 15px rgba(0,0,0,0.05);
          }

          /* RIGHT */

          .nav-right{
            display:flex;
            align-items:center;
            gap:10px;
            position:relative;
          }

          .notification{
            width:40px;
            height:40px;

            border-radius:50%;

            background:white;

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:15px;

            cursor:pointer;

            box-shadow:
              0 5px 15px rgba(0,0,0,0.05);

            transition:0.3s;
          }

          .notification:hover{
            transform:scale(1.06);
          }

          /* LOGIN BUTTON */

          .cta-btn{
            border:none;

            padding:12px 18px;

            border-radius:999px;

            background:linear-gradient(
              135deg,
              #7c3aed,
              #ec4899
            );

            color:white;

            font-size:13px;
            font-weight:700;

            cursor:pointer;

            box-shadow:
              0 8px 18px rgba(124,58,237,0.25);

            transition:0.3s;
          }

          .cta-btn:hover{
            transform:translateY(-2px);
          }

          /* PROFILE */

          .profile-dropdown{
            position:relative;
          }

          .profile-wrapper{
            display:flex;
            align-items:center;
            gap:10px;

            padding:4px 12px 4px 4px;

            border-radius:999px;

            background:white;

            box-shadow:
              0 5px 15px rgba(0,0,0,0.05);

            cursor:pointer;

            transition:0.3s;
          }

          .profile-wrapper:hover{
            transform:translateY(-2px);
          }

          .profile-image{
            width:38px;
            height:38px;
            border-radius:50%;
            object-fit:cover;
          }

          .profile-name{
            font-size:13px;
            font-weight:700;
            color:#111827;
          }

          /* DROPDOWN */

          .dropdown-menu{
            position:absolute;
            top:65px;
            right:0;

            width:220px;

            background:white;

            border-radius:22px;

            padding:18px;

            box-shadow:
              0 15px 40px rgba(0,0,0,0.08);

            border:1px solid #f1f1f1;

            animation:fadeIn 0.25s ease;
          }

          @keyframes fadeIn{
            from{
              opacity:0;
              transform:translateY(10px);
            }

            to{
              opacity:1;
              transform:translateY(0);
            }
          }

          .dropdown-user{
            display:flex;
            align-items:center;
            gap:12px;

            padding-bottom:16px;
            border-bottom:1px solid #f1f1f1;
          }

          .dropdown-user img{
            width:48px;
            height:48px;
            border-radius:50%;
            object-fit:cover;
          }

          .dropdown-user h3{
            font-size:15px;
            color:#111827;
          }

          .dropdown-user p{
            font-size:12px;
            color:#6b7280;
            margin-top:4px;
          }

          .logout-btn{
            margin-top:16px;

            width:100%;
            height:46px;

            border:none;

            border-radius:14px;

            background:#ef4444;

            color:white;

            font-weight:700;

            cursor:pointer;

            transition:0.3s;
          }

          .logout-btn:hover{
            background:#dc2626;
          }

          /* MOBILE */

          @media(max-width:900px){

            .dynamic-island{
              flex-wrap:wrap;
              justify-content:center;
              gap:14px;
              padding:18px;
              border-radius:28px;
              width:92%;
            }
          }

          @media(max-width:600px){

            .navbar-wrapper{
              padding-inline:12px;
            }

            .nav-links{
              flex-wrap:wrap;
              justify-content:center;
            }

            .dynamic-island{
              padding:16px;
            }
          }
        `}
      </style>

      <div className="app">
        <div className="bg-blur-1"></div>

        <div className="bg-blur-2"></div>

        {/* NAVBAR */}

        <div className="navbar-wrapper">
          <div className="dynamic-island">
            {/* LEFT */}

            <div className="logo-section">
              <div className="logo-icon">
                S
              </div>

              <div className="logo-text">
                <h2>SettleJi</h2>

                <p>AI Expense Platform</p>
              </div>
            </div>

            {/* CENTER */}

            <div className="nav-links">
              {navItems.map((item, index) => (
                <div
                  className="nav-item"
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* RIGHT */}

            <div className="nav-right">
              <div className="notification">
                🔔
              </div>

              {!user ? (
                <button
                  className="cta-btn"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Login
                </button>
              ) : (
                <div
                  className="profile-dropdown"
                  ref={dropdownRef}
                >
                  <div
                    className="profile-wrapper"
                    onClick={() =>
                      setShowMenu(!showMenu)
                    }
                  >
                    <img
                      src={
                        user.avatar ||
                        "https://i.pravatar.cc/100"
                      }
                      alt=""
                      className="profile-image"
                    />

                    <div className="profile-name">
                      {user.name}
                    </div>
                  </div>

                  {showMenu && (
                    <div className="dropdown-menu">
                      <div className="dropdown-user">
                        <img
                          src={
                            user.avatar ||
                            "https://i.pravatar.cc/100"
                          }
                          alt=""
                        />

                        <div>
                          <h3>{user.name}</h3>

                          <p>{user.email}</p>
                        </div>
                      </div>

                      <button
                        className="logout-btn"
                        onClick={handleLogout}
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