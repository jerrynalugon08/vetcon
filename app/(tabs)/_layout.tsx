import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'home':
              iconName = 'home';
              break;
            case 'profile':
              iconName = 'person';
              break;
            case 'about':
              iconName = 'infinite';
              break;
            case 'settings':
              iconName = 'settings';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3276A6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingVertical: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      
    </Tabs>
  );
}
