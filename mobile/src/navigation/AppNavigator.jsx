import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

import Loading from '../components/Loading';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TodoScreen from '../screens/TodoScreen';
import AddTodoScreen from '../screens/AddTodoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // If still checking persisted token from storage on startup, show Loading spinner
  if (isLoading) {
    return <Loading message="Loading application..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {isAuthenticated ? (
          // Authenticated Stack
          <>
            <Stack.Screen
              name="Todos"
              component={TodoScreen}
              options={{
                headerShown: false, // We use custom header inside TodoScreen
              }}
            />
            <Stack.Screen
              name="AddTodo"
              component={AddTodoScreen}
              options={{
                title: 'New Task',
              }}
            />
          </>
        ) : (
          // Unauthenticated (Auth) Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Create Account',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
