import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const SurveyForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullNames: '',
    email: '',
    dateOfBirth: '',
    contactNumber: '',
  });

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const foodOptions = ['Pizza', 'Pasta', 'Pap and Wors', 'Other'];

  const likertQuestions = [
    'I like to watch movies',
    'I like to listen to radio',
    'I like to eat out',
    'I like to watch TV',
  ];

  const likertScale = [
    { value: '1', label: 'Strongly Agree'},
    { value: '2', label: 'Agree'},
    { value: '3', label: 'Neutral'},
    { value: '4', label: 'Disagree'},
    { value: '5', label: 'Strongly Disagree'},
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFood = (item) => {
    setSelectedFoods(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleRatingChange = (question, rating) => {
    setRatings(prev => ({
      ...prev,
      [question]: rating,
    }));
  };

  const validateForm = () => {
    const { fullNames, email, dateOfBirth, contactNumber } = formData;

    if (!fullNames || !email || !dateOfBirth || !contactNumber) {
      Alert.alert('Validation Error', 'All personal details fields are required.');
      return false;
    }
     // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert('Validation Error', 'Please enter a valid email address.');
    return false;
  }
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (
    isNaN(birthDate.getTime()) || // invalid date
    age < 5 ||
    age > 120 ||
    (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))
  ) {
    Alert.alert('Validation Error', 'Age must be between 5 and 120.');
    return false;
  }
    if (selectedFoods.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one favorite food.');
      return false;
    }

    if (likertQuestions.some(q => !ratings[q])) {
      Alert.alert('Validation Error', 'Please rate all statements.');
      return false;
    }

    return true;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await axios.post('http://192.168.18.240:5000/api/submit', {
      ...formData,
      selectedFoods,
      ratings,
    });

    Alert.alert('Success', response.data.message || 'Survey submitted successfully!');

    //The form textfile
    setFormData({
      fullNames: '',
      email: '',
      dateOfBirth: '',
      contactNumber: '',
    });
    setSelectedFoods([]);
    setRatings({});
  } catch (error) {
    console.error('Axios error:', error);
    Alert.alert(
      'Error',
      error.response?.data?.message || 'Failed to submit survey. Please try again.'
    );
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Surveys</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>FILL OUT SURVEY</Text>
          </TouchableOpacity>
          <TouchableOpacity
  style={styles.headerButton}
  onPress={() => navigation.navigate('Results')}
>
  <Text style={styles.headerButtonText}>VIEW SURVEY RESULTS</Text>
</TouchableOpacity>

        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          {/* Personal Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details:</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Names</Text>
              <TextInput
                style={styles.input}
                value={formData.fullNames}
                onChangeText={(text) => handleInputChange('fullNames', text)}
                placeholder="Enter your full names"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

          <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[styles.input, { justifyContent: 'center' }]}
              >
                <Text style={{ color: formData.dateOfBirth ? '#000' : '#999' }}>
                  {formData.dateOfBirth || 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const formatted = selectedDate.toISOString().split('T')[0];
                      handleInputChange('dateOfBirth', formatted);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <TextInput
                style={styles.input}
                value={formData.contactNumber}
                onChangeText={(text) => handleInputChange('contactNumber', text)}
                placeholder="Enter your contact number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* My Food Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is your favorite food?</Text>
            <View style={styles.checkboxContainer}>
              {foodOptions.map((food) => (
                <TouchableOpacity
                  key={food}
                  style={[
                    styles.checkbox,
                    selectedFoods.includes(food) && styles.checkboxSelected,
                  ]}
                  onPress={() => toggleFood(food)}
                >
                  <View style={styles.checkboxIcon}>
                    {selectedFoods.includes(food) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxText}>{food}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* The Liked Scale Ratings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Please rate your level of agreement on a scale from 1 to 5, with 1 being "strongly agree" and 5 being "strongly disagree":
            </Text>

            {/* The Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.statementHeader]}>
              </Text>
              {likertScale.map((option) => (
                <Text key={option.value} style={styles.tableHeaderCell}>
                  {option.label}
                </Text>
              ))}
            </View>

            {/* The Table Rows */}
            {likertQuestions.map((question, index) => (
              <View key={question} style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven
              ]}>
                <Text style={[styles.tableCell, styles.statementCell]}>
                  {question}
                </Text>
                {likertScale.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.tableCell}
                    onPress={() => handleRatingChange(question, option.value)}
                  >
                    <View style={[
                      styles.radioButton,
                      ratings[question] === option.value && styles.radioButtonSelected
                    ]}>
                      {ratings[question] === option.value && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* The Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 4,
  },
  headerButtonText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 10,
    marginBottom: 10,
  },
  checkboxSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  checkboxIcon: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkmark: {
    color: '#2196f3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontSize: 7.5,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
   tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  statementHeader: {
    flex: 2,
    textAlign: 'left',
  },
  statementCell: {
    flex: 2,
    paddingRight: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
  },
  tableRowEven: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statementCell: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  radioButtonSelected: {
    borderColor: '#2196f3',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196f3',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SurveyForm;