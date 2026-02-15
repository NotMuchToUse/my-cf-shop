export interface PageRender {
  render: () => Promise<string> | string;
  afterRender?: (match?: any) => Promise<void> | void;
}

export interface NavigoMatch {
  url: string;
  data: { [key: string]: string } | null;
  params: { [key: string]: string } | null;
  queryString: string;
  route: {
    path: string;
    hooks: any;
  };
}

export interface Product {
  id: string;
  name: string;
  category: "coffee" | "machine" | "tea" | "freeze" | "cake";
  price: number;
  image: string;
  rating: number;
  description: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: any[];
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  date: string;
  total: number;
  status: "pending" | "completed";
  createdAt: number;
}
