import Navigo from "navigo";
import HomePage from "./pages/Home";
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
import { NavAuthZone } from "./layouts/navbar";
import ContactPage from "./pages/Contact";
// import productService from "./services/api/productService";
import ProductPage from "./pages/Product";
import {
  CartSheet,
  initCartEvents,
  toggleCartSheet,
} from "./layouts/productmodal";
import { seedProducts } from "./services/firebase/seed";

checkFirebaseConnection();

const router = new Navigo("/", { linksSelector: "a", hash: false });

const app = document.getElementById("app");

const render = async (content: PageRender, match: NavigoMatch | null) => {
  if (!app) {
    console.error(
      "Lỗi: Không tìm thấy thẻ <div id='app'></div> trong index.html",
    );
    return;
  }
  app.innerHTML = await content.render();

  if (content.afterRender) {
    await content.afterRender(match);
  }

  if (!document.getElementById("cart-sheet")) {
    document.body.insertAdjacentHTML("beforeend", CartSheet());
    initCartEvents();
  }

  if (document.querySelector("#input-phone")) InputMask.phone("#input-phone");
  if (document.querySelector("#input-money"))
    InputMask.currency("#input-money");
  if (document.querySelector("#input-dob")) InputMask.date("#input-dob");
};

router.on({
  "/": (match: NavigoMatch) => render(HomePage, match),
  "/products": (match: NavigoMatch) => render(ProductPage, match),
  "/contact": (match: NavigoMatch) => render(ContactPage, match),
});

router.notFound(() => render(HomePage, null));

router.resolve();

const attachAuthEvents = (user: any) => {
  if (user) {
    const avatar = document.getElementById("nav-avatar-trigger");
    avatar?.addEventListener("click", () => {
      showUserProfileModal(user);
    });

    document.getElementById("nav-cart-btn")?.addEventListener("click", () => {
      toggleCartSheet(true);
    });
  } else {
    document.getElementById("btn-open-auth")?.addEventListener("click", () => {
      showAuthModal("login");
    });
  }
};

onAuthStateChanged(auth, async (user) => {
  const authZone = document.getElementById("auth-zone");

  if (user) {
    const userData = {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      img: user.photoURL,
    };
    await indexStorage.set("user-state", userData);

    // Cập nhật UI nếu đang ở trên trang có Navbar
    if (authZone) {
      authZone.innerHTML = NavAuthZone(userData);
      attachAuthEvents(userData);
    }
    logger.info("Chào mừng:", userData.name);
  } else {
    await indexStorage.remove("user-state");
    if (authZone) {
      authZone.innerHTML = NavAuthZone(null);
      attachAuthEvents(null);
    }
    logger.info("Khách");
  }
});

logger.info("Biến môi trường", import.meta.env);

(async () => {
  logger.info("Đang tải sản phẩm...");
  const data = await seedProducts();
  logger.success("Đã lấy được sản phẩm:", data);
})();
