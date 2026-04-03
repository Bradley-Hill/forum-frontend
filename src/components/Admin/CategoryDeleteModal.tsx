import Modal from "../Shared/Modal";
import Button from "../Shared/Button";
import type { CategoryDeleteModalProps } from "../../types/featureComponents";

function CategoryDeleteModal({
  category,
  onClose,
  onConfirm,
  loading,
}: CategoryDeleteModalProps) {
  return (
    <Modal
      isOpen={!!category}
      onClose={onClose}
      title="Delete Category"
      size="small"
    >
      <div className="modal-content">
        <p>
          Are you sure you want to delete <strong>{category?.name}</strong>?
        </p>
        <p>
          This will also delete all threads and posts within it. This cannot be
          undone.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CategoryDeleteModal;
