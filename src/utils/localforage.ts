import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "Cafe_shop_DB",
  version: 1.0,
  storeName: "keyvalue_pairs",
  description: "Lưu trữ dữ liệu offline cho App",
});

class IndexStorage {
  async set<T>(key: string, value: T): Promise<T> {
    try {
      return await localforage.setItem(key, value);
    } catch (error: any) {
      console.error("Lỗi lưu data:", error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem(key);
    } catch (error: any) {
      console.error("Lỗi lưu data:", error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    return await localforage.removeItem(key);
  }

  async clear(): Promise<void> {
    return await localforage.clear();
  }
}

export default new IndexStorage();
