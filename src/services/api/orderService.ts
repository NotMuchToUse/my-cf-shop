// import indexStorage from "../../utils/localforage";

// export interface Order {
//   id?: string;
//   userId: string;
//   items: any[]; // Bắt buộc phải có để biết khách mua gì
//   customerInfo: {
//     // Bắt buộc phải có để biết giao cho ai
//     name: string;
//     phone: string;
//     address: string;
//   };
//   date: string; // Kiểu string như bạn muốn (VD: "15/02/2024")
//   total: number;
//   status: "Hoàn thành" | "Đang xử lý"; // Theo đúng label bạn muốn
//   createdAt: number; // Vẫn nên giữ cái này để dùng hàm orderBy của Firebase (máy tính lọc số nhanh hơn lọc chữ)
// }

// class OrderService {
//   // Lưu đơn hàng mới
//   async saveOrder(userId: string, total: number) {
//     const orders = (await indexStorage.get<Order[]>("order-history")) || [];

//     const newOrder: Order = {
//       id: "CF" + Math.floor(Math.random() * 10000), // Tạo ID ngẫu nhiên
//       userId: userId,
//       date: new Date().toLocaleDateString("vi-VN"),
//       total: total,
//       status: "Hoàn thành",
//     };

//     orders.unshift(newOrder); // Đưa đơn mới lên đầu
//     await indexStorage.set("order-history", orders);
//     return newOrder;
//   }

//   // Lấy đơn hàng của User hiện tại
//   async getOrdersByUserId(userId: string) {
//     const orders = (await indexStorage.get<Order[]>("order-history")) || [];
//     return orders.filter((order) => order.userId === userId);
//   }
// }

// export default new OrderService();
