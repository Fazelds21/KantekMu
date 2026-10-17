
import { View, StyleSheet } from "react-native";
import TableQRCode from "@/components/TableQRCode";

export default function QRPreview() {
  return (
    <View style={styles.container}>
      <TableQRCode
        tableNumber={1}
        identifier="table-a81x"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F5",
  },
});
