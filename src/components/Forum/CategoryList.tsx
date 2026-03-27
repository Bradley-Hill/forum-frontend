import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesApi } from "../../api/categoryApi";
import Loader from "../Shared/Loader";
import ErrorMessage from "../Shared/ErrorMessage";
import type { categoriesListResponse } from "../../types/api";
import "./CategoryList.scss";

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<
    categoriesListResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
          const categories = await getCategoriesApi();
          setCategories(categories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await getCategoriesApi();
      setCategories(categories);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load categories";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/threads/${categorySlug}`);
  };

  if (loading) {
    return <Loader size="medium" message="Loading categories..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!categories || categories.length === 0) {
    return <p>No categories available.</p>;
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <div key={category.id} className="category-card">
          <div className="category-card-header">
            <h2 
              className="category-card-title"
              onClick={() => handleCategoryClick(category.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(category.slug);
                }
              }}
            >
              {category.name}
            </h2>
          </div>
          <p className="category-card-description">{category.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
