import { useState } from "react";
import { motion } from "motion/react";
import { loginUser } from "../api/authApi";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ username, password });
      console.log("✅ Login successful:", data);
      // Save user/token to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Redirect to dashboard (example)
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-lavender-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">Sign in to your Crochet POS account</p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                name="username"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-4 pr-12"
              />
              <i className="fa-solid fa-user absolute top-1/2 -translate-y-1/2 right-4 text-slate-400"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-4 pr-12"
              />
              <i className="fa-solid fa-lock absolute top-1/2 -translate-y-1/2 right-4 text-slate-400"></i>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-300 focus:ring-2 cursor-pointer"
                />
                <span className="text-slate-600 text-sm group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="global-button w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
