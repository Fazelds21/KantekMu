import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

// ====== DATA ======
type MenuItem = { id: string; name: string; price: number };

// Menu tiap warung (kunci = id warung). Id menu dibuat unik antar warung.
const MENU_DATA: Record<string, MenuItem[]> = {
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

// ====== HALAMAN ======
export default function DetailWarungScreen() {
  const router = useRouter();
  const { id, nama } = useLocalSearchParams<{ id: string; nama: string }>(); // dikirim dari halaman daftar warung
  const { cart, tambahKeKeranjang } = useApp();

  const daftarMenu = MENU_DATA[id] ?? [];

  // Masukkan menu ke keranjang
  const handleAddToCart = (menu: MenuItem) => {
    tambahKeKeranjang({ id: menu.id, name: menu.name, price: menu.price, warungId: id, warung: nama });
  };

  // Jumlah menu ini yang sudah ada di keranjang (0 kalau belum ada)
  const jumlahDiKeranjang = (menuId: string) => {
    const item = cart.find((c) => c.id === menuId);
    return item ? item.qty : 0;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <PageHeader title={`Menu ${nama}`} />
        {/* DAFTAR MENU */}
        {daftarMenu.map((menu) => (
          <View key={menu.id} style={styles.menuCard}>
            <View>
              <Text style={styles.menuName}>{menu.name}</Text>
              <Text style={{ color: "#C2410C" }}>Rp {menu.price}</Text>
              {jumlahDiKeranjang(menu.id) > 0 && (
                <Text style={{ fontSize: 12, color: "gray" }}>Di keranjang: {jumlahDiKeranjang(menu.id)}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(menu)}>
              <Feather name="plus" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* TOMBOL KERANJANG: muncul kalau keranjang ada isinya */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => router.push("/customer/cart")}>
          <Text style={styles.cartBarText}>Lihat Keranjang ({cart.length} menu)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ====== STYLE ======
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },

  // daftar menu
  menuCard: { marginHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#E9EDC9", padding: 16, marginBottom: 12, borderRadius: 8 },
  menuName: { fontSize: 16, fontWeight: "600" },
  addButton: { backgroundColor: "#D4A373", padding: 8, borderRadius: 8 },

  // tombol keranjang
  cartBar: { backgroundColor: "#D4A373", padding: 16, margin: 16, borderRadius: 8, alignItems: "center" },
  cartBarText: { color: "#FFF", fontWeight: "bold" },
});