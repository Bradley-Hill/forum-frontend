import { useState } from "react";
import { useParams } from "react-router-dom";
import "./Threads.scss";
import ThreadList from "../components/Forum/ThreadList";
import ThreadEditor from "../components/Forum/ThreadEditor";
import Modal from "../components/Shared/Modal";
import Button from "../components/Shared/Button";

function Threads() {
  const { categorySlug } = useParams() as { categorySlug: string };
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [threadRefreshKey, setThreadRefreshKey] = useState(0);

  if (!categorySlug) {
    return <div>Error: Category not found</div>;
  }

  const handleThreadCreated = () => {
    setThreadRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="threads-header">
        <h1>Threads</h1>
        <Button
          onClick={() => setIsThreadModalOpen(true)}
          variant="primary"
          size="medium"
        >
          Create New Thread
        </Button>
      </div>
      <ThreadList key={threadRefreshKey} categorySlug={categorySlug} />

      <Modal
        isOpen={isThreadModalOpen}
        onClose={() => setIsThreadModalOpen(false)}
        title="Create New Thread"
        size="large"
      >
        <ThreadEditor
          onThreadCreated={handleThreadCreated}
          onClose={() => setIsThreadModalOpen(false)}
          categorySlug={categorySlug}
        />
      </Modal>
    </div>
  );
}

export default Threads;
