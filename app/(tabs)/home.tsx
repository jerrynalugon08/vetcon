import { auth } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);

  // 🔹 New state for editing scheduled date
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newScheduledDate, setNewScheduledDate] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfilePic(user.photoURL);
        setUserName(user.email || "User");
      }
    });

    const loadScheduledDate = async () => {
      try {
        const savedDate = await AsyncStorage.getItem("scheduledDate");
        if (savedDate) {
          setScheduledDate(savedDate);
        }
      } catch (error) {
        console.error("Failed to load scheduled date:", error);
      }
    };

    loadScheduledDate();

    return unsubscribe;
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access media is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      uploadImage(image.uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      const storage = getStorage();
      const imageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      await updateProfile(user, { photoURL: downloadURL });
      setProfilePic(downloadURL);
      Alert.alert("Success", "Profile picture updated!");
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    }
  };

  const handleNavigate = (category: string) => {
    router.push({
      pathname: "/servicesScreen",
      params: { category },
    });
  };

  // 🔹 Function to save the updated schedule date
  const handleUpdateDate = async () => {
    try {
      await AsyncStorage.setItem("scheduledDate", newScheduledDate);
      setScheduledDate(newScheduledDate);
      setIsEditing(false);
      setNewScheduledDate("");
    } catch (error) {
      Alert.alert("Error", "Failed to save new date.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VetConnect 🐾</Text>

      <View style={styles.welcomeCard}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("@/assets/images/user.png")
            }
            style={styles.userIcon}
          />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Pet's Name..."
          placeholderTextColor="#555"
        />

        {scheduledDate && !isEditing && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }}>
            <Text style={styles.scheduledDate}>
              📅 Scheduled Appointment: {scheduledDate}
            </Text>
            <TouchableOpacity onPress={() => {
              setIsEditing(true);
              setNewScheduledDate(scheduledDate);
            }}>
              <Ionicons name="pencil" size={20} color="orange" />
            </TouchableOpacity>
          </View>
        )}

        {isEditing && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Update appointment date..."
              value={newScheduledDate}
              onChangeText={setNewScheduledDate}
            />
            <TouchableOpacity onPress={handleUpdateDate}>
              <Ionicons name="checkmark" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Ionicons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Services:</Text>

      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => handleNavigate("Grooming")}
      >
        <Image
          source={require("@/assets/images/grooming.jpg")}
          style={styles.serviceImage}
        />
        <Text style={styles.serviceText}>GROOMING FOR PETS ✂️</Text>
        <Ionicons
          name="add-circle"
          size={30}
          color="#3276A6"
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => handleNavigate("Veterinary")}
      >
        <Image
          source={require("@/assets/images/vetcare.jpg")}
          style={styles.serviceImage}
        />
        <Text style={styles.serviceText}>VETERINARY CARE 🏥</Text>
        <Ionicons
          name="add-circle"
          size={30}
          color="#3276A6"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6B98A",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  welcomeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#3276A6",
  },
  userIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  scheduledDate: {
    fontSize: 16,
    color: "#3276A6",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#333",
    position: "relative",
  },
  serviceImage: {
    width: "100%",
    height: 120,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    color: "#000",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
    width: "100%",
    bottom: 40,
  },
  icon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
