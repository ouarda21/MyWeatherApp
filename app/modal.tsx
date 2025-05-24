"use client"

import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, TouchableOpacity } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Text, View } from "@/components/Themed"
import { FontAwesome } from "@expo/vector-icons"

export default function WeatherDetailModal() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { day, condition, high, low, icon } = params

  // Fonction pour obtenir l'emoji correspondant au code météo
  const getWeatherEmoji = (iconCode) => {
    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "🌤️",
      "02n": "🌤️",
      "03d": "⛅",
      "03n": "⛅",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌦️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    }
    return iconMap[iconCode] || "🌈"
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <FontAwesome name="close" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{day}</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.weatherInfo}>
        <Text style={styles.weatherEmoji}>{getWeatherEmoji(icon)}</Text>
        <Text style={styles.condition}>{condition}</Text>

        <View style={styles.tempContainer}>
          <View style={styles.tempItem}>
            <FontAwesome name="arrow-up" size={16} color="#ff5e5e" style={styles.tempIcon} />
            <Text style={styles.tempText}>Max: {high}°C</Text>
          </View>
          <View style={styles.tempItem}>
            <FontAwesome name="arrow-down" size={16} color="#5e9fff" style={styles.tempIcon} />
            <Text style={styles.tempText}>Min: {low}°C</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesome name="tint" size={20} color="#5e9fff" style={styles.infoIcon} />
            <Text style={styles.infoText}>Humidité: {Math.round(Math.random() * 30 + 50)}%</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="wind" size={20} color="#b0b0b0" style={styles.infoIcon} />
            <Text style={styles.infoText}>Vent: {Math.round(Math.random() * 20 + 5)} km/h</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="eye" size={20} color="#f0f0f0" style={styles.infoIcon} />
            <Text style={styles.infoText}>Visibilité: {Math.round(Math.random() * 5 + 5)} km</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="dashboard" size={20} color="#ffb45e" style={styles.infoIcon} />
            <Text style={styles.infoText}>Pression: {Math.round(Math.random() * 30 + 1000)} hPa</Text>
          </View>
        </View>
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  weatherInfo: {
    width: "100%",
    alignItems: "center",
  },
  weatherEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  condition: {
    fontSize: 24,
    marginBottom: 20,
  },
  tempContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  tempItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tempIcon: {
    marginRight: 5,
  },
  tempText: {
    fontSize: 18,
  },
  infoContainer: {
    width: "100%",
    marginTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  infoIcon: {
    marginRight: 15,
    width: 25,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
  },
})
