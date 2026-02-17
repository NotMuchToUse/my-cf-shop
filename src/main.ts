import Navigo from "navigo";
import HomePage from "./pages/Home";
import ContactPage from "./pages/Contact";
import ProductPage from "./pages/Product";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  checkFirebaseConnection,
} from "./services/firebase/firebaseConfig";
import { type NavigoMatch, type PageRender } from "./types/interface";
import { InputMask } from "./utils/cleve";
import indexStorage from "./utils/localforage";
import logger from "./utils/logger";
import showAuthModal, { showUserProfileModal } from "./layouts/auth";
import { initNavbarEvents, NavbarSection } from "./layouts/navbar";
import {
  CartSheet,
  initCartEvents,
  toggleCartSheet,
} from "./layouts/productmodal";
import { initTheme } from "./components/theme-toggle";

// import authService from "./services/firebase/firebase";
// import cartService from "./services/cartService";
// import { seedProducts } from "./services/firebase/seed";

checkFirebaseConnection();
initTheme();

const router = new Navigo("/", { linksSelector: "a", hash: true });
const app = document.getElementById("app");

// =============================================================================
// 2. LOGIC RENDER LẠI UI KHI AUTH THAY ĐỔI (QUAN TRỌNG)
// =============================================================================

const refreshNavbar = async () => {
  const header = document.querySelector("header.app-header");
  if (header) {
    const newNavbarHtml = await NavbarSection();
    header.outerHTML = newNavbarHtml;

    initNavbarEvents();

    const user = await indexStorage.get("user-state");
    attachAuthEvents(user);
  }
};

// =============================================================================
// 3. HÀM GÁN SỰ KIỆN CLICK (Cho cả Desktop & Mobile)
// =============================================================================

const attachAuthEvents = (user: any) => {
  const cartBtns = document.querySelectorAll(
    "#nav-cart-desktop, #nav-cart-mobile",
  );
  cartBtns.forEach((btn) =>
    btn.addEventListener("click", () => toggleCartSheet(true)),
  );

  if (user) {
    document
      .getElementById("nav-avatar-trigger")
      ?.addEventListener("click", () => {
        showUserProfileModal(user);
      });
  } else {
    document
      .getElementById("btn-open-auth-desktop")
      ?.addEventListener("click", () => {
        showAuthModal("login");
      });
  }
};

// =============================================================================
// 4. MAIN RENDER FUNCTION
// =============================================================================

const render = async (content: PageRender, match: NavigoMatch | null) => {
  if (!app) return;

  app.innerHTML = await content.render();

  await initNavbarEvents();

  const savedUser = await indexStorage.get("user-state");
  attachAuthEvents(savedUser);

  if (!document.getElementById("cart-sheet")) {
    document.body.insertAdjacentHTML("beforeend", CartSheet());
    initCartEvents();
  }

  if (content.afterRender) {
    await content.afterRender(match);
  }

  // Init Input Mask
  if (document.querySelector("#input-phone")) InputMask.phone("#input-phone");
  if (document.querySelector("#input-money"))
    InputMask.currency("#input-money");
  if (document.querySelector("#input-dob")) InputMask.date("#input-dob");
};

// =============================================================================
// 5. ROUTER & LISTENERS
// =============================================================================

router.on({
  "/": (match: NavigoMatch) => render(HomePage, match),
  "/products": (match: NavigoMatch) => render(ProductPage, match),
  "/contact": (match: NavigoMatch) => render(ContactPage, match),
});

router.notFound(() => render(HomePage, null));
router.resolve();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userData = {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      img: user.photoURL,
    };
    await indexStorage.set("user-state", userData);
    logger.info("Chào mừng:", userData.name);
  } else {
    await indexStorage.remove("user-state");
    logger.info("Khách");
  }

  await refreshNavbar();
});

window.addEventListener("cart-change", async () => {
  await refreshNavbar();
});

// Seed Data (Chạy 1 lần rồi comment lại nếu cần)
/*
(async () => {
  logger.info("Đang tải sản phẩm...");
  const data = await seedProducts();
  logger.success("Đã lấy được sản phẩm:", data);
})();
*/
