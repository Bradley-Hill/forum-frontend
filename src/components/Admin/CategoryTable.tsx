import Button from "../Shared/Button";
import type { categoriesListResponse } from "../../types/api";
import type { CategoryTableProps } from "../../types/featureComponents";

type Category = categoriesListResponse["data"][number];

function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
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
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td data-label="Name">{cat.name}</td>
            <td data-label="Slug" className="category-slug">
              {cat.slug}
            </td>
            <td data-label="Description">{cat.description}</td>
            <td data-label="Actions" className="category-actions">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CategoryTable;
