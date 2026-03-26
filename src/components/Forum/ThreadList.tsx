import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryThreadsApi } from "../../api/categoryApi";
import Loader from "../Shared/Loader";
import ErrorMessage from "../Shared/ErrorMessage";
import Pagination from "../Shared/Pagination";
import type { categoryThreadsResponse } from "../../types/api";
import "./ThreadList.scss";

interface ThreadListProps {
  categorySlug: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ categorySlug }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<categoryThreadsResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  const handleThreadClick = (threadId: string) => {
    navigate(`/post/${threadId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <h3
                className="thread-title"
                onClick={() => handleThreadClick(thread.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleThreadClick(thread.id);
                  }
                }}
              >
                {thread.title}
              </h3>
              {thread.is_sticky && (
                <span className="thread-badge sticky">📌 Sticky</span>
              )}
              {thread.is_locked && (
                <span className="thread-badge locked">🔒 Locked</span>
              )}
            </div>
            <div className="thread-col-author">{thread.author.username}</div>
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
    </div>
  );
};

export default ThreadList;
