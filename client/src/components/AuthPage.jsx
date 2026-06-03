import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [preview, setPreview] = useState("https://i.pravatar.cc/300");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [image, setImage] = useState(null);

  // ── IMAGE ──
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  // ── INPUT CHANGES ──
  const handleLoginChange  = (e) => setLoginData({ ...loginData,   [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("https://settleji.onrender.com/api/auth/login", loginData);
      console.log("LOGIN RESPONSE:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      alert("Login Successful");
      navigate("/groups");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Login Failed");
    } finally { setLoading(false); }
  };

  // ── REGISTER ──
  const handleRegister = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) return alert("Passwords do not match");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name",     `${signupData.firstName} ${signupData.lastName}`);
      formData.append("email",    signupData.email);
      formData.append("password", signupData.password);
      if (image) formData.append("avatar", image);
      const { data } = await axios.post(
        "https://settleji.onrender.com/api/auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("REGISTER RESPONSE:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      alert("Account Created Successfully");
      navigate("/groups");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Registration Failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }

        .grad-text {
          background: linear-gradient(90deg, #7C6FFF, #FF6B9D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .submit-btn {
          width: 100%;
          height: 58px;
          border: none;
          border-radius: 20px;
          background: linear-gradient(135deg, #7C6FFF, #FF6B9D);
          color: white;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity .2s;
          font-family: 'Inter', sans-serif;
        }
        .submit-btn:hover   { opacity: .92; }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; }

        .field-input {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: 1.5px solid #EDE8FF;
          background: #FAFAFF;
          padding: 0 16px;
          outline: none;
          font-size: 14px;
          transition: border-color .2s, background .2s;
          font-family: 'Inter', sans-serif;
        }
        .field-input:focus { border-color: #7C6FFF; background: white; }

        /* left side orbs */
        .left-orb-top    { position:absolute; width:250px; height:250px; border-radius:50%; background:rgba(255,255,255,0.08); top:-80px; right:-60px; }
        .left-orb-bottom { position:absolute; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.06); bottom:-70px; left:-50px; }
      `}</style>

      {/* PAGE WRAPPER */}
      <div
        className="min-h-screen flex items-center justify-center p-5"
        style={{ background: "linear-gradient(135deg,#FFF0F9 0%,#F0EEFF 35%,#E8F4FF 70%,#F0FFF4 100%)" }}
      >
        {/* CARD */}
        <div className="w-full max-w-[1200px] min-h-[760px] bg-white rounded-[30px] overflow-hidden flex shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

          {/* ══════════════════════════════
              LEFT SIDE  (hidden on mobile)
          ══════════════════════════════ */}
          <div
            className="hidden lg:flex w-[45%] relative items-center p-[50px] text-white overflow-hidden"
            style={{ background: "linear-gradient(135deg,#7C6FFF,#FF6B9D)" }}
          >
            <div className="left-orb-top" />
            <div className="left-orb-bottom" />

            <div className="relative z-10">
              {/* logo */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-[52px] h-[52px] rounded-2xl bg-white/20 flex items-center justify-center text-2xl">💸</div>
                <h1 className="text-[30px] font-extrabold">SettleJi</h1>
              </div>

              <h2 className="text-[52px] leading-[1.08] font-extrabold mb-5">
                Split Expenses<br />Without Stress.
              </h2>

              <p className="text-base leading-[1.8] opacity-90 max-w-[350px]">
                Manage group expenses, trips, balances and settlements beautifully with your friends.
              </p>

              {/* stats */}
              <div className="flex gap-3.5 mt-10 flex-wrap">
                {[
                  { val:"12K+", label:"Active Users" },
                  { val:"₹2M+", label:"Tracked" },
                  { val:"4.9★", label:"Ratings" },
                ].map((s,i) => (
                  <div key={i} className="bg-white/15 border border-white/15 px-[18px] py-4 rounded-[18px] min-w-[110px]">
                    <div className="text-2xl font-extrabold mb-1">{s.val}</div>
                    <span className="text-xs opacity-90">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════
              RIGHT SIDE
          ══════════════════════════════ */}
          <div className="flex-1 lg:w-[55%] flex items-center justify-center px-5 py-8 sm:px-10 sm:py-10">
            <div className="w-full max-w-[450px]">

              {/* SWITCH */}
              <div className="flex justify-end mb-7">
                <div className="bg-[#F4F0FF] p-[5px] rounded-2xl flex gap-1">
                  {["Login","Sign Up"].map((label, i) => {
                    const active = i === 0 ? isLogin : !isLogin;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setIsLogin(i === 0)}
                        className={`w-[110px] h-[42px] rounded-xl font-bold text-sm transition-all duration-200 border-none cursor-pointer ${
                          active
                            ? "bg-white text-[#7C6FFF] shadow-[0_2px_8px_rgba(124,111,255,0.15)]"
                            : "bg-transparent text-[#8b8bb5]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TITLE */}
              <h1 className="text-[30px] sm:text-[38px] font-extrabold text-[#1a1a2e]">
                {isLogin ? (
                  <>Welcome <span className="grad-text">Back 👋</span></>
                ) : (
                  <>Create <span className="grad-text">Account ✨</span></>
                )}
              </h1>

              <p className="mt-2.5 text-[#7B7B9D] text-sm leading-[1.7]">
                {isLogin
                  ? "Login and continue managing your expenses beautifully."
                  : "Create your account and start splitting smarter."}
              </p>

              {/* PROFILE (signup only) */}
              {!isLogin && (
                <div
                  className="mt-5 flex items-center gap-4 p-4 rounded-[20px]"
                  style={{ background: "linear-gradient(135deg,#FFF0F9,#F0EEFF)" }}
                >
                  <img src={preview} alt="preview" className="w-[70px] h-[70px] rounded-[18px] object-cover border-[3px] border-white flex-shrink-0" />
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-1">Profile Picture</h3>
                    <p className="text-xs text-[#8b8bb5] mb-2.5">Upload your profile image</p>
                    <label
                      htmlFor="profile"
                      className="inline-flex items-center h-9 px-4 rounded-xl cursor-pointer text-[13px] font-bold text-white"
                      style={{ background: "linear-gradient(90deg,#7C6FFF,#9D6FFF)" }}
                    >
                      Upload Image
                    </label>
                    <input type="file" id="profile" className="hidden" accept="image/*" onChange={handleImage} />
                  </div>
                </div>
              )}

              {/* ── LOGIN FORM ── */}
              {isLogin ? (
                <form onSubmit={handleLogin} className="mt-5">
                  <div className="flex flex-col gap-3.5">

                    <div>
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">Email</label>
                      <input
                        type="email" name="email" placeholder="Enter your email"
                        value={loginData.email} onChange={handleLoginChange}
                        required className="field-input"
                      />
                    </div>

                    <div>
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">Password</label>
                      <input
                        type="password" name="password" placeholder="Enter password"
                        value={loginData.password} onChange={handleLoginChange}
                        required className="field-input"
                      />
                    </div>

                  </div>

                  <div className="text-right mt-2 mb-[18px] text-[#7C6FFF] text-[13px] font-bold cursor-pointer">
                    Forgot Password?
                  </div>

                  <button className="submit-btn" disabled={loading}>
                    {loading ? "Please wait..." : "Login to Dashboard"}
                  </button>
                </form>

              ) : (

                /* ── SIGNUP FORM ── */
                <form onSubmit={handleRegister} className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                    <div>
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">First Name</label>
                      <input
                        type="text" name="firstName" placeholder="Ayush"
                        value={signupData.firstName} onChange={handleSignupChange}
                        required className="field-input"
                      />
                    </div>

                    <div>
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">Last Name</label>
                      <input
                        type="text" name="lastName" placeholder="Nagpal"
                        value={signupData.lastName} onChange={handleSignupChange}
                        required className="field-input"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">Email</label>
                      <input
                        type="email" name="email" placeholder="Enter your email"
                        value={signupData.email} onChange={handleSignupChange}
                        required className="field-input"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">Password</label>
                      <input
                        type="password" name="password" placeholder="Enter password"
                        value={signupData.password} onChange={handleSignupChange}
                        required className="field-input"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-[7px] text-[13px] font-bold text-[#555]">Confirm Password</label>
                      <input
                        type="password" name="confirmPassword" placeholder="Confirm password"
                        value={signupData.confirmPassword} onChange={handleSignupChange}
                        required className="field-input"
                      />
                    </div>

                  </div>

                  <button className="submit-btn mt-3" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              )}

              {/* BOTTOM SWITCH TEXT */}
              <p className="mt-5 text-center text-[#9090B0] text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                {" "}
                <span
                  onClick={() => setIsLogin(!isLogin)}
                  className="grad-text font-extrabold cursor-pointer"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </span>
              </p>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}