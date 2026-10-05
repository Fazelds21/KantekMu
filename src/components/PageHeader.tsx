import { ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Banner yang dipakai di halaman dalam: foto + tombol kembali + judul
type PageHeaderProps = {
  title: string;
  image?: ImageSourcePropType; // kalau kosong, pakai banner KantekMu
  showBack?: boolean;          // kalau false, tombol kembali disembunyikan
};

export default function PageHeader({
  title,
  image = require("@/assets/images/KantekMu.png"),
  showBack = true,
}: PageHeaderProps) {
  const router = useRouter();

  // Kalau ada halaman sebelumnya mundur, kalau tidak ada balik ke halaman utama
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View>
      <ImageBackground source={image} style={styles.banner} resizeMode="cover">
        <View style={styles.overlay}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Feather name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { width: "100%", height: 150 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(11, 19, 53, 0.5)", paddingHorizontal: 16, paddingTop: 30 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" },
  title: { marginHorizontal: 16, fontSize: 20, fontWeight: "bold", backgroundColor: "#D4A373", color: "#FFF", padding: 8, borderRadius: 8, marginTop: -20, marginBottom: 12 },
});