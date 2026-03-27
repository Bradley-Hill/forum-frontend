import { useState, useEffect } from "react";
import { getThreadDetailsApi } from "../../api/threadApi";
import PostItem from "./PostItem";
import Loader from "../Shared/Loader";
import ErrorMessage from "../Shared/ErrorMessage";
import Pagination from "../Shared/Pagination";
import type { threadsApiResponse } from "../../types/api";
import "./PostList.scss";

interface PostListProps {
  threadId: string;
}

const PostList: React.FC<PostListProps> = ({ threadId }) => {
  const [data, setData] = useState<threadsApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

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
            Started by <strong>{thread.author.username}</strong>
          </span>
          <span className="thread-meta-item">
            {thread.reply_count}{" "}
            {thread.reply_count === 1 ? "reply" : "replies"}
          </span>
          {thread.is_locked && (
            <span className="thread-meta-item badge badge-locked">
              🔒 Locked
            </span>
          )}
          {thread.is_sticky && (
            <span className="thread-meta-item badge badge-sticky">
              📌 Sticky
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
    </div>
  );
};

export default PostList;
