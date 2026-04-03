import { useState } from "react";
import Button from "../Shared/Button";
import Modal from "../Shared/Modal";
import ProfileChangePassword from "./ProfileChangePassword";
import type { ProfileDangerProps } from "../../types/featureComponents";
import "./ProfileDanger.scss";

function ProfileDanger({ loading, onDelete }: ProfileDangerProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="profile-danger">
      <ProfileChangePassword />

      <div className="profile-danger-item">
        <div className="profile-danger-info">
          <h3>Delete Account</h3>
          <p>
            Permanently delete your account and all associated data. This cannot
            be undone.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={() => setShowConfirm(true)}
          disabled={loading}
        >
          Delete Account
        </Button>
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete Account"
        size="small"
      >
        <div className="modal-content">
          <p>Are you sure you want to permanently delete your account?</p>
          <p>
            All your threads and posts will also be deleted.{" "}
            <strong>This cannot be undone.</strong>
          </p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={loading}
              onClick={() => {
                setShowConfirm(false);
                onDelete();
              }}
            >
              {loading ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileDanger;
