import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/categoryApi";
import type { categoriesListResponse } from "../../types/api";
import Button from "../Shared/Button";
import Alert from "../Shared/Alert";
import ErrorMessage from "../Shared/ErrorMessage";
import CategoryTable from "./CategoryTable";
import CategoryFormModal from "./CategoryFormModal";
import CategoryDeleteModal from "./CategoryDeleteModal";
import "./CategoryManagement.scss";

type Category = categoriesListResponse["data"][number];

function CategoryManagement() {
  const { csrfToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesApi();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreate = async (name: string, description: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await createCategoryApi(name, description, csrfToken ?? undefined);
      setShowCreateModal(false);
      await fetchCategories();
      showSuccess("Category created successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (name: string, description: string) => {
    if (!editingCategory) return;
    setActionLoading(true);
    setError(null);
    try {
      await updateCategoryApi(
        editingCategory.id,
        name,
        description,
        csrfToken ?? undefined,
      );
      setEditingCategory(null);
      await fetchCategories();
      showSuccess("Category updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setActionLoading(true);
    setError(null);
    try {
      await deleteCategoryApi(deletingCategory.id, csrfToken ?? undefined);
      setDeletingCategory(null);
      await fetchCategories();
      showSuccess("Category deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loadingList) {
    return <p className="category-management-loading">Loading categories...</p>;
  }

  return (
    <div className="category-management">
      <div className="category-management-header">
        <h2>Category Management</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          New Category
        </Button>
      </div>

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          closeable
          autoDismiss
          autoDismissTime={3000}
        />
      )}
      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      <CategoryTable
        categories={categories}
        onEdit={setEditingCategory}
        onDelete={setDeletingCategory}
      />

      <CategoryFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        loading={actionLoading}
        title="Create Category"
        submitLabel="Create"
      />

      <CategoryFormModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEdit}
        loading={actionLoading}
        title="Edit Category"
        submitLabel="Save Changes"
        initialName={editingCategory?.name}
        initialDescription={editingCategory?.description}
      />

      <CategoryDeleteModal
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}

export default CategoryManagement;