import { NavbarSection } from "../layouts/navbar";
import Footer from "../layouts/footer";
import Container from "../layouts/container";
import { type PageRender } from "../types/interface";
// import productService from "../services/api/productService";
import type { Product } from "../types/interface";
import { showProductModal } from "../layouts/productmodal";
import { productRepo } from "../services/firebase/repository";

// 1. Hàm render khung xương loading
const renderSkeleton = () => {
  return Array(8)
    .fill(0)
    .map(
      () => /*html*/ `
    <div class="product-card">
      <div class="product-img-wrapper skeleton" style="height: 220px;"></div>
      <div class="product-info">
        <div class="skeleton" style="height: 15px; width: 50%; margin-bottom: 10px;"></div>
        <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 15px;"></div>
        <div class="product-bottom">
           <div class="skeleton" style="height: 20px; width: 40%;"></div>
           <div class="skeleton" style="height: 35px; width: 35px; border-radius: 50%;"></div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
};

// 2. Hàm render thẻ sản phẩm
const renderProductCard = (product: Product) => {
  const price = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  return /*html*/ `
    <div class="product-card" data-id="${product.id}">
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">${price}</span>
          <button class="btn-add-quick" title="Thêm vào giỏ">
            <i class="ri-shopping-cart-2-line"></i>
          </button>
        </div>
      </div>
    </div>
  `;
};

const ProductPage: PageRender = {
  render: async () => {
    return /*html*/ `
    ${NavbarSection()}
    
    <main class="product-page-wrapper">
      ${Container({
        children: /*html*/ `
          <div class="product-layout">
            
            <!-- SIDEBAR -->
            <aside class="product-sidebar">
              <div class="search-box">
                <input type="text" id="search-input" placeholder="Tìm kiếm món...">
                <i class="ri-search-line search-icon"></i>
              </div>

              <h3 class="sidebar-title">Danh Mục</h3>
              <ul class="category-list" id="category-filter">
                <li class="category-item active" data-cate="all">Tất cả</li>
                <li class="category-item" data-cate="coffee">Cà Phê</li>
                <li class="category-item" data-cate="tea">Trà Trái Cây</li>
                <li class="category-item" data-cate="freeze">Đá Xay</li>
                <li class="category-item" data-cate="cake">Bánh Ngọt</li>
              </ul>
            </aside>

            <!-- MAIN CONTENT -->
            <div class="product-content">
              <div class="flex justify-between items-center mb-6">
                 <h2 class="text-2xl font-bold" style="color: var(--primary);">Thực Đơn</h2>
                 <span class="text-gray-500" id="product-count">Đang tải...</span>
              </div>

              <!-- Grid sản phẩm -->
              <div class="product-grid" id="product-list">
                 ${renderSkeleton()} 
              </div>

              <div id="pagination-container" class="pagination-container"></div>
            </div>

          </div>
        `,
      })}
    </main>

    ${Footer()}
    `;
  },

  afterRender: async () => {
    const productContainer = document.getElementById("product-list");
    const countLabel = document.getElementById("product-count");
    const searchInput = document.getElementById(
      "search-input",
    ) as HTMLInputElement;
    const categoryBtns = document.querySelectorAll(".category-item");
    const paginationContainer = document.getElementById("pagination-container");

    let fullProducts: Product[] = []; // Kho gốc
    let filteredProducts: Product[] = []; // Kho đã lọc/search
    let currentPage = 1;

    // 1. Lấy giới hạn sản phẩm theo màn hình
    const getLimit = () => {
      const width = window.innerWidth;
      if (width >= 1024) return 12;
      if (width >= 768) return 8;
      return 6;
    };

    // 2. Hàm vẽ nút phân trang
    const renderPaginationButtons = (
      totalItems: number,
      activePage: number,
    ) => {
      if (!paginationContainer) return;
      const limit = getLimit();
      const totalPages = Math.ceil(totalItems / limit);

      if (totalPages <= 1) {
        paginationContainer.innerHTML = "";
        return;
      }

      let html = "";
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === activePage ? "active" : ""}" data-page="${i}">${i}</button>`;
      }
      paginationContainer.innerHTML = html;

      paginationContainer.querySelectorAll(".page-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          currentPage = Number((e.currentTarget as HTMLElement).dataset.page);
          renderUI(); // Vẽ lại khi đổi trang
        });
      });
    };

    // 3. HÀM VẼ GIAO DIỆN TỔNG HỢP (Nhạc trưởng)
    const renderUI = () => {
      if (!productContainer || !countLabel) return;

      const limit = getLimit();
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;

      // Cắt mảng để hiện theo trang
      const displayList = filteredProducts.slice(startIndex, endIndex);

      if (filteredProducts.length === 0) {
        productContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;">Không tìm thấy món nào phù hợp!</div>`;
        countLabel.innerText = "0 món";
        if (paginationContainer) paginationContainer.innerHTML = "";
        return;
      }

      // Vẽ sản phẩm
      productContainer.innerHTML = displayList.map(renderProductCard).join("");
      countLabel.innerText = `${filteredProducts.length} món ngon`;

      // Vẽ phân trang
      renderPaginationButtons(filteredProducts.length, currentPage);

      // Cuộn lên đầu
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    try {
      // BƯỚC 1: Fetch data một lần duy nhất
      fullProducts = await productRepo.getAll();
      filteredProducts = [...fullProducts];

      // BƯỚC 2: Chạy hàm vẽ lần đầu
      renderUI();

      // BƯỚC 3: Logic Filter
      categoryBtns.forEach((btn) => {
        btn.addEventListener("click", async () => {
          document
            .querySelector(".category-item.active")
            ?.classList.remove("active");
          btn.classList.add("active");

          const category = btn.getAttribute("data-cate") || "all";

          // Lọc cục bộ từ mảng đã có (nhanh hơn gọi server liên tục)
          filteredProducts =
            category === "all"
              ? [...fullProducts]
              : fullProducts.filter((p) => p.category === category);

          currentPage = 1; // Reset về trang 1
          if (searchInput) searchInput.value = ""; // Clear search
          renderUI();
        });
      });

      // BƯỚC 4: Logic Search
      searchInput?.addEventListener("input", (e) => {
        const keyword = (e.target as HTMLInputElement).value.toLowerCase();
        filteredProducts = fullProducts.filter((p) =>
          p.name.toLowerCase().includes(keyword),
        );
        currentPage = 1;
        renderUI();
      });

      // BƯỚC 5: Event Delegation cho Card & Quick Add
      productContainer?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;

        // Click vào nút thêm nhanh
        if (target.closest(".btn-add-quick")) {
          e.stopPropagation(); // Ngăn việc mở modal khi bấm nút giỏ hàng
          const id = target.closest(".product-card")?.getAttribute("data-id");
          const product = fullProducts.find((p) => p.id === id);
          if (product) {
            // logic addToCart của bạn ở đây
            console.log("Quick add:", product.name);
          }
          return;
        }

        // Click vào Card để mở Modal
        const card = target.closest(".product-card") as HTMLElement;
        if (card) {
          const id = card.getAttribute("data-id");
          const product = fullProducts.find((p) => p.id === id);
          if (product) showProductModal(product);
        }
      });
    } catch (error) {
      console.error(error);
      if (productContainer)
        productContainer.innerHTML = "<p>Lỗi tải dữ liệu!</p>";
    }
  },
};

export default ProductPage;
