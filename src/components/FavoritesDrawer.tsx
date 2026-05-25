import { motion, AnimatePresence } from "motion/react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useFavorites } from "../store/FavoritesContext";
import { useCart } from "../store/CartContext";
import { formatUZS } from "../lib/utils";

export function FavoritesDrawer() {
  const { favorites, toggleFavorite, isFavoritesOpen, setIsFavoritesOpen } = useFavorites();
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isFavoritesOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFavoritesOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-white/50"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-200/60 bg-white/50">
              <h2 className="text-2xl font-bold text-slate-800 font-serif flex items-center gap-2">
                <Heart className="text-rose-500 fill-current" /> Sevimlilar
              </h2>
              <button 
                onClick={() => setIsFavoritesOpen(false)}
                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                  <Heart size={64} className="opacity-20" />
                  <p className="font-medium">Sevimlilar ro'yxati bo'sh</p>
                </div>
              ) : (
                favorites.map((product) => (
                  <div key={product.id} className="flex gap-4 bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm relative group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="font-bold text-slate-800 text-lg truncate">{product.name}</h3>
                      <p className="text-rose-500 font-bold mt-1">{formatUZS(product.price)}</p>
                      
                      <button
                        onClick={() => {
                          addToCart(product);
                          setIsFavoritesOpen(false);
                        }}
                        className="mt-3 text-sm font-medium px-4 py-2 bg-slate-100 text-slate-800 rounded-lg flex items-center gap-2 hover:bg-slate-200 transition-colors w-full justify-center"
                      >
                         <ShoppingBag size={16} /> Savatga
                      </button>
                    </div>
                    <button
                      onClick={() => toggleFavorite(product)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
