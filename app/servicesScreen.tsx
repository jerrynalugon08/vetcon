import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function ServicesScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const handleServicePress = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = async (day: any) => {
    try {
      const dateString = day.dateString;
      setSelectedDate(dateString);
      await AsyncStorage.setItem("scheduledDate", dateString);
      Alert.alert("Scheduled", `Appointment set for ${dateString}`);
    } catch (error) {
      console.error("Error saving date:", error);
      Alert.alert("Error", "Could not save the date.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>
        {category ? `${category} Services` : "All Services"}
      </Text>

      <TouchableOpacity style={styles.serviceCard} onPress={handleServicePress}>
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

      {showCalendar && (
        <>
          <Text style={styles.calendarTitle}>📅 Schedule Your Appointment</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#3276A6",
              },
            }}
            theme={{
              todayTextColor: "#27AE60",
              selectedDayBackgroundColor: "#3276A6",
              arrowColor: "#3276A6",
            }}
          />
          {selectedDate ? (
            <Text style={styles.selectedDate}>Selected: {selectedDate}</Text>
          ) : null}
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
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
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
    color: "#222",
  },
  selectedDate: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
    color: "#333",
  },
  backButton: {
    marginTop: 30,
    padding: 10,
    alignSelf: "center",
  },
  backText: {
    fontSize: 16,
    color: "#3276A6",
    fontWeight: "bold",
  },
});
