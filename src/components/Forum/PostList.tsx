import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getThreadDetailsApi } from "../../api/threadApi";
import { updatePostApi, deletePostApi } from "../../api/postApi";
import { useAuth } from "../../hooks/useAuth";
import PostItem from "./PostItem";
import Loader from "../Shared/Loader";
import ErrorMessage from "../Shared/ErrorMessage";
import Pagination from "../Shared/Pagination";
import Modal from "../Shared/Modal";
import Button from "../Shared/Button";
import type { threadsApiResponse, Post } from "../../types/api";
import type { PostListProps } from "../../types/featureComponents";
import "./PostList.scss";

const PostList: React.FC<PostListProps> = ({ threadId }) => {
  const [data, setData] = useState<threadsApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { user, csrfToken } = useAuth();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const response = await getThreadDetailsApi(
          threadId,
          currentPage,
          pageSize,
        );
        setData(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load thread";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadDetails();
  }, [threadId, currentPage]);

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await getThreadDetailsApi(
        threadId,
        currentPage,
        pageSize,
      );
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load thread";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canModifyPost = (post: Post) => user?.id === post.author.id;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editContent.trim()) return;
    setActionLoading(true);
    try {
      await updatePostApi(
        editingPost.id,
        editContent.trim(),
        csrfToken ?? undefined,
      );
      setEditingPost(null);
      const response = await getThreadDetailsApi(
        threadId,
        currentPage,
        pageSize,
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;
    setActionLoading(true);
    try {
      await deletePostApi(deletingPost.id, csrfToken ?? undefined);
      setDeletingPost(null);
      const response = await getThreadDetailsApi(
        threadId,
        currentPage,
        pageSize,
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader size="medium" message="Loading posts..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!data || !data.thread) {
    return <p>Thread not found.</p>;
  }

  const { thread, posts, pagination } = data;
  const startPostNumber = (pagination.page - 1) * pagination.pageSize + 1;

  return (
    <div className="post-list">
      <div className="thread-header">
        <h1 className="thread-title">{thread.title}</h1>
        <div className="thread-meta">
          <span className="thread-meta-item">
            Started by{" "}
            <strong>
              <Link to={`/users/${thread.author.username}`}>
                {thread.author.username}
              </Link>
            </strong>
          </span>
          <span className="thread-meta-item">
            {thread.reply_count}{" "}
            {thread.reply_count === 1 ? "reply" : "replies"}
          </span>
          {thread.is_locked && (
            <span className="thread-meta-item badge badge-locked">
              <span aria-hidden="true">🔒 </span>Locked
            </span>
          )}
          {thread.is_sticky && (
            <span className="thread-meta-item badge badge-sticky">
              <span aria-hidden="true">📌 </span>Sticky
            </span>
          )}
        </div>
      </div>

      <div className="posts-container">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostItem
                key={post.id}
                post={post}
                postNumber={startPostNumber + index}
                canModify={canModifyPost(post)}
                onEdit={(p) => {
                  setEditingPost(p);
                  setEditContent(p.content);
                }}
                onDelete={(p) => setDeletingPost(p)}
              />
            ))}
          </>
        ) : (
          <p className="no-posts">No posts in this thread.</p>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        title="Edit Post"
        size="medium"
      >
        <form onSubmit={handleEditSubmit} className="post-edit-form">
          <label htmlFor="edit-post-content" className="visually-hidden">
            Edit post content
          </label>
          <textarea
            id="edit-post-content"
            className="post-edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={6}
            required
          />
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setEditingPost(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={actionLoading || !editContent.trim()}
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        title="Delete Post"
        size="small"
      >
        <div className="modal-content">
          <p>
            Are you sure you want to delete this post? This cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setDeletingPost(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostList;
