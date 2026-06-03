import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [preview, setPreview] = useState("https://i.pravatar.cc/300");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(null);

  // ================= IMAGE =================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= INPUT CHANGES =================

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
  "https://settleji.onrender.com/api/auth/login",
  loginData
);

      console.log("LOGIN RESPONSE:", data);

      // IMPORTANT
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.user)
      );

      alert("Login Successful");

      navigate("/groups");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      signupData.password !==
      signupData.confirmPassword
    ) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "name",
        `${signupData.firstName} ${signupData.lastName}`
      );

      formData.append(
        "email",
        signupData.email
      );

      formData.append(
        "password",
        signupData.password
      );

      // IMPORTANT
      if (image) {
        formData.append("avatar", image);
      }

      const { data } = await axios.post(
        "https://settleji.onrender.com/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log("REGISTER RESPONSE:", data);

      // IMPORTANT
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.user)
      );

      alert("Account Created Successfully");

      navigate("/groups");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Inter,sans-serif;
        }

        body{
          background:#f5f6fa;
        }

        .auth-page{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          background:
            linear-gradient(
              135deg,
              #FFF0F9 0%,
              #F0EEFF 35%,
              #E8F4FF 70%,
              #F0FFF4 100%
            );
        }

        .auth-container{
          width:100%;
          max-width:1200px;
          min-height:760px;
          background:white;
          border-radius:30px;
          overflow:hidden;
          display:flex;
          box-shadow:
            0 10px 40px rgba(0,0,0,0.08);
        }

        /* LEFT */

        .left-side{
          width:45%;
          background:
            linear-gradient(
              135deg,
              #7C6FFF,
              #FF6B9D
            );
          padding:50px;
          color:white;
          position:relative;
          overflow:hidden;
          display:flex;
          align-items:center;
        }

        .left-side::before{
          content:'';
          position:absolute;
          width:250px;
          height:250px;
          border-radius:50%;
          background:rgba(255,255,255,0.08);
          top:-80px;
          right:-60px;
        }

        .left-side::after{
          content:'';
          position:absolute;
          width:220px;
          height:220px;
          border-radius:50%;
          background:rgba(255,255,255,0.06);
          bottom:-70px;
          left:-50px;
        }

        .left-content{
          position:relative;
          z-index:2;
        }

        .logo{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:40px;
        }

        .logo-box{
          width:52px;
          height:52px;
          border-radius:16px;
          background:rgba(255,255,255,0.2);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:24px;
        }

        .logo h1{
          font-size:30px;
          font-weight:800;
        }

        .main-heading{
          font-size:52px;
          line-height:1.08;
          font-weight:800;
          margin-bottom:20px;
        }

        .left-content p{
          font-size:16px;
          line-height:1.8;
          opacity:0.9;
          max-width:350px;
        }

        .stats{
          display:flex;
          gap:14px;
          margin-top:40px;
          flex-wrap:wrap;
        }

        .stat-card{
          background:rgba(255,255,255,0.15);
          border:1px solid rgba(255,255,255,0.15);
          padding:16px 18px;
          border-radius:18px;
          min-width:110px;
        }

        .stat-card h2{
          font-size:24px;
          font-weight:800;
          margin-bottom:4px;
        }

        .stat-card span{
          font-size:12px;
          opacity:0.9;
        }

        /* RIGHT */

        .right-side{
          width:55%;
          padding:40px 50px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .form-container{
          width:100%;
          max-width:450px;
        }

        .top-switch{
          display:flex;
          justify-content:flex-end;
          margin-bottom:28px;
        }

        .switch-box{
          background:#F4F0FF;
          padding:5px;
          border-radius:16px;
          display:flex;
          gap:4px;
        }

        .switch-btn{
          width:110px;
          height:42px;
          border:none;
          border-radius:12px;
          background:transparent;
          cursor:pointer;
          font-weight:700;
          color:#8b8bb5;
          transition:0.2s;
        }

        .switch-btn.active{
          background:white;
          color:#7C6FFF;
          box-shadow:
            0 2px 8px rgba(124,111,255,0.15);
        }

        .title{
          font-size:38px;
          font-weight:800;
          color:#1a1a2e;
        }

        .title-gradient{
          background:
            linear-gradient(
              90deg,
              #7C6FFF,
              #FF6B9D
            );

          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .subtitle{
          margin-top:10px;
          color:#7B7B9D;
          font-size:14px;
          line-height:1.7;
        }

        /* PROFILE */

        .profile-section{
          margin-top:22px;
          display:flex;
          align-items:center;
          gap:16px;
          padding:16px;
          border-radius:20px;
          background:
            linear-gradient(
              135deg,
              #FFF0F9,
              #F0EEFF
            );
        }

        .profile-image{
          width:70px;
          height:70px;
          border-radius:18px;
          object-fit:cover;
          border:3px solid white;
        }

        .upload-info h3{
          font-size:15px;
          margin-bottom:5px;
          color:#1a1a2e;
        }

        .upload-info p{
          font-size:12px;
          color:#8b8bb5;
          margin-bottom:10px;
        }

        .upload-btn{
          display:inline-flex;
          align-items:center;
          height:36px;
          padding:0 16px;
          border-radius:12px;
          background:
            linear-gradient(
              90deg,
              #7C6FFF,
              #9D6FFF
            );
          color:white;
          font-size:13px;
          font-weight:700;
          cursor:pointer;
        }

        .upload-input{
          display:none;
        }

        form{
          margin-top:22px;
        }

        .form-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
        }

        .login-grid{
          display:grid;
          grid-template-columns:1fr;
          gap:14px;
        }

        .full{
          grid-column:span 2;
        }

        .input-group label{
          display:block;
          margin-bottom:7px;
          font-size:13px;
          font-weight:700;
          color:#555;
        }

        .input-group input{
          width:100%;
          height:54px;
          border-radius:16px;
          border:1.5px solid #EDE8FF;
          background:#FAFAFF;
          padding:0 16px;
          outline:none;
          font-size:14px;
          transition:0.2s;
        }

        .input-group input:focus{
          border-color:#7C6FFF;
          background:white;
        }

        .forgot{
          text-align:right;
          margin-top:8px;
          margin-bottom:18px;
          color:#7C6FFF;
          font-size:13px;
          font-weight:700;
          cursor:pointer;
        }

        .submit-btn{
          width:100%;
          height:58px;
          border:none;
          border-radius:20px;
          background:
            linear-gradient(
              135deg,
              #7C6FFF,
              #FF6B9D
            );
          color:white;
          font-size:16px;
          font-weight:800;
          cursor:pointer;
          transition:0.2s;
        }

        .submit-btn:hover{
          opacity:0.92;
        }

        .submit-btn:disabled{
          opacity:0.6;
          cursor:not-allowed;
        }

        .bottom-text{
          margin-top:20px;
          text-align:center;
          color:#9090B0;
          font-size:14px;
        }

        .bottom-text span{
          font-weight:800;
          cursor:pointer;

          background:
            linear-gradient(
              90deg,
              #7C6FFF,
              #FF6B9D
            );

          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        @media(max-width:900px){
          .left-side{
            display:none;
          }

          .right-side{
            width:100%;
            padding:28px;
          }

          .auth-container{
            max-width:520px;
          }
        }

        @media(max-width:500px){

          .form-grid{
            grid-template-columns:1fr;
          }

          .full{
            grid-column:span 1;
          }

          .title{
            font-size:30px;
          }

          .right-side{
            padding:20px;
          }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-container">

          {/* LEFT SIDE */}

          <div className="left-side">
            <div className="left-content">

              <div className="logo">
                <div className="logo-box">
                  💸
                </div>

                <h1>SettleJi</h1>
              </div>

              <h2 className="main-heading">
                Split Expenses
                <br />
                Without Stress.
              </h2>

              <p>
                Manage group expenses,
                trips, balances and
                settlements beautifully
                with your friends.
              </p>

              <div className="stats">

                <div className="stat-card">
                  <h2>12K+</h2>
                  <span>Active Users</span>
                </div>

                <div className="stat-card">
                  <h2>₹2M+</h2>
                  <span>Tracked</span>
                </div>

                <div className="stat-card">
                  <h2>4.9★</h2>
                  <span>Ratings</span>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="right-side">
            <div className="form-container">

              {/* SWITCH */}

              <div className="top-switch">
                <div className="switch-box">

                  <button
                    type="button"
                    className={`switch-btn ${
                      isLogin ? "active" : ""
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className={`switch-btn ${
                      !isLogin ? "active" : ""
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>

                </div>
              </div>

              <h1 className="title">
                {isLogin ? (
                  <>
                    Welcome{" "}
                    <span className="title-gradient">
                      Back 👋
                    </span>
                  </>
                ) : (
                  <>
                    Create{" "}
                    <span className="title-gradient">
                      Account ✨
                    </span>
                  </>
                )}
              </h1>

              <p className="subtitle">
                {isLogin
                  ? "Login and continue managing your expenses beautifully."
                  : "Create your account and start splitting smarter."}
              </p>

              {/* PROFILE */}

              {!isLogin && (
                <div className="profile-section">

                  <img
                    src={preview}
                    alt=""
                    className="profile-image"
                  />

                  <div className="upload-info">
                    <h3>Profile Picture</h3>

                    <p>
                      Upload your profile image
                    </p>

                    <label
                      htmlFor="profile"
                      className="upload-btn"
                    >
                      Upload Image
                    </label>

                    <input
                      type="file"
                      id="profile"
                      className="upload-input"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </div>
                </div>
              )}

              {/* LOGIN */}

              {isLogin ? (

                <form onSubmit={handleLogin}>

                  <div className="login-grid">

                    <div className="input-group">
                      <label>Email</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Password</label>

                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>

                  </div>

                  <div className="forgot">
                    Forgot Password?
                  </div>

                  <button
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : "Login to Dashboard"}
                  </button>

                </form>

              ) : (

                <form onSubmit={handleRegister}>

                  <div className="form-grid">

                    <div className="input-group">
                      <label>First Name</label>

                      <input
                        type="text"
                        name="firstName"
                        placeholder="Ayush"
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Last Name</label>

                      <input
                        type="text"
                        name="lastName"
                        placeholder="Nagpal"
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>

                    <div className="input-group full">
                      <label>Email</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>

                    <div className="input-group full">
                      <label>Password</label>

                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>

                    <div className="input-group full">
                      <label>
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={
                          signupData.confirmPassword
                        }
                        onChange={handleSignupChange}
                        required
                      />
                    </div>

                  </div>

                  <button
                    className="submit-btn"
                    disabled={loading}
                    style={{ marginTop: "12px" }}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </button>

                </form>

              )}

              <div className="bottom-text">

                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <span
                  onClick={() =>
                    setIsLogin(!isLogin)
                  }
                >
                  {isLogin
                    ? " Sign Up"
                    : " Login"}
                </span>

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}