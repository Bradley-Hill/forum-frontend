import AdminPanel from "../components/Admin/AdminPanel";
import "./Admin.scss";

function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p className="admin-subtitle">Manage forum content and settings</p>
      </div>
      <AdminPanel />
    </div>
  );
}

export default Admin;
