import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("register");

  
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

 
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

 
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState("");
  const [transactionType, setTransactionType] = useState("");

  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // info, success, danger

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Helper function to show a message for 1 minute
  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000); // 1 minute
  };

  const validateRegisterForm = () => {
    if (registerForm.name.length < 3) {
      showMessage("Name must be at least 3 characters", "danger");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(registerForm.email)) {
      showMessage("Email must be valid", "danger");
      return false;
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    if (!passwordRegex.test(registerForm.password)) {
      showMessage(
        "Password must be at least 8 chars, include uppercase, lowercase, number & special char",
        "danger"
      );
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    try {
      const res = await axiosClient.post("/admin/register", registerForm);
      showMessage(res.data.message, "success");
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      showMessage(err.response?.data?.message || "Register failed", "danger");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/admin/users", { params: { page, size } });
      setUsers(res.data.content || res.data);
      showMessage("Users fetched successfully", "success");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to fetch users", "danger");
    }
  };

  const fetchUserTransactions = async () => {
    if (!userId) {
      showMessage("Please enter a user UUID", "danger");
      return;
    }
    try {
      const res = await axiosClient.get(`/auth/user/${userId}`, {
        params: { type: transactionType, page, size },
      });
      setTransactions(res.data.content || res.data);
      showMessage("Transactions fetched successfully", "success");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to fetch transactions", "danger");
    }
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="text-primary">Admin Dashboard 🎉</h1>
        <button className="btn btn-danger btn-lg" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert alert-${messageType} mb-4`} role="alert">
          {message}
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {["register", "users", "transactions"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "register"
                ? "Register Admin"
                : tab === "users"
                ? "All Users"
                : "User Transactions"}
            </button>
          </li>
        ))}
      </ul>

      {/* Register Admin */}
      {activeTab === "register" && (
        <div className="card shadow-lg p-5 mb-5 bg-light rounded-4">
          <h3 className="mb-4 text-secondary">Register New Admin</h3>
          <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
            <input
              className="form-control form-control-lg"
              placeholder="Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            />
            <input
              className="form-control form-control-lg"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <input
              className="form-control form-control-lg"
              placeholder="Password"
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <button className="btn btn-primary btn-lg mt-2">Register Admin</button>
          </form>
        </div>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <div className="card shadow-lg p-5 mb-5 bg-light rounded-4">
          <h3 className="mb-4 text-secondary">All Users</h3>
          <div className="d-flex flex-wrap gap-3 mb-4">
            <input
              type="number"
              className="form-control w-auto"
              placeholder="Page"
              value={page}
              onChange={(e) => setPage(e.target.value)}
            />
            <input
              type="number"
              className="form-control w-auto"
              placeholder="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <button className="btn btn-success btn-lg" onClick={fetchUsers}>
              Fetch Users
            </button>
          </div>
          <ul className="list-group">
            {users.map((u) => (
              <li
                key={u.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold">{u.name}</span>
                <span className="text-muted">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <div className="card shadow-lg p-5 mb-5 bg-light rounded-4">
          <h3 className="mb-4 text-secondary">User Transactions</h3>
          <div className="d-flex flex-wrap gap-3 mb-4">
            <input
              className="form-control w-auto"
              placeholder="User UUID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <select
              className="form-control w-auto"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
            <button className="btn btn-warning btn-lg" onClick={fetchUserTransactions}>
              Fetch Transactions
            </button>
          </div>
          <ul className="list-group">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold">{t.type} - {t.amount}</span>
                <span className="text-muted">{new Date(t.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
