import ThemeToggle from "../components/theme-toggle";
import cartService from "../services/api/cartService";
import { renderAttributes } from "../utils/renderAttribute";
import indexStorage from "../utils/localforage";
import Container from "./container";
import showAuthModal, { showUserProfileModal } from "./auth";
import authFireBaseService from "../services/firebase/firebase";

// --- BASE COMPONENTS ---
interface NavbarProps {
  children?: string;
  className?: string;
  [key: string]: any;
}

export default function Navbar({
  className = "",
  children,
  ...props
}: NavbarProps) {
  return /*html*/ `<nav class="navbar ${className}" ${renderAttributes(props)}>${children || ""}</nav>`;
}

export function NavContainer({
  className = "",
  children,
  ...props
}: NavbarProps) {
  return /*html*/ `${Container({
    children: /*html*/ `<div class="navbar-container ${className}" ${renderAttributes(props)}>${children || ""}</div>`,
  })}`;
}

export function NavItem({ className = "", children, ...props }: NavbarProps) {
  return /*html*/ `<div class="nav-item ${className}" ${renderAttributes(props)}>${children || ""}</div>`;
}

export function NavButton({
  className = "",
  children,
  type = "button",
  ...props
}: NavbarProps) {
  return /*html*/ `<button class="nav-button ${className}" type="${type}" ${renderAttributes(props)}>${children || ""}</button>`;
}

const NavLink = ({ href = "#", children = "", className = "" }) =>
  /*html*/ `<a href="${href}" class="nav-link ${className}">${children}</a>`;

// ========================================================================== //
// 1. DESKTOP COMPONENT
// ========================================================================== //
const NavbarDesktop = (user: any, cartCount: number) => {
  const authHtml = user
    ? /*html*/ `
    <div class="desktop-auth-wrapper">
      ${ThemeToggle()}
      <button class="nav-icon-btn" id="nav-cart-desktop" title="Giỏ hàng">
        <i class="ri-shopping-cart-2-line"></i>
        <span class="cart-badge">${cartCount}</span>
      </button>
      <div class="nav-user-wrapper" id="nav-avatar-trigger" title="Tài khoản">
         <img src="${user.img || `https://ui-avatars.com/api/?name=${user.name}`}" class="nav-avatar">
      </div>
    </div>`
    : /*html*/ `
    <div class="desktop-guest-wrapper">
      ${ThemeToggle()}
      <button class="btn-login-desktop" id="btn-open-auth-desktop">Đăng nhập</button>
    </div>`;

  return /*html*/ `
    <div class="navbar-desktop">
      <div class="navbar-content-flex">
        <a href="/" class="logo-text" data-navigo>☕ Cafe Shop</a>
        <div class="desktop-links">
          ${NavLink({ href: "/", children: "Trang chủ" })}
          ${NavLink({ href: "/products", children: "Sản phẩm" })}
          ${NavLink({ href: "/contact", children: "Liên hệ" })}
        </div>
        <div class="desktop-actions">${authHtml}</div>
      </div>
    </div>`;
};

// ========================================================================== //
// 2. MOBILE BAR (Chỉ là cái thanh ngang, KHÔNG chứa Drawer)
// ========================================================================== //
const NavbarMobile = (user: any, cartCount: number) => {
  const cartIconOnBar = user
    ? /*html*/ `
    <button class="nav-icon-btn mobile-cart-icon" id="nav-cart-mobile">
      <i class="ri-shopping-cart-2-line"></i>
      <span class="cart-badge">${cartCount}</span>
    </button>`
    : "";

  return /*html*/ `
    <div class="navbar-mobile">
      <div class="navbar-content-flex">
        <a href="/" class="logo-text" data-navigo>☕ Cafe Shop</a>
        <div class="mobile-bar-right">
          ${cartIconOnBar}
          <button id="mobile-menu-trigger" class="hamburger-btn">
            <i class="ri-menu-line"></i>
          </button>
        </div>
      </div>
    </div>`;
};

// ========================================================================== //
// 3. DRAWER TEMPLATE (Hàm sinh HTML động)
// ========================================================================== //
const getDrawerTemplate = (user: any) => {
  const authContent = user
    ? /*html*/ `
    <div class="mobile-drawer-profile">
      <div class="drawer-user-info" id="drawer-user-trigger">
        <img src="${user.img || `https://ui-avatars.com/api/?name=${user.name}`}" class="drawer-avatar">
        <div class="drawer-user-text">
          <p class="drawer-name">${user.name}</p>
          <p class="drawer-email">${user.email}</p>
        </div>
      </div>
      <div class="drawer-theme-row"><span>Chế độ tối</span> ${ThemeToggle()}</div>
      <button id="btn-logout-mobile" class="btn-logout-mobile">Đăng xuất</button>
    </div>`
    : /*html*/ `
    <div class="mobile-drawer-guest">
       <div class="drawer-theme-row"><span>Chế độ tối</span> ${ThemeToggle()}</div>
       <button id="btn-open-auth-mobile" class="btn-login-mobile">Đăng nhập ngay</button>
    </div>`;

  return /*html*/ `
    <div class="mobile-overlay" id="mobile-overlay"></div>
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="drawer-header">
        <span class="drawer-title">Menu</span>
        <button id="close-drawer-btn" class="close-drawer-btn"><i class="ri-close-line"></i></button>
      </div>
      <div class="drawer-body">
        ${NavLink({ href: "/", children: "Trang chủ" })}
        ${NavLink({ href: "/products", children: "Sản phẩm" })}
        ${NavLink({ href: "/contact", children: "Liên hệ" })}
      </div>
      ${authContent}
    </div>`;
};

// ========================================================================== //
// 4. MAIN LOGIC (Export)
// ========================================================================== //
export const NavbarSection = async () => {
  const user = await indexStorage.get("user-state");
  const count = cartService.getCount();

  return /*html*/ `
    <header class="app-header">
      <div class="container h-100">
        ${NavbarDesktop(user, count)}
        ${NavbarMobile(user, count)}
      </div>
    </header>
  `;
};

// ========================================================================== //
// 5. EVENT HANDLERS (Logic Mount/Unmount Drawer)
// ========================================================================== //
export const initNavbarEvents = async () => {
  const trigger = document.getElementById("mobile-menu-trigger");
  if (!trigger) return;

  const user = await indexStorage.get("user-state");

  // Xử lý mở Drawer
  trigger.addEventListener("click", () => {
    // 1. Inject HTML vào cuối body (Thoát khỏi Header)
    document.body.insertAdjacentHTML("beforeend", getDrawerTemplate(user));

    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("mobile-overlay");
    const closeBtn = document.getElementById("close-drawer-btn");

    // 2. Kích hoạt Animation (Thêm class open)
    requestAnimationFrame(() => {
      drawer?.classList.add("open");
      overlay?.classList.add("open");
    });

    // Hàm đóng Drawer
    const closeDrawer = () => {
      drawer?.classList.remove("open");
      overlay?.classList.remove("open");

      // Đợi 300ms transition xong mới xóa khỏi DOM
      setTimeout(() => {
        drawer?.remove();
        overlay?.remove();
      }, 300);
    };

    // Gán sự kiện đóng
    closeBtn?.addEventListener("click", closeDrawer);
    overlay?.addEventListener("click", closeDrawer);

    // Đóng drawer khi click vào link chuyển trang
    const links = drawer?.querySelectorAll("a");
    links?.forEach((link) => link.addEventListener("click", closeDrawer));

    // Gán sự kiện cho các nút chức năng trong Drawer
    attachDrawerAuthEvents(user, closeDrawer);
  });
};

// Logic click cho các nút Auth bên trong Drawer (Vì nó sinh ra sau)
const attachDrawerAuthEvents = (user: any, closeDrawerCallback: () => void) => {
  if (user) {
    // Click Avatar -> Profile
    document
      .getElementById("drawer-user-trigger")
      ?.addEventListener("click", () => {
        closeDrawerCallback();
        setTimeout(() => showUserProfileModal(user), 100);
      });

    // Click Logout
    document
      .getElementById("btn-logout-mobile")
      ?.addEventListener("click", async () => {
        await authFireBaseService.logout();
        window.location.reload();
      });
  } else {
    // Click Login
    document
      .getElementById("btn-open-auth-mobile")
      ?.addEventListener("click", () => {
        closeDrawerCallback();
        showAuthModal("login");
      });
  }
};
