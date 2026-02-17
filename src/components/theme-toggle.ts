import Button from "./button";

// 1. Hàm khởi tạo (Chạy 1 lần khi load web để set đúng theme)
export const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && systemDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// 2. Logic chuyển đổi
const toggleTheme = () => {
  const html = document.documentElement;
  html.classList.toggle("dark");

  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

(window as any).handleToggleTheme = toggleTheme;

// 4. Component Nút bấm
const ThemeToggle = () => {
  return Button({
    id: "theme-toggle-btn",
    type: "button",
    children: /*html*/ `
      <span class="icon-sun"><i class="ri-sun-line"></i></span>
      <span class="icon-moon"><i class="ri-moon-line"></i></span>
    `,
    className: "btn-ghost theme-btn",
    onclick: "handleToggleTheme()",
    title: "Chuyển đổi giao diện Sáng/Tối",
  });
};

export default ThemeToggle;
