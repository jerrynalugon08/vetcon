import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#333"} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, darkMode && styles.darkText]}>Settings ⚙️</Text>

      {/* Theme Toggle */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, darkMode && styles.darkText]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
      </View>

      {/* Notifications Toggle (Placeholder) */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, darkMode && styles.darkText]}>Enable Notifications</Text>
        <Switch value={false} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6B98A", padding: 20, justifyContent: "center" },
  darkContainer: { backgroundColor: "#333" },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  darkText: { color: "#fff" },
  settingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  settingText: { fontSize: 18, color: "#000" },
  logoutButton: { marginTop: 20, backgroundColor: "#D9534F", padding: 10, borderRadius: 5, alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
