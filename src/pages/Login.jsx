import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import {jwtDecode} from "jwt-decode"; // صحح الاستيراد

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email is invalid");
      return;
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
      );
      return;
    }

    try {
      const res = await axiosClient.post("/auth/login", form);
      const token = res.data.data; // تأكد من مكان التوكن في API

      console.log("Received Token:", token);

      if (token) {
        localStorage.setItem("token", token); // خزنه في localStorage
        const decoded = jwtDecode(token);
        const role = decoded.role;

        console.log("ROLE:", role);
        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }

      setSuccess(res.data?.message || "Logged in successfully!");
    } catch (err) {
      console.log("Login error:", err.response?.data || err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow p-3">
            <div className="card-body text-center">
              <h2 className="mb-4" style={{ animation: "fadeIn 1s ease" }}>
                Login to EazyWallet 🔐
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/")}
                  style={{
                    color: "#0d6efd",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Login;

