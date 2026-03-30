import CategoryManagement from "./CategoryManagement";
import "./AdminPanel.scss";

function AdminPanel() {
  return (
    <div className="admin-panel">
      <div className="admin-panel-section">
        <CategoryManagement />
      </div>
    </div>
  );
}

export default AdminPanel;
