import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function HeaderBanner() {
  return (
    <View>
      <ImageBackground
        source={require("@/assets/images/KantekMu.png")}
        style={styles.bannerBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.headerRow}>
            {/* INLINE STYLE: Menerapkan Inline Style untuk spacing */}
            <View style={{ width: 84, backgroundColor: "transparent" }} />
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Feather name="search" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Feather name="menu" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.nomorMeja}>
        <Text style={styles.nomorMejaText}>Nomor Meja: 12</Text>
      </View>
    </View>
  );
}

// EXTERNAL STYLE: Menerapkan External Style melalui StyleSheet
const styles = StyleSheet.create({
  bannerBackground: { width: "100%", height: 200 },
  overlay: { flex: 1, backgroundColor: "rgba(11, 19, 53, 0.5)", paddingTop: 45, paddingHorizontal: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  actionButtons: { flexDirection: "row", gap: 8 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" },
  nomorMeja: { marginHorizontal: 16, marginTop: -20, height: 54, backgroundColor: "#2B1E18", borderRadius: 14, justifyContent: "center", alignItems: "center", elevation: 4 },
  nomorMejaText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});