"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  View as RNView,
  Text as RNText,
  Modal,
  Dimensions,
  Image,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import * as Location from "expo-location"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"

export default function WeatherApp() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [city, setCity] = useState("")
  const [searchCity, setSearchCity] = useState("")
  const [showLocationModal, setShowLocationModal] = useState(true) // Afficher la modal au démarrage
  const [locationDenied, setLocationDenied] = useState(false)

  // Demander la permission de localisation au démarrage
  useEffect(() => {
    console.log("Démarrage de l'application...")
    // La modal s'affiche automatiquement (showLocationModal est true par défaut)
  }, [])

  const requestLocationPermission = async (option) => {
    setShowLocationModal(false)
    console.log("Option de localisation choisie:", option)

    try {
      if (option === "deny") {
        console.log("Permission refusée par l'utilisateur")
        setLocationDenied(true)
        setLoading(false) // Arrêter le chargement immédiatement
        return
      }

      let { status } = { status: "denied" }

      if (option === "once" || option === "whileUsing") {
        console.log("Demande de permission...")
        status = (await Location.requestForegroundPermissionsAsync()).status
        console.log("Statut de la permission:", status)
      }

      if (status === "granted") {
        console.log("Permission accordée, récupération de la position...")
        const location = await Location.getCurrentPositionAsync({})
        console.log("Position récupérée:", location)
        loadMockData("Votre position")
      } else {
        console.log("Permission refusée, utilisation de Paris par défaut")
        loadMockData("Paris")
      }
    } catch (error) {
      console.error("Erreur lors de la demande de localisation:", error)
      loadMockData("Paris")
    }
  }

  const searchByCity = async (cityName = null) => {
    const cityToSearch = cityName || searchCity
    if (!cityToSearch.trim()) return

    loadMockData(cityToSearch)
    setSearchCity("")
  }

  const loadMockData = (cityName) => {
    console.log("Chargement des données pour:", cityName)
    setLoading(true)

    setTimeout(() => {
      try {
        const mockWeather = generateMockWeatherData(cityName)
        const mockForecast = generateMockForecastData()

        console.log("Données générées")

        setWeather(mockWeather)
        setForecast(mockForecast)
        setCity(cityName)
        setLoading(false)

        console.log("Chargement terminé!")
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
        setLoading(false)
      }
    }, 1500)
  }

  const generateMockWeatherData = (cityName = "Paris") => {
    const conditions = [
      { text: "Ensoleillé", icon: "01d" },
      { text: "Partiellement nuageux", icon: "02d" },
      { text: "Nuageux", icon: "03d" },
      { text: "Pluie légère", icon: "10d" },
    ]

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

    return {
      city: cityName,
      temperature: Math.round(Math.random() * 15 + 10),
      condition: randomCondition.text,
      humidity: Math.round(Math.random() * 50 + 30),
      wind: Math.round(Math.random() * 30 + 5),
      hourly: Array.from({ length: 8 }, (_, i) => {
        const hourCondition = conditions[Math.floor(Math.random() * conditions.length)]
        return {
          hour: `${(new Date().getHours() + i) % 24}:00`,
          temperature: Math.round(Math.random() * 10 + 15),
          condition: hourCondition.text,
          icon: hourCondition.icon,
        }
      }),
    }
  }

  const generateMockForecastData = () => {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    const conditions = ["01d", "02d", "03d", "10d"]

    return Array.from({ length: 6 }, (_, i) => ({
      day: days[i],
      high: Math.round(Math.random() * 10 + 20),
      low: Math.round(Math.random() * 10 + 10),
      condition: "Condition météo",
      icon: conditions[Math.floor(Math.random() * conditions.length)],
    }))
  }

  const getWeatherEmoji = (iconCode) => {
    const iconMap = {
      "01d": "☀️",
      "02d": "🌤️",
      "03d": "⛅",
      "10d": "🌦️",
    }
    return iconMap[iconCode] || "🌈"
  }

  const openDayDetail = (day) => {
    console.log("Ouverture du détail pour:", day)
    router.push({
      pathname: "/modal",
      params: {
        day: day.day,
        condition: day.condition,
        high: day.high,
        low: day.low,
        icon: day.icon,
      },
    })
  }

  // Modal de demande de permission de localisation
  const renderLocationModal = () => {
    const { width } = Dimensions.get("window")

    return (
      <Modal visible={showLocationModal} transparent={true} animationType="fade">
        <RNView style={styles.modalOverlay}>
          <RNView style={[styles.modalContent, { width: width * 0.9 }]}>
            {/* En-tête de la modal */}
            <RNView style={styles.modalHeader}>
              <RNView style={styles.appIconContainer}>
                <FontAwesome name="cloud" size={24} color="#fff" />
              </RNView>
              <RNText style={styles.modalTitle}>Autoriser « Météo » à utiliser votre position ?</RNText>
            </RNView>

            <RNText style={styles.modalDescription}>
              Météo utilise ces informations pour offrir une expérience plus pertinente et personnalisée.
            </RNText>

            {/* Image de carte réelle */}
            <RNView style={styles.mapContainer}>
              <Image source={{ uri: "/assets/world-map.png" }} style={styles.mapImage} resizeMode="cover" />
              {/* Overlay avec effet de superposition */}
              <RNView style={styles.mapOverlay}>
                <RNView style={styles.mapPin}>
                  <FontAwesome name="map-marker" size={20} color="#ff3b30" />
                </RNView>
              </RNView>
            </RNView>

            {/* Indicateur de position exacte */}
            <RNView style={styles.positionIndicator}>
              <RNView style={styles.positionDot} />
              <RNText style={styles.positionText}>Position exacte : Oui</RNText>
            </RNView>

            {/* Boutons d'action */}
            <TouchableOpacity style={styles.permissionButton} onPress={() => requestLocationPermission("once")}>
              <RNText style={styles.permissionButtonText}>Autoriser une fois</RNText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.permissionButton} onPress={() => requestLocationPermission("whileUsing")}>
              <RNText style={styles.permissionButtonText}>Autoriser lorsque l'app est active</RNText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.permissionButton, styles.denyButton]}
              onPress={() => requestLocationPermission("deny")}
            >
              <RNText style={styles.denyButtonText}>Ne pas autoriser</RNText>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </Modal>
    )
  }

  // Écran spécial quand l'utilisateur refuse la localisation
  if (locationDenied) {
    return (
      <RNView style={[styles.fullScreenContainer, { backgroundColor: isDark ? "#1a2a3a" : "#4a6fa1" }]}>
        <StatusBar style="light" />
        <RNView style={styles.searchOnlyContainer}>
          <RNText style={styles.searchOnlyTitle}>🌍</RNText>
          <RNText style={styles.searchOnlyText}>Recherchez une ville pour voir la météo</RNText>

          <RNView style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Entrez le nom d'une ville..."
              value={searchCity}
              onChangeText={setSearchCity}
              onSubmitEditing={() => {
                if (searchCity.trim()) {
                  setLocationDenied(false) // Sortir du mode refus
                  searchByCity()
                }
              }}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              autoFocus={true}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                if (searchCity.trim()) {
                  setLocationDenied(false) // Sortir du mode refus
                  searchByCity()
                }
              }}
            >
              <RNText style={styles.searchButtonText}>🔍</RNText>
            </TouchableOpacity>
          </RNView>

          <RNText style={styles.searchHint}>Exemple : Paris, Lyon, Marseille...</RNText>
        </RNView>
      </RNView>
    )
  }

  if (loading) {
    return (
      <RNView style={[styles.loadingContainer, { backgroundColor: isDark ? "#1a2a3a" : "#4a6fa1" }]}>
        <StatusBar style="light" />
        {renderLocationModal()}
        <ActivityIndicator size="large" color="#ffffff" />
        <RNText style={styles.loadingText}>Chargement des données météo...</RNText>
      </RNView>
    )
  }

  return (
    <RNView style={[styles.fullScreenContainer, { backgroundColor: isDark ? "#1a2a3a" : "#4a6fa1" }]}>
      <StatusBar style="light" />

      <RNView style={styles.container}>
        {/* Barre de recherche */}
        <RNView style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville..."
            value={searchCity}
            onChangeText={setSearchCity}
            onSubmitEditing={() => searchByCity()}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => searchByCity()}>
            <RNText style={styles.searchButtonText}>🔍</RNText>
          </TouchableOpacity>
        </RNView>

        {/* Météo actuelle */}
        {weather && (
          <RNView style={styles.currentWeather}>
            <RNText style={styles.cityName}>{city}</RNText>
            <RNText style={styles.temperature}>{weather.temperature}°C</RNText>
            <RNText style={styles.condition}>{weather.condition}</RNText>
            <RNView style={styles.details}>
              <RNView style={styles.detailItem}>
                <RNText style={styles.detailIcon}>💧</RNText>
                <RNText style={styles.detailText}>{weather.humidity}%</RNText>
              </RNView>
              <RNView style={styles.detailItem}>
                <RNText style={styles.detailIcon}>💨</RNText>
                <RNText style={styles.detailText}>{weather.wind} km/h</RNText>
              </RNView>
            </RNView>
          </RNView>
        )}

        {/* Prévisions horaires */}
        {weather?.hourly && (
          <>
            <RNText style={styles.sectionTitle}>Prévisions horaires</RNText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyContainer}>
              {weather.hourly.map((hour, index) => (
                <RNView key={index} style={styles.hourlyItem}>
                  <RNText style={styles.hourlyTime}>{hour.hour}</RNText>
                  <RNText style={styles.weatherEmoji}>{getWeatherEmoji(hour.icon)}</RNText>
                  <RNText style={styles.hourlyTemp}>{hour.temperature}°C</RNText>
                </RNView>
              ))}
            </ScrollView>
          </>
        )}

        {/* Prévisions 6 jours */}
        {forecast && (
          <>
            <RNText style={styles.sectionTitle}>Prévisions 6 jours</RNText>
            <ScrollView style={styles.dailyContainer}>
              {forecast.map((day, index) => (
                <TouchableOpacity key={index} onPress={() => openDayDetail(day)}>
                  <RNView style={styles.dailyItem}>
                    <RNText style={styles.dailyDay}>{day.day}</RNText>
                    <RNText style={styles.weatherEmoji}>{getWeatherEmoji(day.icon)}</RNText>
                    <RNView style={styles.dailyTemp}>
                      <RNText style={styles.dailyHigh}>{day.high}°</RNText>
                      <RNText style={styles.dailyLow}>{day.low}°</RNText>
                    </RNView>
                  </RNView>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </RNView>
    </RNView>
  )
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: "white",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#2c3e50",
    borderRadius: 25,
    padding: 15,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  searchButtonText: {
    fontSize: 20,
  },
  currentWeather: {
    alignItems: "center",
    marginBottom: 30,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  temperature: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
  },
  condition: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  detailText: {
    color: "white",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  hourlyContainer: {
    maxHeight: 120,
    marginBottom: 20,
  },
  hourlyItem: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    width: 70,
  },
  hourlyTime: {
    color: "white",
    marginBottom: 5,
    fontSize: 12,
  },
  hourlyTemp: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 14,
  },
  weatherEmoji: {
    fontSize: 24,
    marginVertical: 5,
  },
  dailyContainer: {
    flex: 1,
  },
  dailyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  dailyDay: {
    color: "white",
    fontSize: 16,
    width: 80,
  },
  dailyTemp: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },
  dailyHigh: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dailyLow: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  // Styles améliorés pour la modal de permission
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4dabf7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  modalDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  mapPin: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  positionIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  positionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff3b30",
    marginRight: 10,
  },
  positionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  permissionButton: {
    width: "100%",
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  permissionButtonText: {
    color: "#4dabf7",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  denyButton: {
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  denyButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  // Styles pour l'écran de recherche uniquement
  searchOnlyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  searchOnlyTitle: {
    fontSize: 80,
    marginBottom: 20,
  },
  searchOnlyText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 30,
  },
  searchHint: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
})
