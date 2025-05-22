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



import { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState({
    name: "Tipasa",
    sys: { country: "DZ" },
    main: { temp: 15, humidity: 65 },
    weather: [{ main: "Clear", description: "clear sky" }],
    wind: { speed: 2.78 } // 10 km/h
  });

  // Données simulées
  const hourlyData = [
    { time: "1h", temp: "12°" },
    { time: "4h", temp: "12°" },
    { time: "7h", temp: "13°" },
    { time: "10h", temp: "21°" },
    { time: "13h", temp: "26°" },
    { time: "16h", temp: "24°" }, 
    { time: "19h", temp: "18°" },
    { time: "22h", temp: "15°" },
  ];

  const dailyData = [
    { day: "Monday", temp: "15°" },
    { day: "Tuesday", temp: "18°" },
    { day: "Wednesday", temp: "23°" },
    { day: "Thursday", temp: "20°" }, 
    { day: "Friday", temp: "21°" },
    { day: "Saturday", temp: "22°" },
    { day: "Sunday", temp: "19°" },
    { day: "Next Monday", temp: "17°" },
    { day: "Next Tuesday", temp: "20°" },
    { day: "Next Wednesday", temp: "24°" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#87CEEB" />

      {/* En-tête : "Tab One" au centre et l'icône d'information à droite */}
      <View style={styles.header}>
        <Text style={styles.tabText}>Tab One</Text>
        <Ionicons name="information-circle-outline" size={20} color="white" style={styles.infoIcon} />
      </View>

      {/* Contenu principal de l'application - Tout ce qui est défilable */}
      {/* On utilise une seule ScrollView verticale englobant le tout */}
      <ScrollView style={styles.mainScrollView}>
        <View style={styles.mainContentPadding}> {/* Ajout d'une vue pour le padding global */}
          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter city name"
              placeholderTextColor="#888"
            />
            <Ionicons name="search" size={20} color="#555" />
          </View>

          {/* Météo actuelle */}
          <View style={styles.currentWeather}>
            <Text style={styles.location}>{weatherData.name}, {weatherData.sys.country}</Text>
            <Text style={styles.temperature}>{weatherData.main.temp}°</Text>
            <Text style={styles.condition}>{weatherData.weather[0].main}</Text>
            <Text style={styles.wind}>Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h</Text>
          </View>

          {/* Prévisions horaires avec défilement horizontal */}
          <Text style={styles.sectionTitle}>HOURLY FORECAST</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyForecastScrollContent}>
            {hourlyData.map((hour, index) => (
              <View key={index} style={styles.hourItem}>
                <Text style={styles.hour}>{hour.time}</Text>
                <Text style={styles.hourTemp}>{hour.temp}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Section des prévisions quotidiennes (fond gris) - Maintenant défilable avec le reste */}
        <View style={styles.dailyForecastSection}>
          <Text style={styles.sectionTitle}>3-DAY FORECAST</Text>
          {/* Cette partie n'a plus besoin de sa propre ScrollView car le parent mainScrollView la gère */}
          {dailyData.map((day, index) => (
            <View key={index} style={styles.dayItem}>
              <Text style={styles.day}>{day.day}</Text>
              <Text style={styles.dayTemp}>{day.temp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* La barre de navigation inférieure a été complètement retirée */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB", // Bleu ciel
  },
  header: {
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center', // Centrer le texte "Tab One"
    position: 'relative',
    zIndex: 1,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  infoIcon: {
    position: 'absolute',
    right: 20,
    top: 10, // Ajuster pour l'aligner avec le texte "Tab One"
  },
  mainScrollView: {
    flex: 1, // Permet à la ScrollView de prendre l'espace disponible
  },
  mainContentPadding: { // Nouvelle vue pour appliquer le padding général
    padding: 20,
    paddingBottom: 0, // Pas de padding en bas pour la transition avec la section suivante
  },
  dailyForecastSection: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fond semi-transparent
    padding: 20,
    paddingTop: 10, // Un peu moins de padding en haut pour le titre
    // Assurez-vous que cette section s'étend sur toute la largeur
    width: '100%', 
    minHeight: 200, // Une hauteur minimale pour qu'elle soit visible même avec peu de données
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  currentWeather: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  temperature: {
    fontSize: 70,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
  },
  condition: {
    fontSize: 18,
    color: "white",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  wind: {
    fontSize: 16,
    color: "white",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  hourlyForecastScrollContent: {
    paddingRight: 20, 
  },
  hourItem: {
    marginRight: 25,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  hour: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  hourTemp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  // dailyForecastScrollContent n'est plus utilisé car le contenu défile avec mainScrollView
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  day: {
    fontSize: 16,
    color: "white",
  },
  dayTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  // bottomNav est complètement supprimé
});

