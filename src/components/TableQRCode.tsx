
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

type TableQRCodeProps = {
  tableNumber: number;
  identifier: string;
};

export default function TableQRCode({
  tableNumber,
  identifier,
}: TableQRCodeProps) {
  const qrValue = `KANTEKMU:TABLE:${identifier}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meja {tableNumber}</Text>

      <QRCode
        value={qrValue}
        size={220}
        backgroundColor="white"
        color="black"
      />

      <Text style={styles.description}>
        Scan QR untuk mulai memesan
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "white",
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222222",
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
});
