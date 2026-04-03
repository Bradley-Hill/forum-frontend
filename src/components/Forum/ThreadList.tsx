import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoryThreadsApi } from "../../api/categoryApi";
import { updateThreadApi, deleteThreadApi } from "../../api/threadApi";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../Shared/Loader";
import ErrorMessage from "../Shared/ErrorMessage";
import Pagination from "../Shared/Pagination";
import Modal from "../Shared/Modal";
import Button from "../Shared/Button";
import TextInput from "../Shared/TextInput";
import type { categoryThreadsResponse, Thread } from "../../types/api";
import type { ThreadListProps } from "../../types/featureComponents";
import "./ThreadList.scss";

const ThreadList: React.FC<ThreadListProps> = ({ categorySlug }) => {
  const { user, csrfToken } = useAuth();
  const [data, setData] = useState<categoryThreadsResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [editingThread, setEditingThread] = useState<Thread | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingThread, setDeletingThread] = useState<Thread | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCategoryThreadsApi(
          categorySlug,
          currentPage,
          pageSize,
        );
        setData(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load threads";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [categorySlug, currentPage]);

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoryThreadsApi(
        categorySlug,
        currentPage,
        pageSize,
      );
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load threads";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const canModifyThread = (thread: Thread) => user?.id === thread.author.id;

  const openEditModal = (thread: Thread) => {
    setEditingThread(thread);
    setEditTitle(thread.title);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingThread || !editTitle.trim()) return;
    setActionLoading(true);
    try {
      await updateThreadApi(
        editingThread.id,
        { title: editTitle.trim() },
        csrfToken ?? undefined,
      );
      setEditingThread(null);
      // Refresh the list
      const response = await getCategoryThreadsApi(
        categorySlug,
        currentPage,
        pageSize,
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update thread");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingThread) return;
    setActionLoading(true);
    try {
      await deleteThreadApi(deletingThread.id, csrfToken ?? undefined);
      setDeletingThread(null);
      const response = await getCategoryThreadsApi(
        categorySlug,
        currentPage,
        pageSize,
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete thread");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader size="medium" message="Loading threads..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!data?.threads) {
    return <p>No threads in this category yet.</p>;
  }

  return (
    <div className="thread-list">
      <div className="thread-list-header">
        <div className="thread-list-row">
          <div className="thread-col-title">Topic</div>
          <div className="thread-col-author">Author</div>
          <div className="thread-col-replies">Replies</div>
          <div className="thread-col-date">Last Post</div>
        </div>
      </div>

      <div className="thread-list-body">
        {data.threads.map((thread) => (
          <div key={thread.id} className="thread-row">
            <div className="thread-col-title">
              <h3 className="thread-title">
                <Link to={`/post/${thread.id}`}>{thread.title}</Link>
              </h3>
              {thread.is_sticky && (
                <span className="thread-badge sticky">
                  <span aria-hidden="true">📌 </span>Sticky
                </span>
              )}
              {thread.is_locked && (
                <span className="thread-badge locked">
                  <span aria-hidden="true">🔒 </span>Locked
                </span>
              )}
              {canModifyThread(thread) && (
                <div className="thread-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    className="thread-action-btn"
                    aria-label={`Edit thread: ${thread.title}`}
                    onClick={() => openEditModal(thread)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    className="thread-action-btn thread-action-btn--danger"
                    aria-label={`Delete thread: ${thread.title}`}
                    onClick={() => setDeletingThread(thread)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
            <div className="thread-col-author">
              <Link
                to={`/users/${thread.author.username}`}
                className="author-link"
              >
                {thread.author.username}
              </Link>
            </div>
            <div className="thread-col-replies">{thread.reply_count}</div>
            <div className="thread-col-date">
              {new Date(thread.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {data.pagination && data.pagination.totalPages > 1 && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={data.pagination.totalItems}
          pageSize={data.pagination.pageSize}
        />
      )}

      <Modal
        isOpen={!!editingThread}
        onClose={() => setEditingThread(null)}
        title="Edit Thread"
        size="small"
      >
        <form onSubmit={handleEditSubmit} className="thread-edit-form">
          <TextInput
            id="edit-thread-title"
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setEditingThread(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={actionLoading || !editTitle.trim()}
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingThread}
        onClose={() => setDeletingThread(null)}
        title="Delete Thread"
        size="small"
      >
        <div className="modal-content">
          <p>
            Are you sure you want to delete{" "}
            <strong>{deletingThread?.title}</strong>?
          </p>
          <p>
            All posts within it will also be deleted. This cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setDeletingThread(null)}
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

export default ThreadList;
