
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
} from "react-native";

import { AppProvider } from "../context/AppContext";
import { initDatabase } from "../database/initDatabase";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepareDatabase() {
      try {
        await initDatabase();
        setIsReady(true);
      } catch (err) {
        console.error("Gagal menyiapkan database:", err);
        setError("Database gagal disiapkan.");
      }
    }

    prepareDatabase();
  }, []);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text>Menyiapkan database...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
