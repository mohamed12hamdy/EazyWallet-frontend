import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";

function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [targetWalletId, setTargetWalletId] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    useEffect(() => {
        fetchBalance();
    }, []);

    const showMessage = (text, type = "info") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 4000);
    };

    const fetchBalance = async () => {
        try {
            const res = await axiosClient.get("/balance");
            const currentBalance = res.data?.data ?? 0;
            setBalance(Number(currentBalance));
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to load balance", "danger");
        }
    };

    const handleDeposit = async () => {
        if (+depositAmount <= 0) return showMessage("Amount must be greater than 0", "warning");

        try {
            const res = await axiosClient.put("/deposit", null, { params: { amount: depositAmount } });
            setBalance(res.data.data);
            showMessage("Deposit successful", "success");
            setDepositAmount("");
        } catch (err) {
            showMessage(err.response?.data?.message || "Deposit failed", "danger");
        }
    };

    const handleWithdraw = async () => {
        if (+withdrawAmount <= 0) return showMessage("Amount must be greater than 0", "warning");

        try {
            const res = await axiosClient.put("/withdraw", null, { params: { amount: withdrawAmount } });
            setBalance(res.data.data);
            showMessage("Withdrawal successful", "success");
            setWithdrawAmount("");
        } catch (err) {
            showMessage(err.response?.data?.message || "Withdrawal failed", "danger");
        }
    };

    const handleTransfer = async () => {
        if (!targetWalletId) return showMessage("Enter target wallet ID", "warning");
        if (+transferAmount <= 0) return showMessage("Amount must be greater than 0", "warning");

        try {
            await axiosClient.post("/transfer", null, {
                params: { targetWalletId, amount: transferAmount },
            });
            showMessage("Transfer successful", "success");
            setTransferAmount("");
            setTargetWalletId("");
            fetchBalance();
        } catch (err) {
            showMessage(err.response?.data?.message || "Transfer failed", "danger");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <>
            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <span className="navbar-brand fw-bold">Wallet Dashboard</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="container my-5">

                <div className="text-center mb-5">
                
                    <div className="card shadow-sm mx-auto mt-3" style={{ maxWidth: "300px" }}>
                        <div className="card-body text-center">
                            <h5 className="card-title text-muted">Current Balance</h5>
                            <h3 className="fw-bold">${Number(balance || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`alert alert-${messageType} text-center`} role="alert">
                        {message}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="row g-4 justify-content-center">

                    {/* Deposit */}
                    <div className="col-sm-12 col-md-5 col-lg-4">
                        <div className="card p-4 shadow-sm h-100">
                            <h5 className="card-title mb-3">Deposit</h5>
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Amount"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                            />
                            <button className="btn btn-success w-100" onClick={handleDeposit}>
                                Deposit
                            </button>
                        </div>
                    </div>

                    {/* Withdraw */}
                    <div className="col-sm-12 col-md-5 col-lg-4">
                        <div className="card p-4 shadow-sm h-100">
                            <h5 className="card-title mb-3">Withdraw</h5>
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Amount"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                            />
                            <button className="btn btn-warning w-100" onClick={handleWithdraw}>
                                Withdraw
                            </button>
                        </div>
                    </div>

                    {/* Transfer */}
                    <div className="col-sm-12 col-md-10 col-lg-8">
                        <div className="card p-4 shadow-sm h-100">
                            <h5 className="card-title mb-3">Transfer</h5>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Target Wallet ID"
                                value={targetWalletId}
                                onChange={(e) => setTargetWalletId(e.target.value)}
                            />
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Amount"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                            />
                            <button className="btn btn-primary w-100" onClick={handleTransfer}>
                                Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-dark text-white text-center py-3 mt-5">
                <small>© 2025 Wallet App — All rights reserved.</small>
            </footer>
        </>
    );
}

export default Dashboard;
