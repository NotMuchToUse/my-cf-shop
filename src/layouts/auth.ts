import Swal from "sweetalert2";
import Field from "../components/field";
import authService from "../services/firebase/firebase";
import logger from "../utils/logger";
import Button from "../components/button";
import type { Order } from "../types/interface";
import { orderRepo } from "../services/firebase/repository";
// import orderService from "../services/api/orderService";

type authTypes = "login" | "signup";

// ====================================================== BASE ======================================================= //

export default function showAuthModal(
  mode: authTypes = "login",
  initialEmail = "",
) {
  const isLogin = mode === "login";

  Swal.fire({
    title: isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản mới",
    html: AuthFormTemplate(mode, initialEmail),
    confirmButtonText: isLogin ? "Đăng Nhập" : "Đăng Ký",
    focusConfirm: false,
    showCloseButton: true,
    customClass: {
      confirmButton: "btn-auth-confirm",
    },
    didOpen: () => {
      processGoogleAuth(mode);
    },
    preConfirm: () => {
      return processAuthAction(mode);
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const user = result.value;
      Swal.fire({
        title: "Thành công!",
        text: `Chào mừng ${user.displayName || user.email} đã quay trở lại.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Bạn nên phát ra một Event hoặc gọi hàm render lại giao diện ở đây
      logger.success("User logged in:", user);
    }
  });
}

export const showUserProfileModal = async (user: any) => {
  let orders: Order[] = [];

  try {
    Swal.showLoading();
    orders = await orderRepo.getOrdersByUser(user.id);
  } catch (error: any) {
    logger.error("Lỗi lấy đơn hàng (Có thể do thiếu Index):", error);
  }
  Swal.fire({
    title: '<span class="modal-title">Thông tin tài khoản</span>',
    html: ProfileTemplate(user, orders),
    showConfirmButton: true,
    confirmButtonText: "Đóng",
    showDenyButton: true,
    showCloseButton: true,
    denyButtonText: "Đăng xuất",
    denyButtonColor: "var(--destructive)",
    customClass: {
      popup: "profile-swal-popup",
      denyButton: "profile-swal-deny",
      confirmButton: "profile-swal-close",
    },
  }).then(async (result) => {
    if (result.isDenied) {
      const confirm = await Swal.fire({
        title: "Bạn muốn đăng xuất?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đăng xuất ngay",
        cancelButtonText: "Hủy",
      });

      if (confirm.isConfirmed) {
        await authService.logout();
        window.location.reload();
      }
    }
  });
};

// ====================================================== LOGIC ====================================================== //

const getAuthInputValues = () => {
  const email =
    (document.getElementById("swal-email") as HTMLInputElement)?.value || "";
  const password =
    (document.getElementById("swal-password") as HTMLInputElement)?.value || "";

  const confirmPassword =
    (document.getElementById("swal-confirm-password") as HTMLInputElement)
      ?.value || "";

  return { email, password, confirmPassword };
};

const processAuthAction = async (mode: authTypes) => {
  const { email, password, confirmPassword } = getAuthInputValues();

  if (!email || !password) {
    Swal.showValidationMessage("Vui lòng điền đầy đủ Email và Mật khẩu");
    return false;
  }

  if (mode === "signup") {
    if (password !== confirmPassword) {
      Swal.showValidationMessage("Mật khẩu xác nhận không khớp");
      return false;
    }
  }

  try {
    Swal.showLoading();
    let user;
    if (mode === "login") {
      user = await authService.login(email, password);
    } else {
      const name = email.split("@")[0];
      user = await authService.signUp(email, password, name);
    }
    return user;
  } catch (error: any) {
    logger.error("Auth Error", error);
    Swal.showValidationMessage(`Lỗi: ${error.message}`);
    return false;
  }
};

const processGoogleAuth = async (mode: authTypes) => {
  const googleBtn = document.getElementById("btn-google-login");

  googleBtn?.addEventListener("click", async () => {
    try {
      Swal.showLoading();
      const user = await authService.loginGoogle();
      Swal.fire({
        title: "Thành công!",
        text: `Chào mừng ${user.displayName}`,
        icon: "success",
        timer: 2000,
      });
    } catch (error: any) {
      Swal.showValidationMessage(`Lỗi Google: ${error.message}`);
      Swal.hideLoading();
    }
  });

  const switchBtn = document.getElementById("switch-auth-mode");
  switchBtn?.addEventListener("click", () => {
    const { email } = getAuthInputValues();
    Swal.close();
    showAuthModal(mode === "login" ? "signup" : "login", email);
  });
};
// ====================================================== UI ========================================================= //

function AuthFormTemplate(mode: authTypes, initialEmail: string) {
  const isLogin = mode === "login";
  return /*html*/ `
    <div class="auth-form-container">
            ${Field({ label: "Email", as: "input", type: "email", placeholder: "example@gmail.com", value: initialEmail, id: "swal-email" })}
            ${Field({ label: "Mật khẩu", as: "input", type: "password", placeholder: "••••••••", id: "swal-password" })}
            
            ${!isLogin ? Field({ label: "Xác nhận mật khẩu", type: "password", as: "input", id: "swal-confirm-password", placeholder: "••••••••" }) : ""}
        
            <div class="auth-display-login">
                ${isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                <span id="switch-auth-mode" class="auth-span">
                    ${isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
                </span>
            </div>

            <div>
                ${Button({
                  id: "btn-google-login",
                  type: "button",
                  className: "auth-btn-google",
                  children: /*html*/ `
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18">
                    Tiếp tục với Google
                `,
                })}
            </div>
        </div>
  `;
}

function ProfileTemplate(user: any, orders: Order[]) {
  // Hàm render từng dòng đơn hàng
  const renderOrderItems = () => {
    if (orders.length === 0) {
      return `<p style="text-align:center; padding: 20px; color: var(--muted-foreground);">Bạn chưa có đơn hàng nào.</p>`;
    }

    return orders
      .map(
        (order) => /*html*/ `
      <div class="order-item-demo">
          <span class="order-id">#${order.id}</span>
          <span class="order-date">${order.date}</span>
          <span class="order-status ${order.status === "completed" ? "badge-success" : "badge-pending"}">${order.status}</span>
          <span class="order-total">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total)}</span>
      </div>
    `,
      )
      .join("");
  };

  return /*html*/ `
    <div class="profile-modal-content">
        <div class="profile-info-header">
            <img src="${user.img || "https://ui-avatars.com/api/?name=" + user.name}" 
                 alt="avatar" class="profile-modal-img" referrerpolicy="no-referrer">
            <div class="profile-text">
                <h3>${user.name || "Khách hàng"}</h3>
                <p>${user.email}</p>
            </div>
        </div>

        <div class="order-history-section">
            <h4 class="section-title"><i class="ri-history-line"></i> Lịch sử đơn hàng gần đây</h4>
            <div class="order-list">
                ${renderOrderItems()} <!-- Render dữ liệu thật ở đây -->
            </div>
        </div>
    </div>
  `;
}
