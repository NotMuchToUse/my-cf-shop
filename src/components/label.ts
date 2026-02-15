import { renderAttributes } from "../utils/renderAttribute";

interface LabelProps {
  className?: string;
  children?: string;
  htmlFor?: string;
  [key: string]: any;
}

const Label = ({
  className = "",
  htmlFor,
  children,
  ...props
}: LabelProps): string => {
  return /*html*/ `
        <label class="label ${className}" for="${htmlFor}" ${renderAttributes(props)}>${children || ""}</label>
    `;
};

export default Label;
