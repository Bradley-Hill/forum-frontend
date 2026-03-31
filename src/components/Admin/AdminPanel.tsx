import CategoryManagement from "./CategoryManagement";
import ThreadManagement from "./ThreadManagement";
import "./AdminPanel.scss";

function AdminPanel() {
  return (
    <div className="admin-panel">
      <div className="admin-panel-section">
        <CategoryManagement />
      </div>
      <div className="admin-panel-section">
        <ThreadManagement />
      </div>
    </div>
  );
}

export default AdminPanel;
