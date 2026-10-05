import { createContext, useContext, useState, ReactNode } from "react";

// ====== TYPE ======
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  gambar?: string;   // link gambar (boleh kosong)
};

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
  catatan?: string;    // catatan pesanan (boleh kosong)
};

export type Pesanan = {
  id: number;        // nomor pesanan, contoh 105
  meja: string;
  waktu: string;     // jam pesanan, contoh "12.35"
  items: OrderItem[];
};

export type OwnerAkun = {
  username: string;
  password: string;
  warungId: string;
  namaWarung: string;
};

// ====== DATA AWAL (nanti diganti data dari backend) ======
export const DAFTAR_OWNER: OwnerAkun[] = [
  { username: "busiti", password: "1234", warungId: "1", namaWarung: "Warung Bu Siti" },
  { username: "sotolamongan", password: "1234", warungId: "2", namaWarung: "Warung Soto Lamongan" },
];

// Menu tiap warung (kunci = id warung)
const MENU_AWAL: Record<string, MenuItem[]> = {
  "1": [
    { id: "w1-m1", name: "Ayam Bakar", price: 25000 },
    { id: "w1-m2", name: "Nasi Uduk", price: 15000 },
    { id: "w1-m3", name: "Es Teh Manis", price: 5000 },
  ],
  "2": [
    { id: "w2-m1", name: "Soto Lamongan", price: 20000 },
    { id: "w2-m2", name: "Rawon Daging", price: 22000 },
    { id: "w2-m3", name: "Jus Alpukat", price: 7000 },
  ],
};

// ====== ISI "TEMPAT DATA BERSAMA" ======
type AppContextType = {
  // customer
  nomorMeja: string;
  setNomorMeja: (meja: string) => void;
  cart: CartItem[];
  tambahKeKeranjang: (item: Omit<CartItem, "qty">) => void;
  ubahJumlah: (id: string, perubahan: number) => void;
  checkout: () => void;
  pesanan: Pesanan[];
  konfirmasiDiterima: (pesananId: number, itemId: string) => void;

  // menu (dipakai customer & owner)
  menu: Record<string, MenuItem[]>;
  tambahMenu: (warungId: string, data: Omit<MenuItem, "id">) => void;
  ubahMenu: (warungId: string, menuId: string, data: Omit<MenuItem, "id">) => void;
  hapusMenu: (warungId: string, menuId: string) => void;

  // owner yang sedang login (null = belum login)
  owner: OwnerAkun | null;
  setOwner: (akun: OwnerAkun | null) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [nomorMeja, setNomorMeja] = useState("12");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [menu, setMenu] = useState<Record<string, MenuItem[]>>(MENU_AWAL);
  const [owner, setOwner] = useState<OwnerAkun | null>(null);

  // ----- CUSTOMER -----

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
      waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
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

  // ----- OWNER: KELOLA MENU -----

  const tambahMenu = (warungId: string, data: Omit<MenuItem, "id">) => {
    const menuBaru: MenuItem = { id: `w${warungId}-${Date.now()}`, ...data };
    setMenu({ ...menu, [warungId]: [...(menu[warungId] ?? []), menuBaru] });
  };

  const ubahMenu = (warungId: string, menuId: string, data: Omit<MenuItem, "id">) => {
    setMenu({
      ...menu,
      [warungId]: (menu[warungId] ?? []).map((m) => (m.id === menuId ? { ...m, ...data } : m)),
    });
  };

  const hapusMenu = (warungId: string, menuId: string) => {
    setMenu({ ...menu, [warungId]: (menu[warungId] ?? []).filter((m) => m.id !== menuId) });
  };

  return (
    <AppContext.Provider
      value={{
        nomorMeja, setNomorMeja, cart, tambahKeKeranjang, ubahJumlah, checkout, pesanan, konfirmasiDiterima,
        menu, tambahMenu, ubahMenu, hapusMenu,
        owner, setOwner,
      }}
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