import { Redirect } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useApp, OrderItem } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function OwnerPesananScreen() {
  const { owner, pesanan } = useApp();

  if (!owner) return <Redirect href="/owner/login" />;

  // Ambil hanya item milik warung ini. Pesanan yang tidak punya item warung ini dibuang.
  const pesananMasuk = pesanan
    .map((p) => ({ ...p, items: p.items.filter((item) => item.warung === owner.namaWarung) }))
    .filter((p) => p.items.length > 0);

  // Custom Function: menghitung total harga satu pesanan
  const hitungTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.harga * item.qty, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Pesanan Masuk" showBack={false} />

      {pesananMasuk.length === 0 && <Text style={styles.emptyText}>Belum ada pesanan masuk</Text>}

      {/* Loop tiap pesanan masuk */}
      {pesananMasuk.map((p) => (
        <View key={p.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Pesanan #{p.id}</Text>
            <View style={styles.mejaBadge}>
              <Text style={styles.mejaText}>Meja {p.meja}</Text>
            </View>
          </View>

          {/* Loop item di pesanan ini */}
          {p.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>{item.menu} × {item.qty}</Text>
              {item.catatan ? <Text style={styles.catatan}>Catatan: {item.catatan}</Text> : null}
            </View>
          ))}

          <View style={styles.cardFooter}>
            <Text style={{ color: "#6B7280" }}>{p.waktu}</Text>
            <Text style={styles.total}>Rp {hitungTotal(p.items)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  emptyText: { textAlign: "center", marginTop: 24, color: "#6B7280" },

  // kartu pesanan
  card: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, borderRadius: 8, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottomWidth: 1, borderColor: "#CCD5AE", paddingBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#C2410C" },
  mejaBadge: { backgroundColor: "#D4A373", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  mejaText: { color: "#FFF", fontWeight: "bold" },
  itemRow: { paddingVertical: 4 },
  itemText: { fontSize: 16, fontWeight: "600" },
  catatan: { fontSize: 12, color: "#6B7280" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: "#CCD5AE" },
  total: { fontWeight: "bold", fontSize: 16 },
});