import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  return (
    <View style={[styles.card, todo.completed && styles.cardCompleted]}>
      {/* Toggle completion status button */}
      <TouchableOpacity
        onPress={() => onToggle(todo)}
        style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}
        activeOpacity={0.7}
      >
        {todo.completed ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : null}
      </TouchableOpacity>

      {/* Todo content (Title and Description) */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            todo.completed && styles.titleCompleted,
          ]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>
        {todo.description ? (
          <Text
            style={[
              styles.description,
              todo.completed && styles.descriptionCompleted,
            ]}
            numberOfLines={3}
          >
            {todo.description}
          </Text>
        ) : null}
        <View style={styles.badgeContainer}>
          <Text
            style={[
              styles.badgeText,
              { color: todo.completed ? colors.success : colors.warning },
            ]}
          >
            {todo.completed ? '● Completed' : '○ Pending'}
          </Text>
        </View>
      </View>

      {/* Action buttons (Edit and Delete) */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(todo)}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(todo)}
          style={[styles.actionButton, styles.deleteButton]}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardCompleted: {
    opacity: 0.75,
    borderColor: '#1E2333',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  badgeContainer: {
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#2D1619',
  },
  editIcon: {
    fontSize: 14,
  },
  deleteIcon: {
    fontSize: 14,
  },
});
