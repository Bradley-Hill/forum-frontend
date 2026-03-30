import { useState, useEffect } from "react";
import Modal from "../Shared/Modal";
import TextInput from "../Shared/TextInput";
import Button from "../Shared/Button";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  loading: boolean;
  title: string;
  submitLabel: string;
  initialName?: string;
  initialDescription?: string;
}

function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  title,
  submitLabel,
  initialName = "",
  initialDescription = "",
}: CategoryFormModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    await onSubmit(name.trim(), description.trim());
  };

  const isValid = name.trim().length > 0 && description.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <form onSubmit={handleSubmit} className="category-form">
        <TextInput
          id="category-name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextInput
          id="category-description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isValid}
          >
            {loading ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryFormModal;
