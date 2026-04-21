import Button from "../Shared/Button";
import { updateCategoryPositionApi } from "../../api/categoryApi";
import { useAuth } from "../../hooks/useAuth";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import type { CategoryTableProps } from "../../types/featureComponents";

function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const { csrfToken } = useAuth();

  const handleReorderCategory = async (categoryId: string, newPosition: number) => {
    if (typeof newPosition !== "number" || newPosition < 0) {
      alert("Invalid position. Position must be a non-negative number.");
      return;
    }

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

  const sortedCategories = [...categories].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const maxPosition = sortedCategories.length - 1;

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
        {sortedCategories.map((cat) => {
          const isFirst = cat.position === 0;
          const isLast = cat.position === maxPosition;
          const position = typeof cat.position === "number" ? cat.position : 0;

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
                    onClick={() => handleReorderCategory(cat.id, position - 1)}
                    title="Move up"
                    aria-label={`Move ${cat.name} up`}
                    className="category-reorder-btn"
                    type="button"
                  >
                    <MdArrowUpward />
                  </button>
                  <button
                    disabled={isLast}
                    onClick={() => handleReorderCategory(cat.id, position + 1)}
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
