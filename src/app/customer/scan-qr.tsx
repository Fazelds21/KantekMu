import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";

export default function ScanQRScreen() {
  const router = useRouter();
  const { setNomorMeja } = useApp();

  // Simulasi: anggap QR yang discan berisi "Meja 07".
  // Nanti kalau kamera sungguhan sudah dipasang, tinggal ganti "07" dengan hasil scan.
  const handleScanSukses = () => {
    setNomorMeja("07");
    router.replace("/customer");
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerBox}>
        <Feather name="maximize" size={200} color="#FFF" />
        <Text style={styles.text}>Arahkan kamera ke QR di meja Anda</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleScanSukses}>
        <Text style={{ color: "#FFF" }}>Simulasi Scan Sukses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  scannerBox: { alignItems: "center", marginBottom: 40 },
  text: { color: "#FFF", marginTop: 20, fontSize: 16 },
  btn: { backgroundColor: "#C2410C", padding: 16, borderRadius: 8 },
});
