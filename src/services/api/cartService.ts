import { type Product } from "../../types/interface";
import Swal from "sweetalert2";

export interface CartItem extends Product {
  quantity: number;
}

class CartService {
  private cart: CartItem[] = [];

  constructor() {
    // Load từ LocalStorage khi khởi tạo
    const saved = localStorage.getItem("my-cart");
    if (saved) {
      this.cart = JSON.parse(saved);
    }
  }

  // 1. Lấy toàn bộ giỏ
  getCart() {
    return this.cart;
  }

  // 2. Thêm vào giỏ
  addToCart(product: Product, quantity = 1) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }

    this.save();

    // 🔥 QUAN TRỌNG: Bắn tín hiệu ra toàn app là "Giỏ hàng thay đổi rồi nè!"
    window.dispatchEvent(new Event("cart-change"));

    // Thông báo nhỏ góc màn hình
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // 3. Xóa khỏi giỏ
  removeFromCart(id: string) {
    this.cart = this.cart.filter((item) => item.id !== id);
    this.save();
    window.dispatchEvent(new Event("cart-change"));
  }

  // 4. Tăng giảm số lượng
  updateQuantity(id: string, change: number) {
    const item = this.cart.find((i) => i.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(id);
      } else {
        this.save();
        window.dispatchEvent(new Event("cart-change"));
      }
    }
  }

  // 5. Tính tổng tiền
  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // 6. Đếm tổng số lượng (để hiện lên badge)
  getCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  private save() {
    localStorage.setItem("my-cart", JSON.stringify(this.cart));
  }

  clearCart() {
    this.cart = [];
    this.save();
    window.dispatchEvent(new Event("cart-change"));
  }
}

export default new CartService();
