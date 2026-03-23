import Button from "../components/Shared/Button";

function Home() {
  return (
    <div>
      <h1>Forum Home</h1>
      <Button variant="primary" size="medium">
        Click me
      </Button>
      <Button variant="danger" size="small" onClick={() => {}}>
        Delete
      </Button>
      <Button type="submit">Submit</Button>
    </div>
  );
}
export default Home;
