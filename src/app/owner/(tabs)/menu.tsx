import { Redirect, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function OwnerMenuScreen() {
  const router = useRouter();
  const { owner, menu, hapusMenu } = useApp();

  if (!owner) return <Redirect href="/owner/login" />;

  const daftarMenu = menu[owner.warungId] ?? [];

  // Tanya dulu sebelum menghapus
  const handleHapus = (menuId: string, nama: string) => {
    Alert.alert("Hapus Menu", `Yakin ingin menghapus ${nama}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => hapusMenu(owner.warungId, menuId) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Kelola Menu" showBack={false} />
      <TouchableOpacity style={styles.tambahBtn} onPress={() => router.push("/owner/form-menu")}>
        <Feather name="plus" size={18} color="#FFF" />
        <Text style={styles.tambahText}>Tambah Menu</Text>
      </TouchableOpacity>

      {daftarMenu.length === 0 && <Text style={styles.emptyText}>Belum ada menu</Text>}

      {/* Loop daftar menu */}
      {daftarMenu.map((m) => (
        <View key={m.id} style={styles.card}>
          {m.gambar ? (
            <Image source={{ uri: m.gambar }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.fotoKosong]}>
              <Feather name="image" size={24} color="#6B7280" />
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.menuName}>{m.name}</Text>
            <Text style={{ color: "#C2410C" }}>Rp {m.price}</Text>
          </View>

          <TouchableOpacity
            style={styles.aksiBtn}
            onPress={() => router.push({ pathname: "/owner/form-menu", params: { menuId: m.id } })}
          >
            <Feather name="edit-2" size={16} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aksiBtn} onPress={() => handleHapus(m.id, m.name)}>
            <Feather name="trash-2" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  emptyText: { textAlign: "center", marginTop: 24, color: "#6B7280" },

  tambahBtn: { marginHorizontal: 16, marginBottom: 12, backgroundColor: "#D4A373", padding: 12, borderRadius: 8, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 },
  tambahText: { color: "#FFF", fontWeight: "bold" },

  card: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 12, borderRadius: 8, marginBottom: 12, flexDirection: "row", alignItems: "center" },
  foto: { width: 56, height: 56, borderRadius: 8 },
  fotoKosong: { backgroundColor: "#CCD5AE", justifyContent: "center", alignItems: "center" },
  info: { flex: 1, marginLeft: 12 },
  menuName: { fontSize: 16, fontWeight: "600" },
  aksiBtn: { backgroundColor: "#D4A373", padding: 8, borderRadius: 8, marginLeft: 8 },
});