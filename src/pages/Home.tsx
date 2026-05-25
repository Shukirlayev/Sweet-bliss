import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Product } from "../types";
import { GlassPanel } from "../components/GlassPanel";
import { formatUZS } from "../lib/utils";
import { motion } from "motion/react";
import { ShoppingBag, Heart, Clock, ShieldCheck, ChevronRight, Search, Star, ImagePlus } from "lucide-react";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";

interface HomeProps {
  onProductClick: (product: Product) => void;
  onCustomOrderClick: () => void;
}

export function Home({ onProductClick, onCustomOrderClick }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    api.getProducts()
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  const categories = ["Barchasi", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "Barchasi" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden min-h-[60vh] flex flex-col items-center justify-center">
        {/* Background decorations */}
        <div className="absolute top-10 left-0 sm:left-10 w-64 h-64 bg-rose-300/30 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-10 right-0 sm:right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl mix-blend-multiply"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/50 backdrop-blur-md text-slate-700 font-medium text-sm mb-6 shadow-sm border border-white/60">
              ✨ Premium Sifat & Betakror Ta'm
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 font-serif leading-[1.1]">
              Sizning maxsus bayramingiz uchun <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600 italic font-medium">mukammal</span> tortlar
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              100% tabiiy masalliqlardan, qalb qo'ri va yuqori estetik did bilan tayyorlangan shirinliklar. Har bir yudumda haqiqiy baxt ta'mini his qiling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} 
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40"
              >
                Menu orqali tanlash <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/40 backdrop-blur-md border-y border-white/60">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 font-serif mb-4">Nega aynan bizni tanlashadi?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Har qanday mijoz uchun maxsus yondashuv va eng yuqori sifat standartlari kafolati.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "100% Tabiiy", desc: "Faqat eng sara, sarg'ishtirilmagan sariyog' va tabiiy mevalar", color: "text-rose-500", bg: "bg-rose-100" },
                { icon: Clock, title: "Aniq vaqtida", desc: "Bayramingiz buzilmasligi uchun tortni va'da qilingan vaqtda yetkazamiz", color: "text-blue-500", bg: "bg-blue-100" },
                { icon: ShieldCheck, title: "Premium Sifat", desc: "Maxsus retseptlar va xalqaro texnologiyalar asosida tayyorlanadi", color: "text-purple-500", bg: "bg-purple-100" },
              ].map((feature, i) => (
                <GlassPanel key={i} className="p-8 rounded-[2rem] text-center hover:-translate-y-2 transition-transform duration-300 bg-white/50 border border-white/80">
                  <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </GlassPanel>
              ))}
            </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 font-serif mb-4">Bizning asarlar</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">O'zingizga yoqqan ta'mni tanlang va bayramingizni bezating.</p>
        </div>

        {/* Custom Order Banner */}
        <div className="mb-16">
          <GlassPanel className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-rose-50 to-purple-50 border border-white/80 overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif mb-4 flex items-center justify-center md:justify-start gap-2">
                    <span className="p-2 bg-rose-100 text-rose-500 rounded-xl"><ImagePlus size={24} /></span>
                    O'zingiz hohlagan dizayndagi tort!
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">Pinterest yoki internetdan topgan tortingiz rasmi bormi? Uni bizga yuboring, biz sizga aynan xuddi shunday qilib tayyorlab beramiz.</p>
                  <button 
                    onClick={onCustomOrderClick}
                    className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 transition-all w-full sm:w-auto"
                  >
                    Rasm yuborish
                  </button>
                </div>
                <div className="w-full md:w-1/3 flex justify-center hidden sm:flex">
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-white shadow-xl overflow-hidden -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                     <img src="https://images.unsplash.com/photo-1557925923-33b251dc32d6?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Custom Design Cake Inspiration" />
                  </div>
                </div>
             </div>
          </GlassPanel>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-auto flex-1 overflow-x-auto pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 min-w-max px-1">
              {categories.map(cat => (
                <button
                  key={cat as string}
                  onClick={() => setActiveCategory(cat as string)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    activeCategory === cat 
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
                    : "bg-white/60 text-slate-600 hover:bg-white border border-white/60 hover:shadow-sm"
                  }`}
                >
                  {cat as string}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tort izlash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/60 border border-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white text-sm transition-all shadow-sm"
            />
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white/30 rounded-3xl border border-white/50">
            Kechirasiz, ushbu parametrlar bo'yicha tort topilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassPanel 
                className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col bg-white/50 border border-white/80"
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-[4/5] sm:aspect-square w-full overflow-hidden relative bg-slate-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end">
                    <span className="text-slate-900 text-xs sm:text-sm font-bold backdrop-blur-md bg-white border border-white/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm w-full text-center">
                      Batafsil ko'rish
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-white/70 backdrop-blur-md text-slate-400 hover:bg-white hover:text-rose-500 hover:scale-110 transition-all shadow-sm z-10"
                  >
                    <Heart size={18} className={`sm:w-5 sm:h-5 ${isFavorite(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-1 font-serif group-hover:text-rose-600 transition-colors line-clamp-2 leading-tight">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 md:mb-4 leading-relaxed hidden sm:block">{product.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 sm:mt-auto gap-2">
                    <span className="font-bold text-rose-600 text-sm sm:text-lg">{formatUZS(product.price)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full sm:w-auto p-2 sm:p-3 bg-slate-900 text-white rounded-lg sm:rounded-xl hover:bg-rose-500 transition-colors shadow-md flex items-center justify-center transform active:scale-95 text-xs sm:text-base gap-1.5"
                      aria-label="Savatga qo'shish"
                    >
                      <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
                      <span className="sm:hidden font-medium">Savatga</span>
                    </button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="py-24 max-w-6xl mx-auto px-4 bg-white/40 backdrop-blur-md border-y border-white/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 font-serif mb-4">Mijozlarimiz fikrlari</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Sizning ishonchingiz biz uchun eng muhim boylik.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Malika A.", text: "To'yim uchun buyurtma qilingan tort nafaqat chiroyli, balki aqlbovar qilmaydigan darajada mazali edi. Rahmat katta!", rating: 5 },
            { name: "Sardor R.", text: "Farzandimning tug'ilgan kuniga zakaz qildik, dizayni rasmdagidek chiqdi, xursand bo'ldik.", rating: 5 },
            { name: "Dildora T.", text: "Endi har bayramda faqat sizlardan buyurtma beraman. Sifati gap-so'z bo'lishi mumkin emas!", rating: 5 },
          ].map((testimonial, i) => (
            <GlassPanel key={i} className="p-8 rounded-[2rem] bg-white/60 border border-white/80 hover:-translate-y-1 transition-transform">
              <div className="flex gap-1 text-amber-400 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 italic mb-8 flex-1 leading-relaxed text-lg">"{testimonial.text}"</p>
              <div className="flex items-center gap-4 border-t border-slate-200/60 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                   <span className="font-bold text-slate-800 block text-lg">{testimonial.name}</span>
                   <span className="text-slate-500 text-sm">Doimiy mijoz</span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-10 rounded-t-[3rem] px-4">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-b border-slate-700 pb-8 mb-8">
            <div className="mb-8 md:mb-0 text-center md:text-left">
               <span className="text-3xl font-bold text-white font-serif flex items-center justify-center md:justify-start gap-2">Sweet Bliss</span>
               <p className="text-slate-400 mt-2 max-w-xs">Sizning bayramingiz — bizning san'atimiz. Eng sifatli pishiriqlar bevosita uyga yetkazib berish bilan.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors duration-200">Instagram</a>
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors duration-200">Telegram</a>
            </div>
         </div>
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Sweet Bliss E-Commerce. Barcha huquqlar himoyalangan.</p>
            <p className="mt-2 md:mt-0">Toshkent, O'zbekiston</p>
         </div>
      </footer>
    </div>
  );
}
