
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
   
    localStorage.removeItem("token");
      navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow p-4 text-center">
            <h1 className="mb-4">Welcome to Your Dashboard 🎉</h1>
            <p>This is a placeholder page after login.</p>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
