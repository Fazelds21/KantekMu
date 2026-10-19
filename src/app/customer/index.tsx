import { useRouter } from "expo-router";
import {
  ActivityIndicator, ImageBackground, ScrollView, StatusBar, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

export default function CustomerDashboard() {
  const router = useRouter();
  const {
    nomorMeja,
    cart,
    pesanan,
    warungList,
    menu,
    menuLoading,
    menuError,
  } = useApp();

  const handlePilihWarung = (id: string, nama: string) => {
    router.push({
      pathname: "/customer/[id]",
      params: { id, nama },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={require("@/assets/images/KantekMu.png")} style={styles.bannerBackground} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.push("/customer/orders")} style={styles.iconButton}>
              <Feather name="clipboard" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/customer/cart")} style={styles.iconButton}>
              <Feather name="shopping-cart" size={20} color="#000" />
              {cart.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.nomorMeja}>
        <Text style={styles.nomorMejaText}>Nomor Meja: {nomorMeja}</Text>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.8}
        onPress={() => router.push("/customer/scan-qr")}
      >
        <Feather name="maximize" size={18} color="#FFF" />
        <Text style={styles.scanButtonText}>Scan QR Meja</Text>
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={styles.pesananAktif}>Pesanan aktif: {pesanan.length}</Text>
        <Text style={styles.sectionTitle}>Warung Sekitar</Text>

        {menuLoading && <ActivityIndicator />}
        {menuError && <Text style={styles.emptyMessage}>{menuError}</Text>}
        {!menuLoading && !menuError && warungList.length === 0 && (
          <Text style={styles.emptyMessage}>Belum ada warung terdaftar.</Text>
        )}
        {warungList.map((warung) => (
          <TouchableOpacity
            key={warung.id}
            style={styles.card}
            onPress={() => handlePilihWarung(warung.id, warung.name)}
          >
            <View style={styles.cardImagePlaceholder}>
              <Feather name="shopping-bag" size={30} color="#C2410C" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{warung.name}</Text>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {menu[warung.id]?.length ?? 0} menu tersedia
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ====== STYLE ======
// KETENTUAN: Menerapkan External Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },

  // banner
  bannerBackground: { width: "100%", height: 200 },
  overlay: { flex: 1, backgroundColor: "rgba(11, 19, 53, 0.5)", paddingHorizontal: 16 },
  headerRow: { flexDirection: "row", justifyContent: "flex-end", paddingTop: 20, gap: 8 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginTop: 25 },
  badge: { position: "absolute", top: -4, right: -4, backgroundColor: "#C2410C", borderRadius: 8, minWidth: 16, height: 16, justifyContent: "center", alignItems: "center" },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },

  // nomor meja
  nomorMeja: { marginHorizontal: 16, marginTop: -20, height: 54, backgroundColor: "#D4A373", borderRadius: 14, justifyContent: "center", alignItems: "center" },
  nomorMejaText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  scanButton: { marginHorizontal: 16, marginTop: 12, minHeight: 48, backgroundColor: "#C2410C", borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, elevation: 2 },
  scanButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  // daftar warung
  sectionContainer: { padding: 16 },
  pesananAktif: { marginBottom: 12, color: "#6B7280" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  emptyMessage: { textAlign: "center", marginBottom: 12, color: "#6B7280" },
  card: { flexDirection: "row", backgroundColor: "#CCD5AE", borderRadius: 16, padding: 12, marginBottom: 12, elevation: 2 },
  cardImagePlaceholder: { width: 90, height: 90, borderRadius: 12, backgroundColor: "#E9EDC9", justifyContent: "center", alignItems: "center" },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700" },
});
