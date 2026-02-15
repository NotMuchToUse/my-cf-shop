import { renderAttributes } from "./../utils/renderAttribute";

type variantsbtn =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type sizesbtn = "default" | "sm" | "lg" | "icon";

type typebtn = "button" | "submit" | "reset";

interface ButtonProps {
  children?: string;
  className?: string;
  variant?: variantsbtn;
  size?: sizesbtn;
  type?: typebtn;
  disabled?: boolean;
  [key: string]: any;
}

const variantStyle: Record<variantsbtn, string> = {
  default: "btn-default",
  destructive: "btn-destructive",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
};

const sizeStyle: Record<sizesbtn, string> = {
  default: "btn-default-size",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-icon",
};

const Button = ({
  children,
  className = "",
  type = "button",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps): string => {
  const variantClass = variantStyle[variant] || variantStyle.default;
  const sizeClass = sizeStyle[size] || sizeStyle.default;

  return /*html*/ `
        <button class="btn ${variantClass} ${sizeClass} ${className}" type="${type}" ${renderAttributes(props)}>
            ${children || ""}
        </button>
    `;
};

export default Button;
