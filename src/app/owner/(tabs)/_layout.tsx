import { Tabs } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

export default function OwnerTabsLayout() {
  const { owner, pesanan } = useApp();

  // Jumlah pesanan yang berisi item dari warung ini (untuk angka di tab Pesanan)
  const jumlahPesanan = owner
    ? pesanan.filter((p) => p.items.some((item) => item.warung === owner.namaWarung)).length
    : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#C2410C",
        tabBarInactiveTintColor: "#6B4F3A",
        tabBarStyle: { backgroundColor: "#FEFAE0", borderTopColor: "#D4A373" },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: -4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="pesanan"
        options={{
          title: "Pesanan",
          tabBarBadge: jumlahPesanan > 0 ? jumlahPesanan : undefined,
          tabBarBadgeStyle: { backgroundColor: "#C2410C", color: "#FFF" },
          tabBarIcon: ({ color, size }) => <Feather name="clipboard" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="silverware-fork-knife" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}