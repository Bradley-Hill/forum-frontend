import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUserApi, getUserThreadsApi } from "../api/userApi";
import Loader from "../components/Shared/Loader";
import ErrorMessage from "../components/Shared/ErrorMessage";
import Pagination from "../components/Shared/Pagination";
import type { getUserResponse, getUserThreadsResponse } from "../types/api";
import "./UserProfile.scss";

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<getUserResponse["data"] | null>(null);
  const [threadsData, setThreadsData] = useState<getUserThreadsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const [userData, threads] = await Promise.all([
          getUserApi(username),
          getUserThreadsApi(username, currentPage, pageSize),
        ]);
        setUser(userData.data);
        setThreadsData(threads);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loader size="medium" message="Loading profile..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <div className="user-profile__avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} />
          ) : (
            user.username[0].toUpperCase()
          )}
        </div>
        <div className="user-profile__info">
          <h1 className="user-profile__username">{user.username}</h1>
          <div className="user-profile__meta">
            <span className={`user-profile__role user-profile__role--${user.role}`}>{user.role}</span>
            <span className="user-profile__joined">
              Joined {new Date(user.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      <div className="user-profile__threads">
        <h2 className="user-profile__section-title">
          Threads by {user.username}
          {threadsData && (
            <span className="user-profile__thread-count">{threadsData.pagination.totalItems}</span>
          )}
        </h2>

        {!threadsData?.threads.length ? (
          <p className="user-profile__empty">No threads yet.</p>
        ) : (
          <>
            <ul className="user-profile__thread-list">
              {threadsData.threads.map((thread) => (
                <li key={thread.id} className="user-profile__thread-item">
                  <Link to={`/post/${thread.id}`} className="user-profile__thread-link">
                    {thread.title}
                  </Link>
                  <span className="user-profile__thread-meta">
                    {thread.reply_count} {thread.reply_count === 1 ? "reply" : "replies"}
                    {" · "}
                    {new Date(thread.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>

            {threadsData.pagination.totalPages > 1 && (
              <Pagination
                currentPage={threadsData.pagination.page}
                totalPages={threadsData.pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={threadsData.pagination.totalItems}
                pageSize={pageSize}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
