import { useState } from "react";
import { Redirect, useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";
import { createOwnerStall } from "@/services/authService";

export default function SetupStallScreen() {
  const router = useRouter();
  const {
    ownerAccountId,
    setOwner,
    setOwnerAccountId,
    refreshWarungDanMenu,
  } = useApp();
  const [stallName, setStallName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (ownerAccountId === null) {
    return <Redirect href="/" />;
  }

  const handleSave = async () => {
    if (isSubmitting) return;
    if (!stallName.trim()) {
      Alert.alert("Nama warung wajib diisi", "Masukkan nama warung terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const stall = await createOwnerStall(ownerAccountId, stallName);
      setOwner(stall);
      setOwnerAccountId(null);
      await refreshWarungDanMenu();
      router.replace("/owner");
    } catch (error) {
      console.error("Gagal menyimpan data warung:", error);
      Alert.alert(
        "Gagal menyimpan data warung",
        error instanceof Error ? error.message : "Terjadi kesalahan database.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PageHeader title="Lengkapi Data Warung" showBack={false} />
      <View style={styles.form}>
        <Text style={styles.title}>Selamat datang, Owner!</Text>
        <Text style={styles.description}>
          Sebelum mulai mengelola menu, isi nama warungmu terlebih dahulu.
        </Text>

        <Text style={styles.label}>Nama Warung</Text>
        <TextInput
          accessibilityLabel="Nama Warung"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setStallName}
          placeholder="Contoh: Warung Bu Siti"
          style={styles.input}
          value={stallName}
        />

        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.button,
            pressed && !isSubmitting && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Menyimpan..." : "Simpan dan lanjutkan"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FEFAE0",
    paddingBottom: 24,
  },
  form: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#E9EDC9",
  },
  title: {
    color: "#242238",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  label: {
    color: "#302E43",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#D4A373",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
