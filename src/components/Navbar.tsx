import { Link } from "react-router-dom";
import { ShoppingBag, Cake } from "lucide-react";
import { useCart } from "../store/CartContext";
import { motion } from "motion/react";

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full px-4 py-4 md:px-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-lg border border-white/50 shadow-sm rounded-2xl px-6 py-3"
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-rose-500/20 p-2 rounded-xl text-rose-600 group-hover:scale-105 transition-transform">
            <Cake size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-purple-600">
            Sweet Bliss
          </span>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">
            Admin
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-colors border border-white/50 text-slate-700"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
