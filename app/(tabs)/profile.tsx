import { auth } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("Loading...");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "Unknown user");
        setProfilePic(user.photoURL);
      }
    });
    return unsubscribe;
  }, []);

  const handleEditProfile = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Media library access is required.");
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

  const handleLogout = () => {
    Alert.alert("Logout", "You have been logged out.");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <TouchableOpacity onPress={handleEditProfile}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("@/assets/images/user.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>{userEmail}</Text>

        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6B98A",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 30,
    width: "90%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3276A6",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3276A6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#D9534F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
});

