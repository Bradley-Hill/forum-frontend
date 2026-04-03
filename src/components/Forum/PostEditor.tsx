import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { createPostApi } from "../../api/postApi";
import Button from "../Shared/Button";
import Alert from "../Shared/Alert";
import Form from "../Shared/Form";
import MarkdownEditor from "../Shared/MarkdownEditor";
import type { postCreateRequest } from "../../types/api";
import type { PostEditorProps } from "../../types/featureComponents";
import "./PostEditor.scss";

const PostEditor: React.FC<PostEditorProps> = ({ threadId, onPostCreated }) => {
  const { user, csrfToken } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(false);

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    if (!user) {
      setError("You must be logged in to create a post");
      return;
    }

    try {
      setLoading(true);

      const request: postCreateRequest = {
        thread_id: threadId,
        content: content.trim(),
      };
      await createPostApi(request, csrfToken ?? undefined);
      setSuccess(true);
      setContent("");
      onPostCreated?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create post";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="post-editor">
        <Alert
          type="info"
          message="Please log in to post a reply"
          onClose={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="post-editor">
      <h3 className="editor-title">Reply to Thread</h3>
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(undefined)}
        />
      )}
      {success && (
        <Alert
          type="success"
          message="Post created successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      <Form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="content">Your Reply</label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            disabled={loading}
            showPreview={true}
          />
        </div>
        <div className="form-actions">
          <Button
            type="submit"
            disabled={loading || !content.trim()}
            className="primary-btn"
          >
            {loading ? "Posting..." : "Post Reply"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PostEditor;
