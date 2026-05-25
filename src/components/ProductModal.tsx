import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Heart } from "lucide-react";
import type { Product } from "../types";
import { GlassPanel } from "./GlassPanel";
import { formatUZS } from "../lib/utils";
import { useState } from "react";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <GlassPanel 
          onClick={(e) => e.stopPropagation()} 
          className="w-full max-w-4xl min-h-[500px] rounded-3xl overflow-hidden bg-white/80 my-auto flex flex-col md:flex-row relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/80 transition-colors shadow-sm"
          >
            <X size={20} className="text-slate-700" />
          </button>

          {/* Image Gallery */}
          <div className="w-full md:w-1/2 p-4 flex flex-col gap-3 h-[300px] md:h-auto">
            <div className="flex-1 rounded-2xl overflow-hidden">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 h-20">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={"flex-1 rounded-xl overflow-hidden border-2 transition-all " + (activeImage === idx ? "border-rose-400 opacity-100" : "border-transparent opacity-60 hover:opacity-100")}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{product.name}</h2>
            <p className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600 mb-6">
              {formatUZS(product.price)}
            </p>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Tarkibi</h4>
                <p className="text-slate-700 font-medium leading-relaxed bg-white/40 p-4 rounded-xl border border-white/50">{product.ingredients}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ta'rif</h4>
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-white/60 flex items-center gap-3">
              <button 
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <ShoppingBag size={20} />
                Savatga qo'shish
              </button>
              <button
                onClick={() => toggleFavorite(product)}
                className={`p-4 rounded-xl flex items-center justify-center transition-all shadow-sm border ${isFavorite(product.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white/50 border-white/60 text-slate-400 hover:text-rose-500 hover:bg-white'} hover:scale-[1.02]`}
              >
                <Heart size={24} className={isFavorite(product.id) ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  );
}
