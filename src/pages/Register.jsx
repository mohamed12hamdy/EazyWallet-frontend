import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosClient = axios.create({
    baseURL: "http://localhost:8081",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (form.name.length < 3 || form.name.length > 50) {
            setError("Name must be between 3 and 50 characters");
            return;
        }

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
            const res = await axiosClient.post("/auth/register", form);
            setSuccess(res.data?.message || "Registered successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            console.log("Error:", err.response || err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow p-3">
                        <div className="card-body text-center">
                            <h2 className="mb-4" style={{ animation: "fadeIn 1s ease" }}>
                                Welcome to EazyWallet 🎉
                            </h2>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 text-start">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

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
                                    Register
                                </button>
                            </form>

                            <p className="text-center mt-3">
                                Already have an account?{" "}
                                <span
                                    onClick={() => navigate("/login")}
                                    style={{
                                        color: "#0d6efd",
                                        cursor: "pointer",
                                        textDecoration: "underline"
                                    }}
                                >
                                    Login
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

export default Register;
