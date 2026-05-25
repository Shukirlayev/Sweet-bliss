import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./store/CartContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { AdminPage } from "./pages/AdminPage";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { ProductModal } from "./components/ProductModal";
import { CustomOrderModal } from "./components/CustomOrderModal";
import type { Product } from "./types";

function AppLayout() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 relative z-10 w-full">
        <Routes>
          <Route path="/" element={<Home onProductClick={setSelectedProduct} onCustomOrderClick={() => setIsCustomOrderOpen(true)} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      <CustomOrderModal 
        isOpen={isCustomOrderOpen} 
        onClose={() => setIsCustomOrderOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  );
}
