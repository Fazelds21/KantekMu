import { useMemo, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles/loginStyles";

type LoginRole = "owner" | "customer";

type LoginField = {
  id: string;
  label: string;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
};

const LOGIN_FIELDS: LoginField[] = [
  {
    id: "username",
    label: "Username",
    placeholder: "Masukkan username",
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
  },
  {
    id: "password",
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

function getRoleLabel(role: LoginRole): string {
  return role === "owner" ? "Owner" : "Customer";
}

export default function LoginPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 850;
  const [role, setRole] = useState<LoginRole>("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectorWidth, setSelectorWidth] = useState(0);
  const [sliderX] = useState(() => new Animated.Value(0));

  const roleSelectorResponder = useMemo(
    () =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sliderX.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const halfWidth = selectorWidth / 2 - 4;
        const startX = role === "customer" ? halfWidth : 0;
        const nextX = Math.max(
          0,
          Math.min(halfWidth, startX + gestureState.dx),
        );
        sliderX.setValue(nextX);
      },
      onPanResponderRelease: (event, gestureState) => {
        const halfWidth = selectorWidth / 2 - 4;
        const isTap = Math.abs(gestureState.dx) < 6;
        const shouldSelectCustomer = isTap
          ? event.nativeEvent.locationX >= selectorWidth / 2
          : (role === "customer" ? halfWidth : 0) + gestureState.dx >=
            halfWidth / 2;
        const nextRole = shouldSelectCustomer ? "customer" : "owner";
        setRole(nextRole);
        Animated.spring(sliderX, {
          toValue: nextRole === "customer" ? halfWidth : 0,
          useNativeDriver: true,
          speed: 22,
          bounciness: 4,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(sliderX, {
          toValue: role === "customer" ? selectorWidth / 2 - 4 : 0,
          useNativeDriver: true,
          speed: 22,
          bounciness: 4,
        }).start();
      },
    }),
    [role, selectorWidth, sliderX],
  );

  const loginForm = (
    <View
      nativeID="login-form-panel"
      style={[styles.formPanel, isWide && styles.wideFormPanel]}
    >
      {!isWide && (
        <View style={styles.mobileBrand}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>K</Text>
          </View>
          <Text style={styles.brandName}>KantekMu</Text>
        </View>
      )}

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
          <View
            accessibilityRole="adjustable"
            accessibilityLabel="Pilih jenis akun"
            accessibilityValue={{ text: getRoleLabel(role) }}
            style={styles.roleSelector}
            onLayout={(event) => {
              const measuredWidth = event.nativeEvent.layout.width;
              setSelectorWidth(measuredWidth);
              sliderX.setValue(role === "customer" ? measuredWidth / 2 - 4 : 0);
            }}
            {...roleSelectorResponder.panHandlers}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.roleSlider,
                { transform: [{ translateX: sliderX }] },
              ]}
            />
            {LOGIN_ROLES.map((loginRole) => (
              <View key={loginRole.value} style={styles.roleOption}>
                <Text
                  style={[
                    styles.roleOptionText,
                    role === loginRole.value && styles.selectedRoleText,
                  ]}
                >
                  {loginRole.label}
                </Text>
              </View>
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
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
        >
          <Text style={styles.loginButtonText}>
            Masuk sebagai {getRoleLabel(role)}
          </Text>
          <Text style={styles.loginButtonArrow}>→</Text>
        </Pressable>

        <View style={styles.signupPrompt}>
          <Text style={styles.signupText}>Belum punya akun? </Text>
          <Pressable accessibilityRole="button">
            <Text style={styles.signupLink}>Daftar sekarang</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footerText}>© 2026 KantekMu. Semua hak dilindungi.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          nativeID="login-screen"
          contentContainerStyle={[styles.page, isWide && styles.widePage]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isWide && (
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
                  Solusi kemudahan dalam pemesanan. Pesan meja favoritmu dan
                  nikmati momen tanpa menunggu.
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
          )}

          {loginForm}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
