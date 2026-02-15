import Button from "../components/button";
import cartService from "../services/api/cartService";
import { renderAttributes } from "../utils/renderAttribute";
import Container from "./container";

interface NavbarProps {
  children?: string;
  className?: string;
  [key: string]: any;
}

interface NavLinkProps extends NavbarProps {
  href?: string;
}

export default function Navbar({
  className = "",
  children,
  ...props
}: NavbarProps) {
  return /*html*/ `
        <nav class="navbar ${className}" ${renderAttributes(props)}>${children || ""}</nav>
    `;
}

export function NavContainer({
  className = "",
  children,
  ...props
}: NavbarProps): string {
  return /*html*/ `
        ${Container({
          children: /*html*/ `
                <div class="navbar-container ${className}" ${renderAttributes(props)}>${children || ""}</div>
            `,
        })}
    `;
}

export function NavItem({
  className = "",
  children,
  ...props
}: NavbarProps): string {
  return /*html*/ `
        <div class="nav-item ${className}" ${renderAttributes(props)}>${children || ""}</div>
    `;
}

export function NavButton({
  className = "",
  children,
  type = "button",
  ...props
}: NavbarProps): string {
  return /*html*/ `
        <button class="nav-button ${className}" type="${type}" ${renderAttributes(props)}>${children || ""}</button>
    `;
}

export function NavLink({
  className = "",
  children,
  href = "#",
  ...props
}: NavLinkProps): string {
  return /*html*/ `
        <a class="nav-link ${className}" href="${href}" ${renderAttributes(props)}>${children || ""}</a>
    `;
}

// ======================================= CUSTOM ================================== //

export function NavbarSection() {
  return /*html*/ `
     ${Navbar({
       children: /*html*/ `
      ${NavContainer({
        className: "nav-btw",
        children: /*html*/ `
        ${NavItem({ children: "Logo" })}
        <div>
          ${NavLink({ children: "Trang chủ", href: "/" })}
          ${NavLink({ children: "Sản phẩm", href: "/products" })}
          ${NavLink({ children: "Liên hệ", href: "/contact" })}
        </div>
        <div id="auth-zone"></div>
      `,
      })}
    `,
     })}
  `;
}

export function NavAuthZone(user: any) {
  // Lấy số lượng hiện tại ngay lúc render
  const count = cartService.getCount();

  const cartIconHtml = user
    ? /*html*/ `
    <button class="nav-icon-btn" id="nav-cart-btn" style="position: relative; margin-right: 15px; background: none; border: none; cursor: pointer; font-size: 1.2rem;">
      <i class="ri-shopping-cart-line"></i>
      <!-- 👇 Thêm ID vào đây -->
      <span id="cart-badge-count" class="cart-badge" style="position: absolute; top: -5px; right: -8px; background: var(--destructive); color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 50%; font-weight: bold;">
        ${count}
      </span>
    </button>
  `
    : "";

  if (user) {
    return /*html*/ `
      <div class="nav-user-wrapper" style="display: flex; align-items: center;">
        ${cartIconHtml}
        <img src="${user.img || "https://ui-avatars.com/api/?name=" + user.name}" 
             class="nav-avatar" id="nav-avatar-trigger" 
             alt="avatar" referrerpolicy="no-referrer">
      </div>
    `;
  }
  return /*html*/ `
    <button class="btn btn-outline btn-sm" id="btn-open-auth">Đăng nhập</button>
  `;
}
