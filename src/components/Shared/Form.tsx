import type { FormProps } from "../../types/sharedComponents";
import "./Form.scss";

const Form: React.FC<FormProps> = ({ onSubmit, children, className = "" }) => {
  return (
    <form className={`form ${className}`.trim()} onSubmit={onSubmit} noValidate>
      {children}
    </form>
  );
};

export default Form;
