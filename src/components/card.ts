import { renderAttributes } from "../utils/renderAttribute";

interface CardProps {
  children?: string;
  className?: string;
  [key: string]: any;
}

interface CardTitle extends CardProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps): string {
  return /*html*/ `
        <div class="card ${className}" ${renderAttributes(props)}>
            ${children || ""}
        </div>
    `;
}

export function CardHeader({
  children,
  className = "",
  ...props
}: CardProps): string {
  return /*html*/ `
        <div class="card-header ${className}" ${renderAttributes(props)}>
            ${children || ""}
        </div>
    `;
}

export function CardTitle({
  children,
  className = "",
  as = "h3",
  ...props
}: CardTitle): string {
  return /*html*/ `
        <${as} class="card-title ${className}" ${renderAttributes(props)}>
            ${children || ""}
        </${as}>
    `;
}

export function CardDescription({
  children,
  className = "",
  ...props
}: CardProps): string {
  return /*html*/ `
        <p class="card-description ${className}" ${renderAttributes(props)}>
            ${children || ""}
        </p>
    `;
}

export function CardContent({
  children,
  className = "",
  ...props
}: CardProps): string {
  return /*html*/ `
        <span class="card-content ${className}" ${renderAttributes(props)}>
            ${children || ""}
        </span>
    `;
}

export function CardFooter({
  children,
  className = "",
  ...props
}: CardProps): string {
  return /*html*/ `
        <div class="card-footer ${className}" ${renderAttributes(props)}>
            ${children || ""}
        </div>
    `;
}
