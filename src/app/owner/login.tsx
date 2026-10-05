import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useApp, DAFTAR_OWNER } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function OwnerLoginScreen() {
  const router = useRouter();
  const { setOwner } = useApp();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Cek username & password, kalau cocok masuk ke dashboard owner
  const handleLogin = () => {
    const akun = DAFTAR_OWNER.find((o) => o.username === username && o.password === password);

    if (!akun) {
      Alert.alert("Login Gagal", "Username atau password salah");
      return;
    }

    setOwner(akun);
    router.replace("/owner");
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Login Owner" />

      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Masukkan username"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Masuk</Text>
        </TouchableOpacity>

        {/* Inline style: petunjuk akun contoh, hapus kalau backend sudah jadi */}
        <Text style={{ marginTop: 16, fontSize: 12, color: "#6B7280", textAlign: "center" }}>
          Akun contoh: busiti / 1234
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  form: { marginHorizontal: 16, backgroundColor: "#E9EDC9", padding: 16, borderRadius: 8 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#FFF", borderRadius: 8, padding: 12, marginBottom: 16 },
  loginBtn: { backgroundColor: "#D4A373", padding: 14, borderRadius: 8, alignItems: "center" },
  loginBtnText: { color: "#FFF", fontWeight: "bold" },
});