import { renderAttributes } from "../utils/renderAttribute";

interface InputProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autocomplete?: string;
  [key: string]: any;
}

const Input = ({
  className,
  value = "",
  type = "text",
  ...props
}: InputProps): string => {
  return /*html*/ `
        <input class="input ${className}" type="${type}" value="${value}" ${renderAttributes(props)}/>
    `;
};

export default Input;
