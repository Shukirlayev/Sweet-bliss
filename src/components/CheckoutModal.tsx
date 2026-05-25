import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, Cake } from "lucide-react";
import { useCart } from "../store/CartContext";
import { GlassPanel } from "./GlassPanel";
import { api } from "../lib/api";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    telegramUsername: "",
    deliveryDate: "",
    address: ""
  });

  React.useEffect(() => {
    if (isOpen && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setFormData(prev => ({
          ...prev,
          customerName: prev.customerName || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          telegramUsername: prev.telegramUsername || (user.username ? `@${user.username}` : '')
        }));
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.formEvent || e.preventDefault();
    setLoading(true);
    try {
      await api.createOrder({
        ...formData,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        totalPrice: cartTotal
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      >
        <GlassPanel className="w-full max-w-lg rounded-2xl p-6 md:p-8 relative bg-white/80 my-auto">
          {(!success && !loading) && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200/50 transition-colors"
            >
              <X size={20} />
            </button>
          )}

          {success ? (
            <div className="text-center py-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Buyurtma qabul qilindi!</h2>
              <p className="text-slate-600 mb-8">Tez orada siz bilan bog'lanamiz.</p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium"
              >
                Yopish
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Cake className="text-rose-500" /> Rasmiylashtirish
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ism familiya *</label>
                  <input 
                    required 
                    name="customerName" 
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm"
                    placeholder="Ismingizni kiriting"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
                    <input 
                      required 
                      type="tel"
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telegram (ixtiyoriy)</label>
                    <input 
                      name="telegramUsername" 
                      value={formData.telegramUsername}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qachonga tayyor bo'lishi kerak? *</label>
                  <input 
                    required 
                    type="date"
                    name="deliveryDate" 
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Manzil *</label>
                  <textarea 
                    required 
                    name="address" 
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm resize-none"
                    placeholder="Manzilni batafsil kiriting"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Buyurtmani tasdiqlash"
                  )}
                </button>
              </form>
            </>
          )}
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  );
}
