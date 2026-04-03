import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { PostItemProps } from "../../types/featureComponents";
import Button from "../Shared/Button";
import MarkdownDisplay from "../Shared/MarkdownDisplay";
import "./PostItem.scss";

const PostItem: React.FC<PostItemProps> = ({
  post,
  postNumber,
  canModify = false,
  onEdit,
  onDelete,
}) => {
  const formattedDate = useMemo(() => {
    return new Date(post.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [post.created_at]);

  const isEdited = post.updated_at !== post.created_at;

  return (
    <div className="post-item">
      <div className="post-header">
        <div className="post-number">#{postNumber}</div>
        <div className="post-meta-info">
          <span className="post-date">{formattedDate}</span>
          {isEdited && (
            <span className="post-edited">
              (Last edited by {post.author.username} on{" "}
              {new Date(post.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              )
            </span>
          )}
        </div>
      </div>

      <div className="post-body">
        <div className="post-author-section">
          <div className="author-avatar">
            <span className="avatar-placeholder">
              {post.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="author-info">
            <Link
              to={`/users/${post.author.username}`}
              className="author-link author-username"
            >
              {post.author.username}
            </Link>
          </div>
        </div>

        <div className="post-content">
          <MarkdownDisplay content={post.content} />
        </div>
      </div>

      {canModify && (
        <div className="post-footer">
          <Button
            variant="secondary"
            aria-label={`Edit post #${postNumber}`}
            onClick={() => onEdit?.(post)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            aria-label={`Delete post #${postNumber}`}
            onClick={() => onDelete?.(post)}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
