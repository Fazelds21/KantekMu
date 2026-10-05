import { Stack } from "expo-router";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  return (
    // AppProvider membungkus semua halaman, jadi semua halaman bisa pakai data keranjang & pesanan
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}