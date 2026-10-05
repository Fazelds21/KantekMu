import { Redirect, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function OwnerBerandaScreen() {
  const router = useRouter();
  const { owner, setOwner, pesanan, menu } = useApp();

  // Kalau belum login, kembalikan ke halaman login
  if (!owner) return <Redirect href="/owner/login" />;

  // Ringkasan untuk warung ini
// Ambil pesanan milik warung ini (item warung lain dibuang)
  const pesananMasuk = pesanan
    .map((p) => ({ ...p, items: p.items.filter((item) => item.warung === owner.namaWarung) }))
    .filter((p) => p.items.length > 0);

  // Ambil 3 yang terbaru (pesanan baru selalu ditaruh paling depan)
  const pesananTerbaru = pesananMasuk.slice(0, 3);

  const jumlahPesanan = pesananMasuk.length;  const jumlahMenu = (menu[owner.warungId] ?? []).length;

  const handleLogout = () => {
    setOwner(null);
    router.replace("/owner/login");
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Beranda" showBack={false} />

      <View style={styles.welcomeCard}>
        <Text style={{ color: "#6B7280" }}>Selamat datang,</Text>
        <Text style={styles.namaWarung}>{owner.namaWarung}</Text>
      </View>

      {/* Ringkasan: ketuk untuk pindah ke halamannya */}
      <View style={styles.statRow}>
        <TouchableOpacity style={styles.statBox} onPress={() => router.push("/owner/pesanan")}>
          <Text style={styles.statAngka}>{jumlahPesanan}</Text>
          <Text style={styles.statLabel}>Pesanan Masuk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statBox} onPress={() => router.push("/owner/menu")}>
          <Text style={styles.statAngka}>{jumlahMenu}</Text>
          <Text style={styles.statLabel}>Menu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Pesanan Terbaru</Text>

      {pesananTerbaru.length === 0 && <Text style={styles.emptyText}>Belum ada pesanan masuk</Text>}

      {/* Loop 3 pesanan terbaru */}
      {pesananTerbaru.map((p) => (
        <View key={p.id} style={styles.pesananCard}>
          <View>
            <Text style={styles.pesananTitle}>Pesanan #{p.id}</Text>
            <Text style={{ color: "#6B7280" }}>{p.items.length} menu • {p.waktu}</Text>
          </View>
          <View style={styles.mejaBadge}>
            <Text style={styles.mejaText}>Meja {p.meja}</Text>
          </View>
        </View>
      ))}

      {/* Muncul kalau pesanan lebih dari 3 */}
      {pesananMasuk.length > 3 && (
        <TouchableOpacity onPress={() => router.push("/owner/pesanan")}>
          <Text style={styles.lihatSemua}>Lihat semua pesanan →</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },

  welcomeCard: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, borderRadius: 8, marginBottom: 12 },
  namaWarung: { fontSize: 20, fontWeight: "700" },

  statRow: { marginHorizontal: 16, flexDirection: "row", gap: 12, marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: "#CCD5AE", padding: 16, borderRadius: 8, alignItems: "center" },
  statAngka: { fontSize: 28, fontWeight: "bold", color: "#C2410C" },
  statLabel: { fontSize: 14, fontWeight: "600" },

  logoutBtn: { marginHorizontal: 16, backgroundColor: "#D4A373", padding: 14, borderRadius: 8, alignItems: "center" },
  logoutText: { color: "#FFF", fontWeight: "bold" },

  sectionTitle: { marginHorizontal: 16, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  emptyText: { textAlign: "center", marginBottom: 12, color: "#6B7280" },
  pesananCard: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pesananTitle: { fontSize: 16, fontWeight: "700", color: "#C2410C" },
  mejaBadge: { backgroundColor: "#D4A373", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  mejaText: { color: "#FFF", fontWeight: "bold" },
  lihatSemua: { marginHorizontal: 16, marginBottom: 12, textAlign: "center", color: "#C2410C", fontWeight: "600" },
});