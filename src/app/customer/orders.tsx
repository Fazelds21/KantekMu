import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function ActiveOrdersScreen() {
  const { pesanan, konfirmasiDiterima } = useApp();

  // Konfirmasi pesanan diterima per item, bukan keseluruhan checkout
  const handleKonfirmasiDiterima = (pesananId: number, itemId: string, menuName: string) => {
    Alert.alert("Konfirmasi Makanan", `Apakah pesanan ${menuName} sudah diantarkan ke meja Anda?`, [
      { text: "Belum", style: "cancel" },
      { text: "Sudah Terima", onPress: () => konfirmasiDiterima(pesananId, itemId) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Pesanan Aktif" />

      {pesanan.length === 0 && <Text style={styles.emptyText}>Belum ada pesanan</Text>}

      {/* Loop tiap pesanan (tiap checkout) */}
      {pesanan.map((p) => {
        // Nama warung di pesanan ini (tanpa duplikat)
        const daftarWarung = [...new Set(p.items.map((i) => i.warung))];

        return (
          <View key={p.id} style={styles.pesananBox}>
            {/* Nomor pesanan & meja */}
            <View style={styles.pesananHeader}>
              <Text style={styles.pesananHeaderText}>Pesanan #{p.id}</Text>
              <Text style={styles.pesananHeaderText}>Meja {p.meja}</Text>
            </View>

            {/* Loop per warung */}
            {daftarWarung.map((namaWarung) => (
              <View key={namaWarung} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Feather name="shopping-bag" size={16} color="#C2410C" />
                  <Text style={styles.warungText}>{namaWarung}</Text>
                </View>

                {/* Loop item di warung itu */}
                {p.items
                  .filter((item) => item.warung === namaWarung)
                  .map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <View>
                        <Text style={styles.menuText}>{item.menu} x{item.qty}</Text>
                        <Text style={{ fontSize: 12, marginTop: 4, color: item.isReceived ? "#059669" : "#DC2626" }}>
                          Status: {item.isReceived ? "Selesai" : "Menunggu Diantar"}
                        </Text>
                      </View>

                      {/* Tombol hanya muncul jika makanan belum diterima */}
                      {!item.isReceived ? (
                        <TouchableOpacity
                          style={styles.confirmBtn}
                          onPress={() => handleKonfirmasiDiterima(p.id, item.id, item.menu)}
                        >
                          <Text style={styles.confirmBtnText}>Terima</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.doneBadge}>
                          <Feather name="check" size={14} color="#FFF" />
                          <Text style={styles.doneBadgeText}>Diterima</Text>
                        </View>
                      )}
                    </View>
                  ))}
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  emptyText: { textAlign: "center", marginTop: 24, color: "#6B7280" },

  // kepala tiap pesanan
  pesananBox: { marginBottom: 8 },
  pesananHeader: { marginHorizontal: 16, marginBottom: 12, backgroundColor: "#D4A373", padding: 8, borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
  pesananHeaderText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  // kartu per warung
  card: { marginHorizontal: 16, backgroundColor: "#E9EDC9", borderRadius: 8, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, borderBottomWidth: 1, borderColor: "#CCD5AE", paddingBottom: 8 },
  warungText: { marginLeft: 8, fontSize: 14, fontWeight: "700", color: "#C2410C" },

  // item
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  menuText: { fontSize: 16, fontWeight: "600" },
  confirmBtn: { backgroundColor: "#D4A373", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  confirmBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  doneBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#059669", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  doneBadgeText: { color: "#FFF", fontWeight: "bold", fontSize: 12, marginLeft: 4 },
});