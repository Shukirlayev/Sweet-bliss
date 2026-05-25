import { useState, useEffect } from "react";
import type { Product, Order } from "../types";

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },
  
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error("Buyurtma yaratishda xatolik yuz berdi");
    return res.json();
  },

  getOrders: async (): Promise<Order[]> => {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  updateOrderStatus: async (id: string, status: "pending" | "completed" | "cancelled"): Promise<Order> => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  }
};
