import AuthPageLayout from "@/components/AuthPageLayout";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { loginUser } from "@/services/authService";
import {
  Pressable,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  View,
  Alert,
} from "react-native";
import { styles } from "../styles/loginStyles";

type LoginRole = "owner" | "customer";

type LoginField = {
  userName: string;
  label: string;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
};

const LOGIN_FIELDS: LoginField[] = [
  {
    userName: "username",
    label: "Username atau email",
    placeholder: "Masukkan username atau email",
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
  },
  {
    userName: "password",
    label: "Password",
    placeholder: "Masukkan password",
    secureTextEntry: true,
    autoCapitalize: "none",
  },
];

const LOGIN_ROLES: { value: LoginRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "customer", label: "Customer" },
];

export default function LoginPage() {
  const ROUTER = useRouter();
  const { setOwner, setOwnerAccountId } = useApp();
  const [role, setRole] = useState<LoginRole>("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const user = await loginUser({ identifier, password, role });

      if (user.role === "owner") {
        setOwnerAccountId(user.id);
        if (user.stall) {
          setOwner(user.stall);
          ROUTER.replace("/owner");
        } else {
          setOwner(null);
          ROUTER.replace("/owner/setup-stall");
        }
      } else {
        setOwner(null);
        setOwnerAccountId(null);
        ROUTER.replace("/customer");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat masuk.";
      Alert.alert("Login gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageLayout screenID="login-screen" panelID="login-form-panel">
      <View style={styles.formContent}>
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>SELAMAT DATANG</Text>
          <Text style={styles.title}>Senang melihatmu lagi!</Text>
          <Text style={styles.subtitle}>
            Masuk untuk melanjutkan pengalaman terbaik bersama KantekMu.
          </Text>
        </View>

        <View style={styles.roleBlock}>
          <Text style={styles.fieldLabel}>Masuk sebagai</Text>
          <View style={styles.roleSelector}>
            {LOGIN_ROLES.map((loginRole) => (
              <Pressable
                key={loginRole.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: role === loginRole.value }}
                onPress={() => setRole(loginRole.value)}
                style={[
                  styles.roleOption,
                  role === loginRole.value && styles.selectedRoleOption,
                ]}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    role === loginRole.value && styles.selectedRoleText,
                  ]}
                >
                  {loginRole.label}
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
              ? "Kelola meja dan pesanan restoranmu."
              : "Temukan meja dan pesan dengan mudah."}
          </Text>
        </View>

        {LOGIN_FIELDS.map((field) => (
          <View key={field.userName} style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              accessibilityLabel={field.label}
              autoCapitalize={field.autoCapitalize}
              autoCorrect={field.autoCorrect}
              keyboardType={field.keyboardType}
              nativeID={`login-${field.userName}`}
              placeholder={field.placeholder}
              placeholderTextColor="#9A9AAF"
              secureTextEntry={field.secureTextEntry}
              selectionColor="#6B2EEF"
              style={styles.textInput}
              value={field.userName === "username" ? identifier : password}
              onChangeText={
                field.userName === "username" ? setIdentifier : setPassword
              }
            />
          </View>
        ))}

        <View style={styles.formOptions}>
          <View style={styles.rememberOption}>
            <Switch
              accessibilityLabel="Ingat saya"
              onValueChange={setRememberMe}
              thumbColor="#FFFFFF"
              trackColor={{ false: "#D9D8E2", true: "#6B2EEF" }}
              value={rememberMe}
            />
            <Text style={styles.rememberText}>Ingat Saya</Text>
          </View>
          <Pressable accessibilityRole="button">
            <Text style={styles.forgotPassword}>Lupa Password?</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
        >
          <Text style={styles.loginButtonText}>
            {isSubmitting
              ? "Memeriksa akun..."
              : `Masuk sebagai ${role === "owner" ? "Owner" : "Customer"}`}
          </Text>
          <Text style={styles.loginButtonArrow}>→</Text>
        </Pressable>

        <View style={styles.signupPrompt}>
          <Text style={styles.signupText}>Belum punya akun? </Text>
          <Pressable
            onPress={() => ROUTER.replace("/RegisterPage")}
            accessibilityRole="button"
          >
            <Text style={styles.signupLink}>Daftar sekarang</Text>
          </Pressable>
        </View>
      </View>
    </AuthPageLayout>
  );
}
