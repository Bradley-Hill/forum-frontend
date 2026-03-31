import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getCategoriesApi, getCategoryThreadsApi } from "../../api/categoryApi";
import {
  threadLockUpdateApi,
  threadStickyUpdateApi,
  deleteThreadApi,
} from "../../api/threadApi";
import type {
  categoriesListResponse,
  categoryThreadsResponse,
} from "../../types/api";
import Button from "../Shared/Button";
import Alert from "../Shared/Alert";
import Modal from "../Shared/Modal";
import Loader from "../Shared/Loader";
import "./ThreadManagement.scss";

type Category = categoriesListResponse["data"][number];
type Thread = categoryThreadsResponse["data"]["threads"][number];

function ThreadManagement() {
  const { csrfToken } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingThread, setDeletingThread] = useState<Thread | null>(null);

  useEffect(() => {
    getCategoriesApi()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setSelectedCategorySlug(data[0].slug);
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load categories",
        ),
      )
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (!selectedCategorySlug) return;
    setLoadingThreads(true);
    setThreads([]);
    getCategoryThreadsApi(selectedCategorySlug, 1, 50)
      .then((data) => setThreads(data.threads))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load threads"),
      )
      .finally(() => setLoadingThreads(false));
  }, [selectedCategorySlug]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleLockToggle = async (thread: Thread) => {
    setActionLoading(thread.id);
    setError(null);
    try {
      await threadLockUpdateApi(
        thread.id,
        { is_locked: !thread.is_locked },
        csrfToken ?? undefined,
      );
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id ? { ...t, is_locked: !t.is_locked } : t,
        ),
      );
      showSuccess(`Thread ${!thread.is_locked ? "locked" : "unlocked"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update thread");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStickyToggle = async (thread: Thread) => {
    setActionLoading(thread.id);
    setError(null);
    try {
      await threadStickyUpdateApi(
        thread.id,
        { is_sticky: !thread.is_sticky },
        csrfToken ?? undefined,
      );
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id ? { ...t, is_sticky: !t.is_sticky } : t,
        ),
      );
      showSuccess(`Thread ${!thread.is_sticky ? "pinned" : "unpinned"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update thread");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingThread) return;
    setActionLoading(deletingThread.id);
    setError(null);
    try {
      await deleteThreadApi(deletingThread.id, csrfToken ?? undefined);
      setThreads((prev) => prev.filter((t) => t.id !== deletingThread.id));
      setDeletingThread(null);
      showSuccess("Thread deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete thread");
    } finally {
      setActionLoading(null);
    }
  };

  if (loadingCategories) return <Loader size="small" message="Loading..." />;

  return (
    <div className="thread-management">
      <div className="thread-management-header">
        <h2 className="thread-management-title">Thread Management</h2>
        <label htmlFor="category-select" className="visually-hidden">
          Select category
        </label>
        <select
          id="category-select"
          className="thread-management-select"
          value={selectedCategorySlug}
          onChange={(e) => setSelectedCategorySlug(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {successMessage && <Alert type="success" message={successMessage} />}

      {loadingThreads ? (
        <Loader size="small" message="Loading threads..." />
      ) : threads.length === 0 ? (
        <p className="thread-management-empty">No threads in this category.</p>
      ) : (
        <table className="thread-management-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Replies</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {threads.map((thread) => (
              <tr key={thread.id}>
                <td data-label="Title" className="thread-management-title-cell">
                  {thread.title}
                </td>
                <td data-label="Author">{thread.author.username}</td>
                <td data-label="Replies">{thread.reply_count}</td>
                <td data-label="Status" className="thread-management-status">
                  {thread.is_sticky && (
                    <span className="status-badge status-badge--sticky">
                      <span aria-hidden="true">📌 </span>Sticky
                    </span>
                  )}
                  {thread.is_locked && (
                    <span className="status-badge status-badge--locked">
                      <span aria-hidden="true">🔒 </span>Locked
                    </span>
                  )}
                  {!thread.is_sticky && !thread.is_locked && (
                    <span className="status-badge status-badge--normal">
                      Normal
                    </span>
                  )}
                </td>
                <td data-label="Actions" className="thread-management-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleStickyToggle(thread)}
                      disabled={actionLoading === thread.id}
                      aria-label={`${thread.is_sticky ? "Unpin" : "Pin"} thread: ${thread.title}`}
                    >
                      {thread.is_sticky ? "Unpin" : "Pin"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleLockToggle(thread)}
                      disabled={actionLoading === thread.id}
                      aria-label={`${thread.is_locked ? "Unlock" : "Lock"} thread: ${thread.title}`}
                    >
                      {thread.is_locked ? "Unlock" : "Lock"}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => setDeletingThread(thread)}
                      disabled={actionLoading === thread.id}
                      aria-label={`Delete thread: ${thread.title}`}
                    >
                      Delete
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={!!deletingThread}
        onClose={() => setDeletingThread(null)}
        title="Delete Thread"
        size="small"
      >
        <div className="modal-content">
          <p>
            Delete <strong>{deletingThread?.title}</strong>? This will also
            delete all posts within it and cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setDeletingThread(null)}
              disabled={!!actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={!!actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ThreadManagement;
