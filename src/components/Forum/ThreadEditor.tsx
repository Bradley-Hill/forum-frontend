import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getCategoriesApi } from "../../api/categoryApi";
import { createThreadApi } from "../../api/threadApi";
import Button from "../Shared/Button";
import Alert from "../Shared/Alert";
import Loader from "../Shared/Loader";
import ErrorMessage from "../Shared/ErrorMessage";
import Form from "../Shared/Form";
import TextInput from "../Shared/TextInput";
import type {
  createThreadRequest,
  categoriesListResponse,
} from "../../types/api";
import "./ThreadEditor.scss";

interface ThreadEditorProps {
  onThreadCreated?: () => void;
  onClose?: () => void;
  categorySlug?: string;
}

const ThreadEditor: React.FC<ThreadEditorProps> = ({
  onThreadCreated,
  onClose,
  categorySlug,
}) => {
  const { user, csrfToken } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<
    categoriesListResponse["data"] | null
  >(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | undefined>(
    undefined,
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(undefined);
        const cats = await getCategoriesApi();
        setCategories(cats);
        if (cats && cats.length > 0) {
          if (categorySlug) {
            const matchedCat = cats.find((c) => c.slug === categorySlug);
            if (matchedCat) {
              setSelectedCategoryId(matchedCat.id);
            } else {
              setSelectedCategoryId(cats[0].id);
            }
          } else {
            setSelectedCategoryId(cats[0].id);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load categories";
        setCategoriesError(errorMessage);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!selectedCategoryId) {
      setError("Please select a category");
      return;
    }

    if (!title.trim()) {
      setError("Thread title cannot be empty");
      return;
    }

    if (!content.trim()) {
      setError("Thread content cannot be empty");
      return;
    }

    if (!user) {
      setError("You must be logged in to create a thread");
      return;
    }

    try {
      setLoading(true);

      const request: createThreadRequest = {
        category_id: selectedCategoryId,
        title: title.trim(),
        content: content.trim(),
      };
      const response = await createThreadApi(request, csrfToken ?? undefined);

      onClose?.();

      onThreadCreated?.();

      navigate(`/post/${response.data.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create thread";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return <Loader size="medium" message="Loading categories..." />;
  }

  if (categoriesError) {
    return (
      <ErrorMessage
        message={categoriesError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <Alert
          type="info"
          message="Please log in to create a thread"
          onClose={() => {}}
        />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <p style={{ padding: "1rem" }}>No categories available.</p>;
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(undefined)}
        />
      )}

      <Form onSubmit={handleSubmit} className="thread-editor-form">
        <div className="form-group">
          <label>Thread Location</label>
          <div className="category-indicator">
            <span className="location-label">Creating in:</span>
            <span className="category-name">
              {categories?.find((c) => c.id === selectedCategoryId)?.name ||
                "Loading..."}
            </span>
          </div>
        </div>

        <TextInput
          id="title"
          label="Thread Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder="Enter thread title..."
          required
          helperText={`${title.length}/255 characters`}
        />

        <div className="form-group">
          <label htmlFor="content">First Post Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            placeholder="Write your first post here..."
            rows={8}
            className="editor-textarea"
            required
          />
          <span className="char-count">{content.length} characters</span>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="secondary-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              loading || !selectedCategoryId || !title.trim() || !content.trim()
            }
            className="primary-btn"
          >
            {loading ? "Creating..." : "Create Thread"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ThreadEditor;
