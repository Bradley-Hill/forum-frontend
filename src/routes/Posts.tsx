import { useParams } from "react-router-dom";
import PostList from "../components/Forum/PostList";
import PostEditor from "../components/Forum/PostEditor";
import { useState } from "react";

function Posts() {
  const { threadId } = useParams() as { threadId: string };
  const [refreshKey, setRefreshKey] = useState(0);

  if (!threadId) {
    return <div>Error: Thread not found</div>;
  }

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <PostList key={refreshKey} threadId={threadId} />
      <PostEditor threadId={threadId} onPostCreated={handlePostCreated} />
    </div>
  );
}

export default Posts;
