import express from "express";
import path from "path";
import fetch from "node-fetch"; // using global fetch if Node > 18, but wait, usually express needs node-fetch or native fetch. Native fetch is available in Node 18+. We'll just use native fetch.
import { createServer as createViteServer } from "vite";

const PORT = 3000;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string;
  images: string[];
  category?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  telegramUsername?: string;
  deliveryDate: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

// In-memory Database
let products: Product[] = [
  {
    id: "p1",
    name: "Red Velvet",
    price: 350000,
    description: "Yumshoq, klassik va yoqimli qizil barxat torti. Har qanday bayram uchun ideal tanlov.",
    ingredients: "Un, shakar, tuxum, sariyog', kakao, qaymoq, karamel.",
    images: ["https://images.unsplash.com/photo-1616541818222-38ef34bffa9f?q=80&w=600&auto=format&fit=crop"],
    category: "Klassik"
  },
  {
    id: "p2",
    name: "Shokoladli Jinnilik",
    price: 400000,
    description: "Haqiqiy shokolad shinavandalari uchun maxsus qora shokoladli tort.",
    ingredients: "Belgiya shokoladi, un, tuxum, qaymoq, funduk.",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop"],
    category: "Shokoladli"
  },
  {
    id: "p3",
    name: "Mevali Yoz",
    price: 300000,
    description: "Yozgi mevalar bilan bezatilgan yengil vanil torti.",
    ingredients: "Qulupnay, malina, vanil biskvit, engil krem.",
    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop"],
    category: "Mevali"
  },
  {
    id: "p4",
    name: "Medovik (Asalli)",
    price: 250000,
    description: "Avloddan avlodga o'tib kelayotgan uy retsepti asosida tayyorlangan asalli tort.",
    ingredients: "Sof asal, un, shakar, sariyog', smetana kremi.",
    images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop"],
    category: "Klassik"
  },
  {
    id: "p5",
    name: "Malikalar Uchun",
    price: 450000,
    description: "Qizaloqlar tug'ilgan kuni uchun ajoyib, pushti rangdagi shirin va mo'jizaviy tort.",
    ingredients: "Un, tuxum, shakar, tabiiy malina jemi, maskarpone kremi.",
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=600&auto=format&fit=crop"],
    category: "Bolalar uchun"
  },
  {
    id: "p6",
    name: "Oqqush (To'y Torti)",
    price: 850000,
    description: "Ikki qavatli, juda nafis va elegant to'y torti. Zarafshon gullar bilan bezatilgan.",
    ingredients: "Oq biskvit, qulupnayli konfi, oq shokolad, qaymoqli krem.",
    images: ["https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop"],
    category: "To'y uchun"
  }
];

let orders: Order[] = [];

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram bot token yoki chat ID mavjud emas. Xabar yuborilmadi.");
    return false;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
    const data = await response.json();
    if (!response.ok) {
        console.error("Telegram error:", data);
        return false;
    }
    return true;
  } catch (error) {
    console.error("Telegram xatosi:", error);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "20mb" }));

  // === API ROUTES ===

  app.post("/api/custom-request", async (req, res) => {
    const { name, phone, description, imageBase64 } = req.body;
    
    const caption = `🎨 <b>MAXSUS DIZAYN ZAKAZI!</b>\n\n👤 <b>Mijoz:</b> ${name}\n📞 <b>Telefon:</b> ${phone}\n💬 <b>Izoh:</b> ${description || "Kiritilmadi"}`;

    if (imageBase64) {
      try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (token && chatId) {
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('caption', caption);
          formData.append('parse_mode', 'HTML');

          const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const data = Buffer.from(matches[2], 'base64');
            const blob = new Blob([data], { type: matches[1] });
            formData.append('photo', blob, 'photo.jpg');

            fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
              method: 'POST',
              body: formData as any
            }).catch(console.error);
          } else {
             sendTelegramMessage(caption);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      sendTelegramMessage(caption);
    }

    res.json({ success: true });
  });

  // Products
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const newProduct: Product = {
      id: "p" + Date.now(),
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Topilmadi" });
    products[idx] = { ...products[idx], ...req.body, id: req.params.id };
    res.json(products[idx]);
  });

  app.delete("/api/products/:id", (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // Orders
  app.get("/api/orders", (req, res) => {
    // Sort orders by newest first
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sorted);
  });

  app.post("/api/orders", async (req, res) => {
    const orderData = req.body;
    const newOrder: Order = {
      id: "ord_" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
      ...orderData
    };
    orders.push(newOrder);

    // Format products for Telegram
    let itemsText = "";
    newOrder.items.forEach((item, index) => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        itemsText += `${index + 1}. <b>${p.name}</b> x ${item.quantity} dona (${(p.price * item.quantity).toLocaleString("uz-UZ")} so'm)\n`;
      }
    });

    // Send Telegram Notification
    const tgText = `🔔 <b>YANGI BUYURTMA!</b> #${newOrder.id}
    
👤 <b>Mijoz:</b> ${newOrder.customerName}
📞 <b>Telefon:</b> ${newOrder.phone}
💬 <b>Telegram:</b> ${newOrder.telegramUsername ? `@${newOrder.telegramUsername}` : "Kiritilmadi"}

📅 <b>Qachonga:</b> ${newOrder.deliveryDate}
📍 <b>Manzil:</b> ${newOrder.address}

🛒 <b>Buyurtma tarkibi:</b>
${itemsText}
💰 <b>Umumiy summa:</b> ${newOrder.totalPrice.toLocaleString("uz-UZ")} so'm`;

    // Fire & forget the telegram message
    sendTelegramMessage(tgText);

    res.status(201).json(newOrder);
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Topilmadi" });
    orders[idx].status = req.body.status;
    res.json(orders[idx]);
  });


  // === VITE MIDDLEWARE / SPA FALLBACK ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
