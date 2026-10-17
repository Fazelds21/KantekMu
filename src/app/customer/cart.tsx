import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function CartScreen() {
  const router = useRouter();
  const { cart, ubahJumlah, checkout, nomorMeja } = useApp();

  // Daftar nama warung di keranjang (tanpa duplikat), supaya bisa dikelompokkan
  const daftarWarung = [...new Set(cart.map((item) => item.warung))];

  // Menghitung total semua item
  const hitungTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  // Checkout & pembayaran QRIS
  const handleBayarQRIS = () => {
    Alert.alert("Pembayaran QRIS", `Total Rp ${hitungTotal()}\nSilakan scan kode QRIS berikut...`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Sudah Bayar",
        onPress: () => {
          checkout(); // keranjang berubah jadi pesanan
          Alert.alert("Sukses", "Pembayaran Berhasil!");
          router.replace("/customer/orders");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <PageHeader title={`Keranjang (Meja ${nomorMeja})`} />

        {cart.length === 0 && <Text style={styles.emptyText}>Keranjang masih kosong</Text>}

        {/* Loop per warung, lalu loop item di warung itu */}
        {daftarWarung.map((namaWarung) => (
          <View key={namaWarung} style={styles.card}>
            <Text style={styles.warungName}>{namaWarung}</Text>

            {cart
              .filter((item) => item.warung === namaWarung)
              .map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={{ color: "#C2410C" }}>Rp {item.price * item.qty}</Text>
                  </View>

                  {/* Tombol kurang & tambah jumlah */}
                  <View style={styles.qtyBox}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => ubahJumlah(item.id, -1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => ubahJumlah(item.id, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* TOTAL & TOMBOL BAYAR: muncul kalau keranjang ada isinya */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: Rp {hitungTotal()}</Text>
          <TouchableOpacity style={styles.payBtn} onPress={handleBayarQRIS}>
            <Text style={styles.payBtnText}>Bayar QRIS</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  emptyText: { textAlign: "center", marginTop: 24, color: "#6B7280" },

  // kartu per warung
  card: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, marginBottom: 12, borderRadius: 8 },
  warungName: { fontSize: 14, fontWeight: "700", color: "#C2410C", marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  itemName: { fontSize: 16, fontWeight: "600" },

  // tombol jumlah
  qtyBox: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { backgroundColor: "#D4A373", width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  qtyText: { marginHorizontal: 12, fontWeight: "600" },

  // bagian bawah
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderTopWidth: 1, borderColor: "#D4A373", backgroundColor: "#FEFAE0" },
  totalText: { fontWeight: "bold", fontSize: 16 },
  payBtn: { backgroundColor: "#D4A373", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  payBtnText: { color: "#FFF", fontWeight: "bold" },
});