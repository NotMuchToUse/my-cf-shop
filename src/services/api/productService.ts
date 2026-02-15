// import { http } from "./axios";
// import type { Product } from "../../types/interface";
// import logger from "../../utils/logger";

// class ProductService {
//   async getAllProducts(): Promise<Product[]> {
//     return new Promise(async (resolve, reject) => {
//       try {
//         setTimeout(async () => {
//           const response = await http.get<Product[]>("/fake-data.json");
//           resolve(response.data);
//         }, 1000);
//       } catch (error: any) {
//         logger.error("Lỗi lấy sản phẩm:", error);
//         reject(error);
//       }
//     });
//   }

//   async getProductById(id: string): Promise<Product | undefined> {
//     const products = await this.getAllProducts();
//     return products.find((p) => p.id === id);
//   }

//   async getProductsByCategory(category: string): Promise<Product[]> {
//     const products = await this.getAllProducts();
//     if (category === "all") return products;
//     return products.filter((p) => p.category === category);
//   }
// }

// export default new ProductService();
