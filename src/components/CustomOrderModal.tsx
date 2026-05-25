import { motion, AnimatePresence } from "motion/react";
import { X, ImagePlus, CheckCircle, Send } from "lucide-react";
import React, { useState, useRef } from "react";
import { GlassPanel } from "./GlassPanel";

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomOrderModal({ isOpen, onClose }: CustomOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
  });
  const [image, setImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: prev.name || `${user.first_name || ''} ${user.last_name || ''}`.trim()
        }));
      }
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Fayl hajmi 5MB dan oshmasligi kerak");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Iltimos, tort rasmini yuklang");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageBase64: image })
      });
      if (!res.ok) throw new Error("Xatolik");
      setSuccess(true);
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
              <h2 className="text-2xl font-bold text-slate-800 mb-2">So'rov qabul qilindi!</h2>
              <p className="text-slate-600 mb-8">Rahmat! Pishiriq ustamiz tez orada siz bilan bog'lanib, dizaynni muhokama qiladi.</p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                  setImage(null);
                  setFormData({ name: "", phone: "", description: "" });
                }}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium"
              >
                Yopish
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 font-serif">O'z dizayningiz</h2>
              <p className="text-slate-600 mb-6 text-sm">Internetdan topgan tort rasmingizni yuklang va biz aynan shunday tayyorlab beramiz!</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Image Upload Area */}
                <div 
                  className={`w-full h-48 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden relative cursor-pointer transition-all ${image ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400 bg-white/50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {image ? (
                    <>
                       <img src={image} className="w-full h-full object-cover" alt="Custom cake" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                         <span className="text-white font-medium flex items-center gap-2"><ImagePlus size={18} /> Rasmni o'zgartirish</span>
                       </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 shadow-sm">
                         <ImagePlus size={24} />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Rasm yuklash uchun bosing</p>
                      <p className="text-xs text-slate-400 mt-1">JPEG, PNG (max 5MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ismingiz *</label>
                  <input 
                    required 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm"
                    placeholder="Ismingiz"
                  />
                </div>
                
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qo'shimcha izoh</label>
                  <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-sm resize-none"
                    placeholder="Masalan: ustidagi guli qizil bo'lsin, ichi asal..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading || !image}
                  className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>So'rovni yuborish <Send size={18} /></>
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
