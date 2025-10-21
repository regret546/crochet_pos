import { useState } from "react";
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
    <div className="grid place-items-center h-[100vh] ">
      <form
        onSubmit={handleLogin}
        className="bg-transparent backdrop-blur-3xl text-center rounded-lg "
        action="login"
      >
        <div className="grid gap-4 p-4 bg-transparent text-white w-[300px] h-">
          <h1 className="font-bold text-2xl">Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="fa-solid fa-user absolute top-1/2 -translate-y-1/2 right-[10px]"></i>
          </div>

          <div className="input-box ">
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fa-solid fa-lock absolute top-1/2 -translate-y-1/2 right-[10px]"></i>
          </div>

          <div className="remember text-center grid items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="appearance-none relative w-5 h-5 border-2 border-white rounded-full checked:bg-pink-200 checked:border-purple-bg-pink-200 checked:before:content-['✓'] checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-white checked:before:text-sm"
              />
              <span className="text-white">Remember me</span>
            </label>
          </div>

          <button className="global-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
