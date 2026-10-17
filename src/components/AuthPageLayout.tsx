import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HeroPanel from "@/components/HeroPanel";
import { styles } from "@/styles/loginStyles";

type AuthPageLayoutProps = {
  children?: ReactNode;
  screenID: string;
  panelID: string;
};

export default function AuthPageLayout({
  children,
  screenID,
  panelID,
}: AuthPageLayoutProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 850;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          nativeID={screenID}
          contentContainerStyle={[styles.page, isWide && styles.widePage]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isWide && <HeroPanel />}
          <View
            nativeID={panelID}
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
            {children}
            {!children && <View style={styles.emptyPanelSpace} />}
            <Text style={styles.footerText}>
              © 2026 KantekMu. Semua hak dilindungi.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
