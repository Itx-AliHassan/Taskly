import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import colors from '../constants/colors';
import TodoInput from '../components/TodoInput';
import AppButton from '../components/AppButton';
import api, { getErrorMessage } from '../services/api';

export default function AddTodoScreen({ navigation, route }) {
  const editingTodo = route.params?.todo;
  const isEditing = Boolean(editingTodo);

  const [title, setTitle] = useState(editingTodo?.title || '');
  const [description, setDescription] = useState(editingTodo?.description || '');
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');

  // Dynamically set navigation header title
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Task' : 'New Task',
    });
  }, [navigation, isEditing]);

  const handleSave = async () => {
    setTitleError('');

    if (!title.trim()) {
      setTitleError('Task title is required');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Update existing todo
        await api.put(`/todos/${editingTodo._id}`, {
          title: title.trim(),
          description: description.trim(),
        });
      } else {
        // Create new todo
        await api.post('/todos', {
          title: title.trim(),
          description: description.trim(),
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            {isEditing ? '✏️ Edit Task Details' : '📝 Create New Task'}
          </Text>

          <TodoInput
            label="Title *"
            placeholder="e.g., Complete React Native assignment"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError('');
            }}
            error={titleError}
          />

          <TodoInput
            label="Description (Optional)"
            placeholder="Add extra context, steps, or notes..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <AppButton
            title={isEditing ? 'Update Task' : 'Create Task'}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />

          <AppButton
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 8,
  },
});
