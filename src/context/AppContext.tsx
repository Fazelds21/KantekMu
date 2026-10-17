import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dbPromise } from "@/database/db";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  gambar?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  warungId: string;
  warung: string;
};

export type OrderItem = {
  id: string;
  warung: string;
  menu: string;
  qty: number;
  harga: number;
  isReceived: boolean;
  catatan?: string;
};

export type Pesanan = {
  id: number;
  meja: string;
  waktu: string;
  items: OrderItem[];
};

export type OwnerWarung = {
  warungId: string;
  namaWarung: string;
};

export type Warung = {
  id: string;
  name: string;
};

type MenuItemRow = {
  id: number;
  stall_id: number;
  name: string;
  price: number;
  image_uri: string | null;
};

type WarungRow = {
  id: number;
  name: string;
};

type AppContextType = {
  nomorMeja: string;
  setNomorMeja: (meja: string) => void;
  cart: CartItem[];
  tambahKeKeranjang: (item: Omit<CartItem, "qty">) => void;
  ubahJumlah: (id: string, perubahan: number) => void;
  checkout: () => void;
  pesanan: Pesanan[];
  konfirmasiDiterima: (pesananId: number, itemId: string) => void;
  warungList: Warung[];
  menu: Record<string, MenuItem[]>;
  menuLoading: boolean;
  menuError: string | null;
  tambahMenu: (warungId: string, data: Omit<MenuItem, "id">) => Promise<void>;
  ubahMenu: (
    warungId: string,
    menuId: string,
    data: Omit<MenuItem, "id">,
  ) => Promise<void>;
  hapusMenu: (warungId: string, menuId: string) => Promise<void>;
  owner: OwnerWarung | null;
  setOwner: (owner: OwnerWarung | null) => void;
};

const AppContext = createContext<AppContextType | null>(null);

async function loadMenuFromDatabase(): Promise<Record<string, MenuItem[]>> {
  const db = await dbPromise;
  const rows = await db.getAllAsync<MenuItemRow>(`
    SELECT id, stall_id, name, price, image_uri
    FROM menu_items
    WHERE is_available = 1
    ORDER BY stall_id, id
  `);

  return rows.reduce<Record<string, MenuItem[]>>((menu, row) => {
    const warungId = String(row.stall_id);
    const items = menu[warungId] ?? [];

    return {
      ...menu,
      [warungId]: [
        ...items,
        {
          id: String(row.id),
          name: row.name,
          price: row.price,
          ...(row.image_uri ? { gambar: row.image_uri } : {}),
        },
      ],
    };
  }, {});
}

async function loadWarungListFromDatabase(): Promise<Warung[]> {
  const db = await dbPromise;
  const rows = await db.getAllAsync<WarungRow>(
    "SELECT id, name FROM stalls ORDER BY name",
  );

  return rows.map((row) => ({ id: String(row.id), name: row.name }));
}

function getDatabaseId(value: string, fieldName: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`${fieldName} tidak valid.`);
  }
  return id;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [nomorMeja, setNomorMeja] = useState("12");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [warungList, setWarungList] = useState<Warung[]>([]);
  const [menu, setMenu] = useState<Record<string, MenuItem[]>>({});
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [owner, setOwner] = useState<OwnerWarung | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        const [menuFromDatabase, warungListFromDatabase] = await Promise.all([
          loadMenuFromDatabase(),
          loadWarungListFromDatabase(),
        ]);
        if (isMounted) {
          setMenu(menuFromDatabase);
          setWarungList(warungListFromDatabase);
          setMenuError(null);
        }
      } catch (error) {
        console.error("Gagal memuat data warung dan menu dari database:", error);
        if (isMounted) {
          setMenuError("Data warung dan menu gagal dimuat dari database.");
        }
      } finally {
        if (isMounted) {
          setMenuLoading(false);
        }
      }
    }

    void loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  const tambahKeKeranjang = (item: Omit<CartItem, "qty">) => {
    const sudahAda = cart.find((cartItem) => cartItem.id === item.id);
    if (sudahAda) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem,
        ),
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const ubahJumlah = (id: string, perubahan: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + perubahan } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const checkout = () => {
    const pesananBaru: Pesanan = {
      id: 105 + pesanan.length,
      meja: nomorMeja,
      waktu: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: cart.map((item) => ({
        id: item.id,
        warung: item.warung,
        menu: item.name,
        qty: item.qty,
        harga: item.price,
        isReceived: false,
      })),
    };
    setPesanan([pesananBaru, ...pesanan]);
    setCart([]);
  };

  const konfirmasiDiterima = (pesananId: number, itemId: string) => {
    setPesanan((currentPesanan) =>
      currentPesanan.map((order) =>
        order.id === pesananId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId ? { ...item, isReceived: true } : item,
              ),
            }
          : order,
      ),
    );
  };

  const tambahMenu = async (
    warungId: string,
    data: Omit<MenuItem, "id">,
  ) => {
    const stallId = getDatabaseId(warungId, "ID warung");
    const db = await dbPromise;
    await db.runAsync(
      `INSERT INTO menu_items (stall_id, name, price, image_uri)
       VALUES (?, ?, ?, ?)`,
      stallId,
      data.name,
      data.price,
      data.gambar ?? null,
    );
    setMenu(await loadMenuFromDatabase());
    setMenuError(null);
  };

  const ubahMenu = async (
    warungId: string,
    menuId: string,
    data: Omit<MenuItem, "id">,
  ) => {
    const stallId = getDatabaseId(warungId, "ID warung");
    const itemId = getDatabaseId(menuId, "ID menu");
    const db = await dbPromise;
    const result = await db.runAsync(
      `UPDATE menu_items
       SET name = ?, price = ?, image_uri = ?
       WHERE id = ? AND stall_id = ?`,
      data.name,
      data.price,
      data.gambar ?? null,
      itemId,
      stallId,
    );

    if (result.changes === 0) {
      throw new Error("Menu tidak ditemukan di warung ini.");
    }

    setMenu(await loadMenuFromDatabase());
    setMenuError(null);
  };

  const hapusMenu = async (warungId: string, menuId: string) => {
    const stallId = getDatabaseId(warungId, "ID warung");
    const itemId = getDatabaseId(menuId, "ID menu");
    const db = await dbPromise;
    const result = await db.runAsync(
      "DELETE FROM menu_items WHERE id = ? AND stall_id = ?",
      itemId,
      stallId,
    );

    if (result.changes === 0) {
      throw new Error("Menu tidak ditemukan di warung ini.");
    }

    setMenu(await loadMenuFromDatabase());
    setMenuError(null);
  };

  return (
    <AppContext.Provider
      value={{
        nomorMeja,
        setNomorMeja,
        cart,
        tambahKeKeranjang,
        ubahJumlah,
        checkout,
        pesanan,
        konfirmasiDiterima,
        warungList,
        menu,
        menuLoading,
        menuError,
        tambahMenu,
        ubahMenu,
        hapusMenu,
        owner,
        setOwner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp harus dipakai di dalam AppProvider");
  }
  return context;
}
