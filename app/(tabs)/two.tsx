import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, useColorScheme } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

export default function SettingsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  // Couleurs dynamiques basées sur le thème
  const themeColors = {
    background: isDark ? "#1a2a3a" : "#4a6fa1",
    card: isDark ? "#2c3e50" : "rgba(255, 255, 255, 0.2)",
    text: isDark ? "#ffffff" : "#ffffff",
    textSecondary: isDark ? "#cccccc" : "rgba(255, 255, 255, 0.7)",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={styles.title}>Paramètres</Text>
      <Text style={styles.subtitle}>Configuration de l'application météo</Text>

      <ScrollView style={styles.settingsContainer}>
        <View style={[styles.settingCard, { backgroundColor: themeColors.card }]}>
          <Text style={styles.settingTitle}>Unités de température</Text>
          <View style={styles.settingOptions}>
            <TouchableOpacity style={[styles.optionButton, styles.optionSelected]}>
              <Text style={styles.optionText}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>°F</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <FontAwesome name="bell" size={20} color="white" style={styles.settingIcon} />
              <Text style={styles.settingTitle}>Notifications</Text>
            </View>
            <Switch value={true} trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={"#f4f3f4"} />
          </View>
        </View>

        <View style={[styles.settingCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <FontAwesome name="location-arrow" size={20} color="white" style={styles.settingIcon} />
              <Text style={styles.settingTitle}>Localisation automatique</Text>
            </View>
            <Switch value={true} trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={"#f4f3f4"} />
          </View>
        </View>

        <View style={[styles.settingCard, { backgroundColor: themeColors.card }]}>
          <Text style={styles.settingTitle}>Villes favorites</Text>
          <View style={styles.favoritesList}>
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteCity}>Paris</Text>
              <TouchableOpacity>
                <FontAwesome name="times-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteCity}>Lyon</Text>
              <TouchableOpacity>
                <FontAwesome name="times-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addFavoriteButton}>
              <FontAwesome name="plus" size={16} color="white" style={styles.addIcon} />
              <Text style={styles.addFavoriteText}>Ajouter une ville</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingCard, { backgroundColor: themeColors.card }]}>
          <Text style={styles.settingTitle}>À propos</Text>
          <Text style={styles.aboutText}>Application Météo v1.0.0</Text>
          <Text style={styles.aboutText}>Développée avec Expo et React Native</Text>
          <Text style={styles.aboutText}>Données météo simulées</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a6fa1",
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
  },
  settingOptions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  optionSelected: {
    backgroundColor: "#81b0ff",
  },
  optionText: {
    color: "white",
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 10,
  },
  favoritesList: {
    marginTop: 5,
  },
  favoriteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  favoriteCity: {
    color: "white",
    fontSize: 16,
  },
  addFavoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  addIcon: {
    marginRight: 8,
  },
  addFavoriteText: {
    color: "white",
    fontSize: 16,
  },
  aboutText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
})
