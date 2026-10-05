import { createContext, useContext, useState, ReactNode } from "react";

// ====== TYPE ======
export type CartItem = {
  id: string;        // id menu (harus unik, misal "w1-m1")
  name: string;
  price: number;
  qty: number;
  warungId: string;
  warung: string;    // nama warung
};

export type OrderItem = {
  id: string;
  warung: string;
  menu: string;
  qty: number;
  harga: number;
  isReceived: boolean; // konfirmasi diterima, PER ITEM
};

export type Pesanan = {
  id: number;        // nomor pesanan, contoh 105
  meja: string;
  items: OrderItem[];
};

// ====== ISI "TEMPAT DATA BERSAMA" ======
type AppContextType = {
  nomorMeja: string;
  setNomorMeja: (meja: string) => void;
  cart: CartItem[];
  tambahKeKeranjang: (item: Omit<CartItem, "qty">) => void;
  ubahJumlah: (id: string, perubahan: number) => void;
  checkout: () => void;
  pesanan: Pesanan[];
  konfirmasiDiterima: (pesananId: number, itemId: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [nomorMeja, setNomorMeja] = useState("12");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);

  // Tambah menu ke keranjang. Kalau menu sudah ada, jumlahnya +1
  const tambahKeKeranjang = (item: Omit<CartItem, "qty">) => {
    const sudahAda = cart.find((c) => c.id === item.id);
    if (sudahAda) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // perubahan = +1 atau -1. Kalau jumlah jadi 0, item dihapus dari keranjang
  const ubahJumlah = (id: string, perubahan: number) => {
    setCart(
      cart
        .map((c) => (c.id === id ? { ...c, qty: c.qty + perubahan } : c))
        .filter((c) => c.qty > 0)
    );
  };

  // Checkout: isi keranjang diubah jadi 1 pesanan baru, lalu keranjang dikosongkan
  const checkout = () => {
    const pesananBaru: Pesanan = {
      id: 105 + pesanan.length,
      meja: nomorMeja,
      items: cart.map((c) => ({
        id: c.id,
        warung: c.warung,
        menu: c.name,
        qty: c.qty,
        harga: c.price,
        isReceived: false,
      })),
    };
    setPesanan([pesananBaru, ...pesanan]);
    setCart([]);
  };

  // Tandai SATU item sebagai diterima
  const konfirmasiDiterima = (pesananId: number, itemId: string) => {
    setPesanan(
      pesanan.map((p) =>
        p.id === pesananId
          ? { ...p, items: p.items.map((i) => (i.id === itemId ? { ...i, isReceived: true } : i)) }
          : p
      )
    );
  };

  return (
    <AppContext.Provider
      value={{ nomorMeja, setNomorMeja, cart, tambahKeKeranjang, ubahJumlah, checkout, pesanan, konfirmasiDiterima }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Dipakai di halaman: const { cart } = useApp();
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp harus dipakai di dalam AppProvider");
  return ctx;
}
