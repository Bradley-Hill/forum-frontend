import { useParams } from "react-router-dom";
import ThreadList from "../components/Forum/ThreadList";

function Threads() {
  const { categorySlug } = useParams() as { categorySlug: string };

  if (!categorySlug) {
    return <div>Error: Category not found</div>;
  }

  return (
    <div>
      <h1>Threads</h1>
      <ThreadList categorySlug={categorySlug} />
    </div>
  );
}

export default Threads;
