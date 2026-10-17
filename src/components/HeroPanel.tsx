import { View, Text } from "react-native";
import { styles } from "../styles/loginStyles";

export default function HeroPanel() {
  return (
    <View nativeID="login-hero" style={styles.heroPanel}>
      <View style={styles.heroBrand}>
        <View style={styles.heroBrandMark}>
          <Text style={styles.heroBrandMarkText}>K</Text>
        </View>
        <Text style={styles.heroBrandName}>KantekMu</Text>
      </View>

      <View style={styles.heroCopy}>
        <Text style={styles.heroEyebrow}>PENGALAMAN MAKAN LEBIH BAIK</Text>
        <Text style={styles.heroTitle}>
          Your Table.{"\n"}Your Order.{"\n"}Your Way.
        </Text>
        <Text style={styles.heroSubtitle}>
          Solusi kemudahan dalam pemesanan. Pesan meja favoritmu dan nikmati
          momen tanpa menunggu.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroCardIcon}>
          <Text style={styles.heroCardIconText}>✓</Text>
        </View>
        <View style={styles.heroCardCopy}>
          <Text style={styles.heroCardTitle}>Semua jadi lebih mudah</Text>
          <Text style={styles.heroCardSubtitle}>
            Reservasi praktis, kapan saja.
          </Text>
        </View>
        <View style={styles.heroCardDot} />
      </View>
      <View style={styles.heroDecoration} />
      <View style={styles.heroDecorationSmall} />
    </View>
  );
}
