import { useState } from "react";
import Button from "../components/Shared/Button";
import TextInput from "../components/Shared/TextInput";
import PasswordInput from "../components/Shared/PasswordInput";
import Form from "../components/Shared/Form";
import Alert from "../components/Shared/Alert";
import Loader from "../components/Shared/Loader";
import ErrorMessage from "../components/Shared/ErrorMessage";
import Modal from "../components/Shared/Modal";
import Pagination from "../components/Shared/Pagination";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"small" | "medium" | "large">(
    "medium",
  );
  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const [showApiError, _setShowApiError] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 25;
  const totalItems = 247;
  const pageSize = 10;

  const emailError = email === "" ? "Email is required" : "";
  const passwordError =
    password === ""
      ? "Password is required"
      : password.length < 8
        ? "Password must be at least 8 characters"
        : "";

  // Simulate API error response
  const apiError = {
    code: "THREAD_NOT_FOUND",
    message: "Failed to load thread",
    details:
      "The thread with ID 'abc123' does not exist or was deleted by the author.",
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    console.log(`Retrying API call... (attempt ${retryCount + 1})`);
    // In real app: await fetchThread(threadId);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted with email:", email, "password:", password);
    // In real app: call login/register API
  };

  return (
    <div>
      <h1>Forum Home</h1>

      <h2>Test Components :</h2>
      <h3>Error Message</h3>
      {showApiError && (
        <ErrorMessage
          code={apiError.code}
          message={apiError.message}
          details={apiError.details}
          onRetry={handleRetry}
          showDetails
        />
      )}

      <h3>Alerts</h3>
      {/* Alert Examples */}
      {showSuccessAlert && (
        <Alert
          type="success"
          message="Account created successfully!"
          onClose={() => setShowSuccessAlert(false)}
          closeable
        />
      )}

      {showErrorAlert && (
        <Alert
          type="error"
          message="Failed to load threads. Please try again."
          onClose={() => setShowErrorAlert(false)}
          closeable
        />
      )}

      <Alert
        type="warning"
        message="This forum will be down for maintenance tonight at 10 PM."
        closeable
      />

      <Alert
        type="info"
        message="You have 3 new messages."
        autoDismiss
        autoDismissTime={4000}
      />

      {/* Button Examples */}
      <h3>Buttons</h3>
      <Button variant="primary" size="medium">
        Click me
      </Button>
      <Button variant="danger" size="small" onClick={() => {}}>
        Delete
      </Button>
      <Button type="submit">Submit</Button>

      {/* TextInput Example */}
      <h3>Text Input</h3>
      <TextInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        helperText="We'll never share your email"
        error={emailError}
      />

      {/* PasswordInput Example */}
      <h3>Password Input</h3>
      <PasswordInput
        id="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        helperText="Min 8 characters, supports copy/paste"
        error={passwordError}
      />

      {/* Loader Examples */}
      <h3>Loaders</h3>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <p>Small Loader:</p>
          <Loader size="small" message="Loading..." />
        </div>
        <div>
          <p>Medium Loader:</p>
          <Loader size="medium" message="Fetching threads..." />
        </div>
        <div>
          <p>Large Loader:</p>
          <Loader size="large" message="Weaving Threads..." />
        </div>
      </div>

      {/* Modal Examples */}
      <h3>Modal</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Button
          onClick={() => {
            setModalSize("small");
            setIsModalOpen(true);
          }}
        >
          Open Small Modal
        </Button>
        <Button
          onClick={() => {
            setModalSize("medium");
            setIsModalOpen(true);
          }}
        >
          Open Medium Modal
        </Button>
        <Button
          onClick={() => {
            setModalSize("large");
            setIsModalOpen(true);
          }}
        >
          Open Large Modal
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Thread"
        size={modalSize}
      >
        <p>This is a modal dialog example. Try:</p>
        <ul>
          <li>Clicking the X button to close</li>
          <li>Pressing Escape key to close</li>
          <li>Clicking outside the modal to close</li>
          <li>Tab through buttons to test focus management</li>
        </ul>
        <TextInput
          id="thread-title"
          label="Thread Title"
          placeholder="Enter thread title..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="modal-footer">
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Create Thread
          </Button>
        </div>
      </Modal>

      {/* Pagination Example */}
      <h3>Pagination</h3>
      <p>Current page: {currentPage} | Showing threads (realistic demo)</p>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        pageSize={pageSize}
      />

      {/* Form Example */}
      <h3>Form</h3>
      <Form onSubmit={handleFormSubmit}>
        <TextInput
          id="form-email"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          helperText="We'll use this for your account"
        />
        <PasswordInput
          id="form-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          helperText="Min 8 characters"
        />
        <Button type="submit" variant="primary">
          Submit Form
        </Button>
      </Form>
    </div>
  );
}

export default Home;
