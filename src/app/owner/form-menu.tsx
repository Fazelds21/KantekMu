import { useState } from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  useApp,
  type MenuItem,
  type OwnerWarung,
} from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function FormMenuScreen() {
  const { menuId } = useLocalSearchParams<{ menuId?: string }>(); // ada = edit, kosong = tambah
  const { owner, menu, menuError, menuLoading } = useApp();
  if (!owner) return <Redirect href="/" />;
  if (menuLoading) {
    return (
      <View style={styles.message}>
        <ActivityIndicator />
        <Text>Memuat menu...</Text>
      </View>
    );
  }
  if (menuError) {
    return (
      <View style={styles.message}>
        <Text>{menuError}</Text>
      </View>
    );
  }

  const menuLama = menuId
    ? menu[owner.warungId]?.find((item) => item.id === menuId)
    : undefined;
  if (menuId && !menuLama) {
    return (
      <View style={styles.message}>
        <Text>Menu yang ingin diedit tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <MenuForm
      key={menuLama?.id ?? "new"}
      owner={owner}
      menuLama={menuLama}
    />
  );
}

function MenuForm({
  owner,
  menuLama,
}: {
  owner: OwnerWarung;
  menuLama?: MenuItem;
}) {
  const router = useRouter();
  const { tambahMenu, ubahMenu } = useApp();
  const [nama, setNama] = useState(menuLama?.name ?? "");
  const [harga, setHarga] = useState(menuLama ? String(menuLama.price) : "");
  const [gambar, setGambar] = useState(menuLama?.gambar ?? "");

  // Cek isian, lalu simpan sebagai menu baru atau perubahan menu lama
  const handleSimpan = async () => {
    const hargaAngka = Number(harga);

    if (nama.trim() === "" || !hargaAngka || hargaAngka <= 0) {
      Alert.alert("Data belum lengkap", "Nama menu dan harga wajib diisi dengan benar");
      return;
    }

    const data = { name: nama.trim(), price: hargaAngka, gambar: gambar.trim() };

    try {
      if (menuLama) {
        await ubahMenu(owner.warungId, menuLama.id, data);
      } else {
        await tambahMenu(owner.warungId, data);
      }
      router.back();
    } catch (error) {
      console.error("Gagal menyimpan menu:", error);
      Alert.alert(
        "Gagal menyimpan menu",
        error instanceof Error ? error.message : "Terjadi kesalahan database.",
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={menuLama ? "Edit Menu" : "Tambah Menu"} />

      <View style={styles.form}>
        <Text style={styles.label}>Nama Menu</Text>
        <TextInput style={styles.input} value={nama} onChangeText={setNama} placeholder="Contoh: Nasi Goreng" />

        <Text style={styles.label}>Harga</Text>
        <TextInput
          style={styles.input}
          value={harga}
          onChangeText={setHarga}
          placeholder="Contoh: 15000"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Link Gambar (opsional)</Text>
        <TextInput
          style={styles.input}
          value={gambar}
          onChangeText={setGambar}
          placeholder="https://..."
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.simpanBtn} onPress={handleSimpan}>
          <Text style={styles.simpanText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  message: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  form: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, borderRadius: 8 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#FFF", borderRadius: 8, padding: 12, marginBottom: 16 },
  simpanBtn: { backgroundColor: "#D4A373", padding: 14, borderRadius: 8, alignItems: "center" },
  simpanText: { color: "#FFF", fontWeight: "bold" },
});