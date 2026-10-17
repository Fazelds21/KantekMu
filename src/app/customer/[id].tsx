import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApp, type MenuItem } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function DetailWarungScreen() {
  const router = useRouter();
  const { id, nama } = useLocalSearchParams<{ id: string; nama: string }>();
  const { cart, menu, menuError, menuLoading, tambahKeKeranjang } = useApp();

  const daftarMenu = menu[id] ?? [];

  const handleAddToCart = (menu: MenuItem) => {
    tambahKeKeranjang({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      warungId: id,
      warung: nama,
    });
  };

  const jumlahDiKeranjang = (menuId: string) => {
    const item = cart.find((c) => c.id === menuId);
    return item ? item.qty : 0;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <PageHeader title={`Menu ${nama}`} />
        {menuLoading && <ActivityIndicator style={styles.message} />}
        {menuError && <Text style={styles.message}>{menuError}</Text>}
        {!menuLoading && !menuError && daftarMenu.length === 0 && (
          <Text style={styles.message}>Belum ada menu tersedia.</Text>
        )}
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
  message: { marginTop: 24, textAlign: "center", color: "#6B7280" },

  menuCard: { marginHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#E9EDC9", padding: 16, marginBottom: 12, borderRadius: 8 },
  menuName: { fontSize: 16, fontWeight: "600" },
  addButton: { backgroundColor: "#D4A373", padding: 8, borderRadius: 8 },

  cartBar: { backgroundColor: "#D4A373", padding: 16, margin: 16, borderRadius: 8, alignItems: "center" },
  cartBarText: { color: "#FFF", fontWeight: "bold" },
});