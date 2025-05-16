import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ServicesScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {category ? `${category} Services` : "All Services"}
      </Text>

      {/* Example placeholder service card */}
      <TouchableOpacity style={styles.serviceCard}>
        <Image
          source={
            category === "Grooming"
              ? require("@/assets/images/grooming.jpg")
              : require("@/assets/images/vetcare.jpg")
          }
          style={styles.serviceImage}
        />
        <View style={styles.overlay} />
        <Text style={styles.serviceText}>
          {category === "Grooming"
            ? "Pet Grooming Packages"
            : category === "Veterinary"
            ? "Consult a Veterinarian"
            : "Service Details"}
        </Text>
        <Ionicons name="paw" size={30} color="#fff" style={styles.icon} />
      </TouchableOpacity>

      {/* Go back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#E6B98A", flex: 1 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#3276A6",
    position: "relative",
  },
  serviceImage: { width: "100%", height: 160 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  serviceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
  icon: { position: "absolute", bottom: 10, right: 10 },
  backButton: {
    marginTop: 20,
    padding: 10,
    alignSelf: "center",
  },
  backText: {
    fontSize: 16,
    color: "#3276A6",
    fontWeight: "bold",
  },
});
