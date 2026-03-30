import Button from "../Shared/Button";
import type { categoriesListResponse } from "../../types/api";

type Category = categoriesListResponse["data"][number];

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

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
          <th>Name</th>
          <th>Slug</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td>{cat.name}</td>
            <td className="category-slug">{cat.slug}</td>
            <td>{cat.description}</td>
            <td className="category-actions">
              <Button variant="secondary" onClick={() => onEdit(cat)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => onDelete(cat)}>
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
