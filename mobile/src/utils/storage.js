import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@todo_app_token';
const USER_KEY = '@todo_app_user';

// Save JWT token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token to AsyncStorage:', error);
  }
};

// Retrieve JWT token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

// Remove JWT token on logout
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing token from AsyncStorage:', error);
  }
};

// Optional helper to save cached user profile
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to AsyncStorage:', error);
  }
};

// Optional helper to get cached user profile
export const getUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting user from AsyncStorage:', error);
    return null;
  }
};
