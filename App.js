// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SurveyForm from './screens/SurveyForm';
import SurveyResults from './screens/SurveyResults';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SurveyForm">
        <Stack.Screen
          name="SurveyForm"
          component={SurveyForm}
          options={{ title: 'Lifestyle Survey' }}
        />
        <Stack.Screen
          name="Results"
          component={SurveyResults}
          options={{ title: 'Survey Results' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
