import { renderAttributes } from "../utils/renderAttribute";

interface TextareaProps {
  className?: string;
  placeholder?: string;
  value?: string | number;
  name?: string;
  id?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  autocomplete?: string;
  [key: string]: any;
}

const Textarea = ({
  className = "",
  value = "",
  rows = 3,
  ...props
}: TextareaProps): string => {
  return /*html*/ `
        <textarea class="textarea ${className}" rows="${rows}" ${renderAttributes(props)}>${value}</textarea>
    `;
};

export default Textarea;
