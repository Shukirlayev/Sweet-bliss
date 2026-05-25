import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "../store/CartContext";
import { GlassPanel } from "./GlassPanel";
import { formatUZS } from "../lib/utils";
import { useEffect } from "react";

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] z-50 p-4"
          >
            <GlassPanel className="w-full h-full rounded-2xl flex flex-col pt-0 px-0 pb-0 overflow-hidden bg-white/70">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/50">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <ShoppingBag size={24} className="text-rose-500" />
                  Savat
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                    <ShoppingBag size={48} className="text-slate-300 mb-4" />
                    <p>Savatingiz hozircha bo'sh</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 items-center bg-white/40 p-3 rounded-xl border border-white/60 shadow-sm">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{item.product.name}</h3>
                        <p className="text-rose-600 font-medium text-sm">{formatUZS(item.product.price)}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="bg-white/60 hover:bg-white p-1 rounded-md text-slate-600 shadow-sm"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="bg-white/60 hover:bg-white p-1 rounded-md text-slate-600 shadow-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/50 bg-white/30 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-600 font-medium">Umumiy summa:</span>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-purple-600">
                      {formatUZS(cartTotal)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                        setIsCartOpen(false);
                        onCheckout();
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] transition-all"
                  >
                    Buyurtmani rasmiylashtirish
                  </button>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
