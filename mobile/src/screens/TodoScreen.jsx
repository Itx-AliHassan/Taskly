import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import TodoItem from '../components/TodoItem';
import EmptyTodos from '../components/EmptyTodos';
import Loading from '../components/Loading';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';

export default function TodoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch todos from API
  const fetchTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      const msg = getErrorMessage(error);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load and refetch on screen focus
  useEffect(() => {
    fetchTodos();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodos();
    });

    return unsubscribe;
  }, [navigation, fetchTodos]);

  // Toggle todo completion
  const handleToggle = async (todo) => {
    // Optimistic UI update for immediate user feedback
    const previousTodos = [...todos];
    setTodos(
      todos.map((item) =>
        item._id === todo._id ? { ...item, completed: !item.completed } : item
      )
    );

    try {
      const response = await api.patch(`/todos/${todo._id}/toggle`);
      // Update with server truth
      setTodos((current) =>
        current.map((item) =>
          item._id === todo._id ? response.data : item
        )
      );
    } catch (error) {
      // Revert if error
      setTodos(previousTodos);
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  // Navigate to edit screen
  const handleEdit = (todo) => {
    navigation.navigate('AddTodo', { todo });
  };

  // Delete todo with confirmation dialog
  const handleDelete = (todo) => {
    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete "${todo.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoadingId(todo._id);
            try {
              await api.delete(`/todos/${todo._id}`);
              setTodos((current) =>
                current.filter((item) => item._id !== todo._id)
              );
            } catch (error) {
              Alert.alert('Error', getErrorMessage(error));
            } finally {
              setActionLoadingId(null);
            }
          },
        },
      ]
    );
  };

  // Logout confirmation
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Header with safe area inset */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top > 0 ? insets.top + 10 : 24,
          },
        ]}
      >
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Friend'} 👋</Text>
          <Text style={styles.headerSubtitle}>
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'} total
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Todo List */}
      {loading ? (
        <Loading message="Fetching your tasks..." />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={<EmptyTodos />}
          contentContainerStyle={[
            styles.listContent,
            todos.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchTodos(true)}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* Floating Add Todo Button with safe area inset */}
      <View
        style={[
          styles.footerContainer,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 16,
          },
        ]}
      >
        <AppButton
          title="+ Add New Task"
          onPress={() => navigation.navigate('AddTodo')}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    marginVertical: 0,
    height: 50,
  },
});
