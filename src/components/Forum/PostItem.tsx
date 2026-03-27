import { useMemo } from "react";
import type { Post } from "../../types/api";
import "./PostItem.scss";

interface PostItemProps {
  post: Post;
  postNumber: number;
}

const PostItem: React.FC<PostItemProps> = ({ post, postNumber }) => {
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
              })})
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
            <p className="author-username">{post.author.username}</p>
          </div>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
        </div>
      </div>

      <div className="post-footer">
        <button className="post-action-btn">Reply With Quote</button>
      </div>
    </div>
  );
};

export default PostItem;
