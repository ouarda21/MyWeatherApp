/*import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});*/








"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import * as Location from "expo-location"

// Clé API - utilisez votre vraie clé API météo
const API_KEY = "4877306d0e3457d62fe8f426a7d0e24f"

export default function WeatherApp() {
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [city, setCity] = useState("")
  const [searchCity, setSearchCity] = useState("")
  const [showLocationModal, setShowLocationModal] = useState(false)
  const locationRequested = useRef(false)

  useEffect(() => {
    if (!locationRequested.current) {
      locationRequested.current = true
      setShowLocationModal(true)
    }
  }, [])

  const requestLocationPermission = async (option) => {
    setShowLocationModal(false)

    try {
      let { status } = { status: "denied" }

      if (option === "once" || option === "whileUsing") {
        status = (await Location.requestForegroundPermissionsAsync()).status
      }

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
        await fetchWeatherData(location.coords.latitude, location.coords.longitude)
      } else {
        // Utiliser Paris comme ville par défaut si la permission est refusée
        searchByCity("Paris")
      }
    } catch (error) {
      console.error("Erreur lors de la demande de localisation:", error)
      searchByCity("Paris")
    }
  }

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true)

      // Appel API pour la météo actuelle
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=fr`,
      )
      const weatherData = await weatherResponse.json()

      // Appel API pour les prévisions
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=fr`,
      )
      const forecastData = await forecastResponse.json()

      // Traiter les données de météo actuelle
      const currentWeather = {
        city: weatherData.name,
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        wind: Math.round(weatherData.wind.speed * 3.6), // Convertir m/s en km/h
        hourly: processHourlyForecast(forecastData.list),
      }

      // Traiter les données de prévision
      const dailyForecast = processDailyForecast(forecastData.list)

      setWeather(currentWeather)
      setForecast(dailyForecast)
      setCity(weatherData.name)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error)
      setLoading(false)
    }
  }

  const searchByCity = async (cityName = null) => {
    const cityToSearch = cityName || searchCity
    if (!cityToSearch.trim()) return

    try {
      setLoading(true)

      // Rechercher les coordonnées de la ville
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityToSearch}&limit=1&appid=${API_KEY}`,
      )
      const geoData = await geoResponse.json()

      if (geoData.length === 0) {
        Alert.alert("Erreur", "Ville non trouvée. Vérifiez l'orthographe et réessayez.")
        setLoading(false)
        return
      }

      // Récupérer la météo avec les coordonnées
      await fetchWeatherData(geoData[0].lat, geoData[0].lon)
      setSearchCity("")
    } catch (error) {
      console.error("Erreur lors de la recherche par ville:", error)
      setLoading(false)
    }
  }

  // Fonctions pour traiter les données de l'API
  const processHourlyForecast = (forecastList) => {
    // Récupérer les prévisions pour les prochaines 24 heures
    const hourlyData = forecastList.slice(0, 8).map((item) => {
      const date = new Date(item.dt * 1000)
      return {
        hour: `${date.getHours()}:00`,
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].description,
        icon: item.weather[0].icon,
      }
    })

    return hourlyData
  }

  const processDailyForecast = (forecastList) => {
    const dailyData = []
    const today = new Date()

    // Regrouper les prévisions par jour
    const dailyMap = new Map()

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000)
      const day = date.toLocaleDateString("fr-FR", { weekday: "long" })
      const dayKey = date.toISOString().split("T")[0]

      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          day: capitalizeFirstLetter(day),
          date: date,
          temps: [],
          icons: [],
          conditions: [],
        })
      }

      const dayData = dailyMap.get(dayKey)
      dayData.temps.push(item.main.temp)
      dayData.icons.push(item.weather[0].icon)
      dayData.conditions.push(item.weather[0].description)
    })

    // Convertir la Map en tableau et calculer min/max
    dailyMap.forEach((data) => {
      dailyData.push({
        day: data.day,
        date: data.date,
        high: Math.round(Math.max(...data.temps)),
        low: Math.round(Math.min(...data.temps)),
        condition: getMostFrequent(data.conditions),
        icon: getMostFrequent(data.icons),
      })
    })

    // Trier par date et limiter à 6 jours
    return dailyData
      .sort((a, b) => a.date - b.date)
      .filter((day) => day.date > today) // Exclure aujourd'hui
      .slice(0, 6) // Limiter à 6 jours
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getMostFrequent = (arr) => {
    const hashmap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})

    return Object.keys(hashmap).reduce((a, b) => (hashmap[a] > hashmap[b] ? a : b))
  }

  // Fonction pour obtenir l'emoji correspondant au code météo
  const getWeatherEmoji = (iconCode) => {
    // Map OpenWeatherMap icon codes to emojis
    const iconMap = {
      // Clear
      "01d": "☀️",
      "01n": "🌙",

      // Few clouds
      "02d": "🌤️",
      "02n": "🌤️",

      // Scattered clouds
      "03d": "⛅",
      "03n": "⛅",

      // Broken clouds
      "04d": "☁️",
      "04n": "☁️",

      // Shower rain
      "09d": "🌧️",
      "09n": "🌧️",

      // Rain
      "10d": "🌦️",
      "10n": "🌦️",

      // Thunderstorm
      "11d": "⛈️",
      "11n": "⛈️",

      // Snow
      "13d": "❄️",
      "13n": "❄️",

      // Mist
      "50d": "🌫️",
      "50n": "🌫️",
    }

    return iconMap[iconCode] || "🌈" // Default emoji if icon code not found
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Chargement des données météo...</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Modal de demande de localisation personnalisée */}
      <Modal visible={showLocationModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Autoriser « Météo » {"\n"}à utiliser votre position ?</Text>

            <Text style={styles.modalDescription}>
              Météo utilise ces informations pour offrir une expérience plus pertinente et plus personnalisée, par
              exemple pour partager votre localisation en direct ou vous proposer des adresses à proximité.
            </Text>

            <View style={styles.mapPreview}>
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapPlaceholderText}>🗺️</Text>
              </View>
              <View style={styles.mapOverlay}>
                <Text style={styles.mapText}>
                  <Text style={styles.mapIcon}>📍</Text> Position exacte : Oui
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.permissionButton} onPress={() => requestLocationPermission("once")}>
              <Text style={styles.permissionButtonText}>Autoriser une fois</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.permissionButton} onPress={() => requestLocationPermission("whileUsing")}>
              <Text style={styles.permissionButtonText}>Autoriser lorsque l'app est active</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.permissionButton, styles.denyButton]}
              onPress={() => requestLocationPermission("deny")}
            >
              <Text style={styles.permissionButtonText}>Ne pas autoriser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville..."
            value={searchCity}
            onChangeText={setSearchCity}
            onSubmitEditing={() => searchByCity()}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => searchByCity()}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {weather && (
          <>
            {/* Informations météo actuelles */}
            <View style={styles.currentWeather}>
              <Text style={styles.cityName}>{city}</Text>
              <Text style={styles.temperature}>{weather.temperature}°C</Text>
              <Text style={styles.condition}>{weather.condition}</Text>
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💧</Text>
                  <Text style={styles.detailText}>{weather.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💨</Text>
                  <Text style={styles.detailText}>{weather.wind} km/h</Text>
                </View>
              </View>
            </View>

            {/* Prévisions horaires (défilement horizontal) */}
            <Text style={styles.sectionTitle}>Prévisions horaires</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyContainer}>
              {weather.hourly.map((hour, index) => (
                <View key={index} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{hour.hour}</Text>
                  <View style={styles.iconContainer}>
                    <Text style={styles.weatherEmoji}>{getWeatherEmoji(hour.icon)}</Text>
                  </View>
                  <Text style={styles.hourlyTemp}>{hour.temperature}°C</Text>
                </View>
              ))}
            </ScrollView>

            {/* Prévisions sur 6 jours (défilement vertical) */}
            <Text style={styles.sectionTitle}>Prévisions 6 jours</Text>
            <ScrollView style={styles.dailyContainer}>
              {forecast &&
                forecast.map((day, index) => (
                  <View key={index} style={styles.dailyItem}>
                    <Text style={styles.dailyDay}>{day.day}</Text>
                    <View style={styles.iconContainer}>
                      <Text style={styles.weatherEmoji}>{getWeatherEmoji(day.icon)}</Text>
                    </View>
                    <View style={styles.dailyTemp}>
                      <Text style={styles.dailyHigh}>{day.high}°</Text>
                      <Text style={styles.dailyLow}>{day.low}°</Text>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get("window")

// Définition unique des styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4a6fa1",
  },
  container: {
    flex: 1,
    backgroundColor: "#4a6fa1",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4a6fa1",
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
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#2c3e50",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
  },
  searchButtonText: {
    fontSize: 18,
  },
  currentWeather: {
    alignItems: "center",
    marginBottom: 20,
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
    marginTop: 10,
    marginBottom: 10,
  },
  hourlyContainer: {
    maxHeight: 120,
    marginBottom: 20,
  },
  hourlyItem: {
    alignItems: "center",
    marginRight: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    width: 80,
  },
  hourlyTime: {
    color: "white",
    marginBottom: 5,
  },
  hourlyTemp: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
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
    width: 100,
  },
  dailyTemp: {
    flexDirection: "row",
    width: 80,
    justifyContent: "flex-end",
  },
  dailyHigh: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  dailyLow: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  weatherEmoji: {
    fontSize: 36,
    textAlign: "center",
  },
  // Styles pour la modal de permission
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "#222",
    borderRadius: 15,
    overflow: "hidden",
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  modalDescription: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  mapPreview: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1c4966",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 50,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  mapText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapIcon: {
    color: "#0080ff",
    fontSize: 18,
  },
  permissionButton: {
    width: "100%",
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#444",
  },
  permissionButtonText: {
    color: "#0080ff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  denyButton: {
    borderTopWidth: 0.5,
    borderTopColor: "#444",
  },
})
