import Button from "../Shared/Button";
import { updateCategoryPositionApi } from "../../api/categoryApi";
import { useAuth } from "../../hooks/useAuth";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import type { CategoryTableProps } from "../../types/featureComponents";

function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const { csrfToken } = useAuth();

  const handleReorderCategory = async (categoryId: string, newPosition: number) => {
    try {
      await updateCategoryPositionApi(categoryId, newPosition, csrfToken ?? undefined);
      window.location.reload();
    } catch (error) {
      console.error("Failed to reorder category:", error);
      alert("Failed to reorder category. Please try again.");
    }
  };

  if (categories.length === 0) {
    return (
      <p className="category-management-empty">
        No categories yet. Create one above.
      </p>
    );
  }

  return (
    <table className="category-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Slug</th>
          <th scope="col">Description</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat, index) => {
          const isFirst = index === 0;
          const isLast = index === categories.length - 1;

          return (
            <tr key={cat.id}>
              <td data-label="Name">{cat.name}</td>
              <td data-label="Slug" className="category-slug">
                {cat.slug}
              </td>
              <td data-label="Description">{cat.description}</td>
              <td data-label="Actions">
                <div className="category-actions">
                  <button
                    disabled={isFirst}
                    onClick={() => handleReorderCategory(cat.id, cat.position - 1)}
                    title="Move up"
                    aria-label={`Move ${cat.name} up`}
                    className="category-reorder-btn"
                    type="button"
                  >
                    <MdArrowUpward />
                  </button>
                  <button
                    disabled={isLast}
                    onClick={() => handleReorderCategory(cat.id, cat.position + 1)}
                    title="Move down"
                    aria-label={`Move ${cat.name} down`}
                    className="category-reorder-btn"
                    type="button"
                  >
                    <MdArrowDownward />
                  </button>
                  <Button
                    variant="secondary"
                    aria-label={`Edit category: ${cat.name}`}
                    onClick={() => onEdit(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    aria-label={`Delete category: ${cat.name}`}
                    onClick={() => onDelete(cat)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CategoryTable;
