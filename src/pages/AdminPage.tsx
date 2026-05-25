import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Order, Product } from "../types";
import { GlassPanel } from "../components/GlassPanel";
import { formatUZS } from "../lib/utils";

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('uz-UZ', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const o = await api.getOrders();
      setOrders(o);
      const p = await api.getProducts();
      setProducts(p);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: Order["status"]) => {
    try {
      await api.updateOrderStatus(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex gap-4 border-b border-rose-200/50 pb-4">
        <button 
          onClick={() => setActiveTab("orders")}
          className={"text-lg font-bold px-4 py-2 rounded-xl transition-all " + (activeTab === "orders" ? "bg-rose-500 text-white shadow-md shadow-rose-500/30" : "text-slate-500 hover:bg-white/50")}
        >
          Buyurtmalar ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab("products")}
          className={"text-lg font-bold px-4 py-2 rounded-xl transition-all " + (activeTab === "products" ? "bg-rose-500 text-white shadow-md shadow-rose-500/30" : "text-slate-500 hover:bg-white/50")}
        >
          Mahsulotlar
        </button>
      </div>

      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map(order => (
            <GlassPanel key={order.id} className="p-6 rounded-2xl flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Buyurtma: {order.id}</h3>
                    <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-xs font-bold uppercase " + (
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-slate-200 text-slate-700'
                  )}>
                    {order.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-white/40 p-4 rounded-xl">
                  <div>
                    <span className="text-slate-500">Mijoz:</span>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Telefon:</span>
                    <p className="font-semibold">{order.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Telegram:</span>
                    <p className="font-semibold">{order.telegramUsername || "-"}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Sanaga:</span>
                    <p className="font-semibold text-rose-600">{order.deliveryDate}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Manzil:</span>
                    <p className="font-semibold">{order.address}</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="font-bold mb-2">Tarkibi:</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => {
                      const p = products.find(p => p.id === item.productId);
                      return (
                        <li key={idx} className="flex justify-between text-sm">
                          <span>{p?.name || "Noma'lum mahsulot"} x {item.quantity}</span>
                          <span className="font-medium">{formatUZS((p?.price || 0) * item.quantity)}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-slate-200">
                    <span>Jami:</span>
                    <span className="text-rose-600">{formatUZS(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 justify-end">
                {order.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateStatus(order.id, "completed")}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Bajarildi
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </>
                )}
              </div>
            </GlassPanel>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-20 text-slate-500">Hozircha buyurtmalar yo'q.</div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-4">
          <p className="text-slate-500 text-sm mb-4">Eslatma: Bu yerda faqat ko'rish mumkin. Yangi mahsulot qo'shish va tahrirlash imkoniyati to'liq versiyada yoqiladi.</p>
          {products.map(product => (
            <GlassPanel key={product.id} className="p-4 rounded-xl flex items-center gap-4">
              <img src={product.images[0]} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold">{product.name}</h4>
                <p className="text-rose-500 font-medium text-sm">{formatUZS(product.price)}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
