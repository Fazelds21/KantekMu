import { useState } from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function FormMenuScreen() {
  const router = useRouter();
  const { menuId } = useLocalSearchParams<{ menuId?: string }>(); // ada = edit, kosong = tambah
  const { owner, menu, tambahMenu, ubahMenu } = useApp();

  // Cari data menu lama (hanya kalau mode edit)
  const menuLama = owner && menuId ? menu[owner.warungId]?.find((m) => m.id === menuId) : undefined;

  const [nama, setNama] = useState(menuLama?.name ?? "");
  const [harga, setHarga] = useState(menuLama ? String(menuLama.price) : "");
  const [gambar, setGambar] = useState(menuLama?.gambar ?? "");

  if (!owner) return <Redirect href="/owner/login" />;

  // Cek isian, lalu simpan sebagai menu baru atau perubahan menu lama
  const handleSimpan = () => {
    const hargaAngka = Number(harga);

    if (nama.trim() === "" || !hargaAngka || hargaAngka <= 0) {
      Alert.alert("Data belum lengkap", "Nama menu dan harga wajib diisi dengan benar");
      return;
    }

    const data = { name: nama.trim(), price: hargaAngka, gambar: gambar.trim() };

    if (menuLama) {
      ubahMenu(owner.warungId, menuLama.id, data);
    } else {
      tambahMenu(owner.warungId, data);
    }
    router.back();
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
  form: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, borderRadius: 8 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#FFF", borderRadius: 8, padding: 12, marginBottom: 16 },
  simpanBtn: { backgroundColor: "#D4A373", padding: 14, borderRadius: 8, alignItems: "center" },
  simpanText: { color: "#FFF", fontWeight: "bold" },
});