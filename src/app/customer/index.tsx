import { useRouter } from "expo-router";
import {
  Image, ImageBackground, ImageSourcePropType, ScrollView, StatusBar, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

// ====== DATA ======

// KETENTUAN: Menerapkan Type
type WarungType = {
  id: string;
  name: string;
  rating: string;
  distance: string;
  status: string;
  categories: string;
  badge: string;
  badgeType: string;
  badgeLabel?: string;
  image: ImageSourcePropType;
};

// KETENTUAN: Menerapkan Array of Objects
const WARUNG_LIST: WarungType[] = [
  {
    id: "1", name: "Warung Bu Siti", rating: "4.8", distance: "150m", status: "Buka",
    categories: "Ayam Bakar, Nasi Uduk, Soto Lamon...", badge: "Paling Laris", badgeType: "fire",
    badgeLabel: "Meja Anda", image: require("@/assets/images/ayam-bakar.jpeg"),
  },
  {
    id: "2", name: "Warung Soto Lamongan", rating: "4.7", distance: "200m", status: "Buka",
    categories: "Soto Ayam Koya Gurih, Rawon Dagin...", badge: "Antar ~10 mnt", badgeType: "clock",
    image: require("@/assets/images/soto-lamongan.jpeg"),
  },
];

// ====== HALAMAN ======
export default function CustomerDashboard() {
  const router = useRouter();
  const { nomorMeja, cart, pesanan } = useApp(); // data bersama

  // KETENTUAN: Menerapkan Deklarasi Custom Function
  const handlePilihWarung = (id: string, nama: string) => {
    router.push({
      pathname: "/customer/[id]",
      params: { id, nama },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* BANNER: tombol pesanan & keranjang */}
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

      {/* FITUR: Melihat nomor meja */}
      <View style={styles.nomorMeja}>
        <Text style={styles.nomorMejaText}>Nomor Meja: {nomorMeja}</Text>
      </View>

      {/* DAFTAR WARUNG */}
      <View style={styles.sectionContainer}>
        <Text style={styles.pesananAktif}>Pesanan aktif: {pesanan.length}</Text>
        <Text style={styles.sectionTitle}>Warung Sekitar</Text>

        {/* KETENTUAN: Menerapkan Loop & FITUR: Melihat daftar warung */}
        {WARUNG_LIST.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => handlePilihWarung(item.id, item.name)}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {/* KETENTUAN: Menerapkan Inline Style */}
              <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.categories}</Text>
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

  // daftar warung
  sectionContainer: { padding: 16 },
  pesananAktif: { marginBottom: 12, color: "#6B7280" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  card: { flexDirection: "row", backgroundColor: "#CCD5AE", borderRadius: 16, padding: 12, marginBottom: 12, elevation: 2 },
  cardImage: { width: 90, height: 90, borderRadius: 12 },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700" },
});