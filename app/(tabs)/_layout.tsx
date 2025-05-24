import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs } from "expo-router"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4a6fa1",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Météo",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cloud" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  )
}
