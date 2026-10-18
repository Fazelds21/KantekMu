import AuthPageLayout from "@/components/AuthPageLayout";
import { registerUser } from "@/services/authService";
import { styles } from "@/styles/loginStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
  Alert,
} from "react-native";

type RegisterRole = "owner" | "customer";

type RegisterField = {
  id: string;
  label: string;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
};

const REGISTER_FIELDS: RegisterField[] = [
  {
    id: "username",
    label: "Username",
    placeholder: "Buat username",
    keyboardType: "default",
    autoCapitalize: "none",
    autoCorrect: false,
  },
  {
    id: "password",
    label: "Password",
    placeholder: "Buat password",
    keyboardType: "default",
    autoCapitalize: "none",
    secureTextEntry: true,
    autoCorrect: false,
  },
  {
    id: "email",
    label: "E-mail",
    placeholder: "Masukkan E-mail",
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
  },
];

const REGISTER_ROLES: { value: RegisterRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "customer", label: "Customer" },
];

export default function RegisterPage() {
  const ROUTER = useRouter();

  const [role, setRole] = useState<RegisterRole>("customer");
  const [rememberMe, setRememberMe] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await registerUser({
        username,
        email,
        password,
        role,
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat.");

      ROUTER.replace("/LoginPage");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftar.";

      Alert.alert("Registrasi gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageLayout screenID="register-screen" panelID="register-form-panel">
      <View style={styles.formContent}>
        <View>
          <Text style={styles.eyebrow}>GABUNG BERSAMA KAMI</Text>
          <Text style={styles.title}>Mulai Perjalananmu!</Text>
          <Text style={styles.subtitle}>
            Buat akun untuk menikmati kemudahan memesan makanan di Kantin Teknik
            bersama KantekMu.
          </Text>

          <View style={styles.roleBlock}>
            <Text style={styles.fieldLabel}>Daftar sebagai</Text>
            <View style={styles.roleSelector}>
              {REGISTER_ROLES.map((RegisterRole) => (
                <Pressable
                  key={RegisterRole.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: role === RegisterRole.value }}
                  onPress={() => setRole(RegisterRole.value)}
                  style={[
                    styles.roleOption,
                    role === RegisterRole.value && styles.selectedRoleOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      role === RegisterRole.value && styles.selectedRoleText,
                    ]}
                  >
                    {RegisterRole.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text
              style={[
                styles.roleHint,
                { color: role === "owner" ? "#6B2EEF" : "#89889A" },
              ]}
            >
              {role === "owner"
                ? "Daftarkan warungmu dan mulai kelola menu serta pesanan."
                : "Buat akun dan nikmati kemudahan memesan makanan di kantin."}
            </Text>
          </View>
        </View>

        {REGISTER_FIELDS.map((field) => (
          <View key={field.id} style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              accessibilityLabel={field.label}
              autoCapitalize={field.autoCapitalize}
              autoCorrect={field.autoCorrect}
              keyboardType={field.keyboardType}
              nativeID={`login-${field.id}`}
              placeholder={field.placeholder}
              placeholderTextColor="#9A9AAF"
              secureTextEntry={field.secureTextEntry}
              selectionColor="#6B2EEF"
              style={styles.textInput}
              value={
                field.id === "username"
                  ? username
                  : field.id === "email"
                    ? email
                    : password
              }
              onChangeText={(value) => {
                if (field.id === "username") setUsername(value);
                else if (field.id === "email") setEmail(value);
                else setPassword(value);
              }}
            />
          </View>
        ))}

        <View>
          <Pressable style={styles.loginButton} onPress={handleRegister} disabled={isSubmitting}>
            <Text style={styles.loginButtonText}>{isSubmitting ? "Memproses..." : "Daftar"}</Text>
          </Pressable>
        </View>

        <View style={styles.signupPrompt}>
          <Text style={styles.signupText}>Sudah punya akun?</Text>
          <Pressable>
            <Text
              onPress={() => ROUTER.replace("/LoginPage")}
              style={styles.signupLink}
              accessibilityRole="button"
            >
              Masuk sekarang
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthPageLayout>
  );
}
