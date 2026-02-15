import { productRepo } from "./repository";
import logger from "../../utils/logger";
import productsJson from "../../../public/fake-data.json";
import type { Product } from "../../types/interface";

export const seedProducts = async () => {
  try {
    logger.info("Bắt đầu Seed dữ liệu sản phẩm...");

    const promises = productsJson.map((product) => {
      return productRepo.saveWithId(product.id, product as Product);
    });

    await Promise.all(promises);

    logger.success("Seed thành công 20 sản phẩm lên Firestore!");
    return productsJson;
  } catch (error: any) {
    logger.error("Lỗi khi Seed dữ liệu:", error);
  }
};
