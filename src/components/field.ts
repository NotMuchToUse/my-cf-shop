import { renderAttributes } from "../utils/renderAttribute";

interface FieldProps {
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  [key: string]: any;
}

interface InputSpecificProps extends FieldProps {
  as?: "input";
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
}

interface TextareaSpecificProps extends FieldProps {
  as: "textarea";
  rows?: number;
  cols?: number;
  type?: never;
}

type NewFieldProps = InputSpecificProps | TextareaSpecificProps;

export default function Field(props: NewFieldProps): string {
  const {
    as = "input",
    className = "",
    value = "",
    label,
    id,
    ...rest
  } = props;

  if (as === "input") {
    return /*html*/ `
        <div class="field ${className}">
            <label class="field-label" for="${id}">${label}</label>
            <input 
                id="${id}"
                class="field-input ${className}" 
                value="${value}"
                ${renderAttributes(rest)} 
            />
        </div>
    `;
  }

  if (as === "textarea") {
    const textareaProps = rest as TextareaSpecificProps;
    return /*html*/ `
        <div class="field ${className}">
            <label class="field-label" for="${id}">${label}</label>
            <textarea 
                id="${id}"
                class="field-textarea ${className}"
                ${renderAttributes(textareaProps)}
            >
                ${value}
            </textarea>
        </div>
    `;
  }

  return "";
}
