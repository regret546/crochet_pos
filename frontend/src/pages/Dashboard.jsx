import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="grid place-items-center bg-purple-200 text-white p-6 rounded-lg">
      <h2>Dashboard</h2>
      <p>Welcome to your Crochet Sale System!</p>
      <nav>
        <Link to="/sales">Go to Sales</Link> | <Link to="/">Logout</Link>
      </nav>
    </div>
  );
}
