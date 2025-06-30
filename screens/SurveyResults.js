import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SurveyResults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation(); 
  // Local IP address for accessing the backend server
  // same wifi network on both devices
  const API_URL = "http://192.168.18.240:5000/api/results";

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setData(response.data);
        setError(null);
      })
      .catch(err => {
        console.error("Error:", err.message);
        setError("Failed to fetch survey results.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.infoText}>Loading results...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "No data available."}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* The Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>_Surveys</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
  style={styles.headerButton}
  onPress={() => navigation.navigate('SurveyForm')}
>
   <Text style={[styles.headerButtonText, styles.inactiveHeaderButtonText]}>
    FILL OUT SURVEY
  </Text>
</TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerButton, styles]}
              onPress={() => navigation.navigate('Results')}
            >
              <Text style={[styles.headerButtonText, styles.activeHeaderButtonText]}>
    VIEW SURVEY RESULTS
  </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.heading}>Survey Results</Text>

        <View style={styles.table}>
  <Row label="Total number of surveys" value={data?.total ?? 'No Surveys Available.'} />
  <Row label="Average Age" value={data?.avgAge?.toFixed(1) ?? 'No Surveys Available.'} />
  <Row label="Oldest person who participated in survey" value={data?.maxAge ?? 'No Surveys Available.'} />
  <Row label="Youngest person who participated in survey" value={data?.minAge ?? 'No Surveys Available.'} />

  <Row label="Percentage of people who like Pizza" value={`${data?.pizzaPct?.toFixed(1) ?? '0'} %`} />
  <Row label="Percentage of people who like Pasta" value={`${data?.pastaPct?.toFixed(1) ?? '0'} %`} />
  <Row label="Percentage of people who like Pap and Wors" value={`${data?.papPct?.toFixed(1) ?? '0'} %`} />

  <Row label="People who like to eat out" value={data?.avgEatOut?.toFixed(1) ?? 'No Surveys Available.'} />
  <Row label="People who like to watch movies" value={data?.avgWatchMovies?.toFixed(1) ?? 'No Surveys Available.'} />
  <Row label="People who like to watch TV" value={data?.avgWatchTV?.toFixed(1) ?? 'No Surveys Available.'} />
  <Row label="People who like to listen to radio" value={data?.avgListenRadio?.toFixed(1) ?? 'No Surveys Available.'} />
</View>

      </SafeAreaView>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}:</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
 row: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: "#eee",
},
  labelContainer: {
  flex: 2.5,
  paddingRight: 10,
},

valueContainer: {
  flex: 1,
  alignItems: "flex-end",
},

label: {
  fontSize: 16,
  color: "#333",
  flexWrap: "wrap",
},

value: {
  fontSize: 16,
  color: "#111",
  textAlign: "right",
},
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 10,
  },
  headerButtonText: {
    fontSize: 12,
    color: "#1E90FF",
  },
  activeHeaderButtonText: {
  fontWeight:"bold",
  color: "#007bff", 
},
inactiveHeaderButtonText: {
  color: "#000", 
  fontWeight:"normal",
},
});
