import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  CollectionReference,
  orderBy,
  addDoc,
} from "firebase/firestore";

import { db } from "./firebaseConfig";
import type { Order, Product } from "../../types/interface";

export class BaseRepository<T extends { id?: string }> {
  protected colRef: CollectionReference;
  constructor(collectionName: string) {
    this.colRef = collection(db, collectionName);
  }

  async saveWithId(id: string, data: T) {
    const docRef = doc(this.colRef, id);
    return await setDoc(docRef, data, { merge: true });
  }

  async getById(id: string): Promise<T | undefined> {
    const docRef = doc(this.colRef, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return undefined;
  }

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(this.colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  }

  async add(data: T): Promise<string> {
    const { id, ...rest } = data as any;
    const docRef = await addDoc(this.colRef, rest);
    return docRef.id;
  }
}

class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super("products");
  }

  async getByCategory(category: string): Promise<Product[]> {
    if (category === "all") {
      return await this.getAll();
    }

    const q = query(this.colRef, where("category", "==", category));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );
  }

  async searchByName(name: string): Promise<Product[]> {
    const q = query(this.colRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product,
    );
  }
}

export const productRepo = new ProductRepository();

// 1. UserRepository: Lưu thông tin chi tiết của user (role, địa chỉ, sđt)
class UserRepository extends BaseRepository<any> {
  constructor() {
    super("users");
  }
}

class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super("orders");
  }

  // Hàm lấy đơn hàng theo User ID và sắp xếp mới nhất lên đầu
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const q = query(
      this.colRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"), // Lưu ý: Cần tạo Index trên Firestore cho cái này
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
  }
}

export const userRepo = new UserRepository();
export const orderRepo = new OrderRepository();
