import Swal from "sweetalert2";
import type { Product } from "../types/interface";
import Button from "../components/button";
import cartService, { type CartItem } from "../services/api/cartService";
import indexStorage from "../utils/localforage";
import { type Order } from "../types/interface";
import { orderRepo } from "../services/firebase/repository";
import logger from "../utils/logger";

// 1. MODAL INFO SẢN PHẨM
export const showProductModal = (product: Product) => {
  return Swal.fire({
    width: 800,
    showCloseButton: true,
    showConfirmButton: false, // Tự custom nút Add to Cart
    html: /*html*/ `
      <div class="product-modal-grid">
        <div class="modal-img-wrapper">
          <img src="${product.image}" class="modal-img" alt="${product.name}">
        </div>
        <div class="modal-info">
          <h3>${product.name}</h3>
          <span class="modal-price">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}</span>
          <p class="modal-desc">${product.description}</p>
          
          <div class="quantity-control">
            <button class="qty-btn" onclick="this.nextElementSibling.stepDown()">-</button>
            <input type="number" class="qty-input" value="1" min="1" max="10" readonly>
            <button class="qty-btn" onclick="this.previousElementSibling.stepUp()">+</button>
          </div>

          ${Button({
            id: "btn-add-to-cart-modal",
            children: `<i class="ri-shopping-bag-line"></i> Thêm vào giỏ hàng`,
            style:
              "width: 100%; background: var(--primary); color: var(--primary-foreground);",
          })}
        </div>
      </div>
    `,
    didOpen: () => {
      // Gán sự kiện cho nút Thêm vào giỏ
      document
        .getElementById("btn-add-to-cart-modal")
        ?.addEventListener("click", () => {
          const qtyInput = document.querySelector(
            ".qty-input",
          ) as HTMLInputElement;
          const quantity = parseInt(qtyInput.value) || 1;

          cartService.addToCart(product, quantity);

          Swal.close();

          setTimeout(() => {
            toggleCartSheet(true);
          }, 300);
        });
    },
  });
};

// 2. MODAL NHẬP THÔNG TIN THANH TOÁN
export const showCheckoutModal = async () => {
  const total = cartService.getTotal();
  const user = (await indexStorage.get("user-state")) as any;

  if (total === 0) return Swal.fire("Giỏ hàng trống!", "", "warning");

  Swal.fire({
    title: "Thông Tin Giao Hàng",
    html: `
      <div style="text-align: left;">
        <input id="swal-name" class="swal2-input" placeholder="Họ tên" value="${user?.name || ""}">
        <input id="swal-phone" class="swal2-input" placeholder="Số điện thoại">
        <input id="swal-address" class="swal2-input" placeholder="Địa chỉ nhận hàng">
      </div>
    `,
    preConfirm: () => {
      const name = (document.getElementById("swal-name") as HTMLInputElement)
        .value;
      const phone = (document.getElementById("swal-phone") as HTMLInputElement)
        .value;
      const address = (
        document.getElementById("swal-address") as HTMLInputElement
      ).value;
      if (!name || !phone || !address)
        return Swal.showValidationMessage("Vui lòng nhập đủ thông tin");
      return { name, phone, address };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Chuyền customerData sang Modal QR
      showQRModal(total, result.value);
    }
  });
};

// 3. MODAL QR CODE (Payment)
export const showQRModal = (amount: number, customerData: any) => {
  let timerInterval: any;
  const qrUrl = `https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${amount}&addInfo=Thanh Toan Cafe Shop`;

  Swal.fire({
    title: "Quét Mã Thanh Toán",
    html: /*html*/ `
      <div class="qr-container">
        <img src="${qrUrl}" class="qr-img" alt="QR" style="width:250px; border-radius:10px;">
        <p style="margin-top:15px;">Vui lòng quét mã và chờ xác nhận...</p>
        <h2 style="color:var(--primary);">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}</h2>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Đang chờ (5s)",
    confirmButtonColor: "var(--primary)",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      const btn = Swal.getConfirmButton();
      btn!.disabled = true;
      let timeLeft = 5;
      timerInterval = setInterval(() => {
        timeLeft--;
        btn!.textContent = `Xác nhận (${timeLeft}s)`;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          Swal.hideLoading();
          btn!.textContent = "Đã thanh toán xong";
          btn!.disabled = false;
        }
      }, 1000);
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Đang lưu đơn hàng...",
          didOpen: () => Swal.showLoading(),
        });

        const user = (await indexStorage.get("user-state")) as any;
        const cartItems = cartService.getCart();

        const newOrder: Order = {
          userId: user?.id || "guest",
          items: cartItems,
          total: amount,
          customerInfo: customerData,
          status: "completed",
          date: new Date().toLocaleDateString("vi-VN"),
          createdAt: Date.now(),
        };

        await orderRepo.add(newOrder);

        // Xóa giỏ hàng
        cartService.clearCart();

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đơn hàng đã được lưu. Cảm ơn bạn!",
          confirmButtonColor: "var(--primary)",
        });
      } catch (error: any) {
        logger.error("Lỗi khi lưu đơn hàng:", error);
        Swal.fire("Lỗi", "Không thể lưu đơn hàng, vui lòng thử lại!", "error");
      }
    }
  });
};

const renderCartItem = (item: CartItem) => {
  return /*html*/ `
    <div class="cart-item" style="display: flex; gap: 10px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed var(--border);">
      <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
      <div style="flex-grow: 1;">
        <h4 style="margin: 0; font-size: 0.9rem;">${item.name}</h4>
        <p style="margin: 5px 0; color: var(--primary); font-weight: bold;">
            ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
        </p>
        <div style="display: flex; align-items: center; gap: 10px;">
            <button class="qty-mini-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-mini-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-item-btn" data-id="${item.id}" style="border: none; background: transparent; color: var(--destructive); cursor: pointer;">
        <i class="ri-delete-bin-line"></i>
      </button>
    </div>
  `;
};

export const CartSheet = () => {
  return /*html*/ `
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-sheet" id="cart-sheet">
      <div class="cart-header">
        <h3 style="margin: 0; font-weight: 700;">Giỏ Hàng</h3>
        <button id="close-cart-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- Body: Nơi chứa list item -->
      <div class="cart-body" id="cart-items-container">
         <!-- JS sẽ render vào đây -->
      </div>

      <div class="cart-footer">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: 700;">
          <span>Tổng cộng:</span>
          <span id="cart-total-price">0đ</span>
        </div>
        ${Button({ id: "btn-checkout", children: "Thanh Toán Ngay", style: "width: 100%; background: var(--primary); color: white;" })}
      </div>
    </div>
  `;
};

// Hàm cập nhật lại toàn bộ UI liên quan đến Cart
const updateCartUI = () => {
  const itemsContainer = document.getElementById("cart-items-container");
  const totalPriceEl = document.getElementById("cart-total-price");
  const badgeEl = document.getElementById("cart-badge-count"); // Badge trên Navbar

  const cart = cartService.getCart();
  const total = cartService.getTotal();
  const count = cartService.getCount();

  // 1. Cập nhật Badge trên Navbar
  if (badgeEl) badgeEl.innerText = count.toString();

  // 2. Cập nhật List trong Sheet
  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = `<p style="text-align:center; margin-top: 20px;">Giỏ hàng trống trơn!</p>`;
    } else {
      itemsContainer.innerHTML = cart.map(renderCartItem).join("");
    }
  }

  // 3. Cập nhật Tổng tiền
  if (totalPriceEl) {
    totalPriceEl.innerText = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(total);
  }
};

export const toggleCartSheet = (isOpen: boolean) => {
  const sheet = document.getElementById("cart-sheet");
  const overlay = document.getElementById("cart-overlay");
  if (isOpen) {
    sheet?.classList.add("open");
    overlay?.classList.add("open");
    updateCartUI(); // Mở ra là cập nhật luôn cho chắc
  } else {
    sheet?.classList.remove("open");
    overlay?.classList.remove("open");
  }
};

export const initCartEvents = () => {
  const closeBtn = document.getElementById("close-cart-btn");
  const overlay = document.getElementById("cart-overlay");
  const container = document.getElementById("cart-items-container");

  // Đóng sheet
  const close = () => toggleCartSheet(false);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);

  // Sự kiện Tăng/Giảm/Xóa (Dùng Event Delegation)
  container?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Nút tăng giảm
    const qtyBtn = target.closest(".qty-mini-btn");
    if (qtyBtn) {
      const id = qtyBtn.getAttribute("data-id")!;
      const action = qtyBtn.getAttribute("data-action");
      cartService.updateQuantity(id, action === "increase" ? 1 : -1);
    }

    // Nút xóa
    const removeBtn = target.closest(".remove-item-btn");
    if (removeBtn) {
      const id = removeBtn.getAttribute("data-id")!;
      cartService.removeFromCart(id);
    }
  });

  // 🔥 LẮNG NGHE SỰ KIỆN TOÀN APP: Khi cart thay đổi -> Gọi updateCartUI
  window.addEventListener("cart-change", () => {
    updateCartUI();
  });

  document.getElementById("btn-checkout")?.addEventListener("click", () => {
    // 1. Đóng Sheet lại cho gọn
    toggleCartSheet(false);

    // 2. Mở Modal nhập thông tin
    // Delay nhẹ 300ms để hiệu ứng đóng sheet chạy xong nhìn cho mượt
    setTimeout(() => {
      showCheckoutModal();
    }, 300);
  });

  // Init lần đầu
  updateCartUI();
};
