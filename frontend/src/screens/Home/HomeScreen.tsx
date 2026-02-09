import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB, Card, IconButton, Checkbox, useTheme, ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchTasksStart, fetchTasksSuccess, fetchTasksFailure, updateTask, deleteTask } from '../../store/slices/taskSlice';
import api from '../../services/api';
import { sortTasks } from '../../utils/sorting';
import { Trash2, Edit3, Plus, Calendar, Clock, LogOut, Sun, Moon, CheckCircle2, Circle, ListTodo } from 'lucide-react-native';
import { format } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import { logout, toggleTheme } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store';

const HomeScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state: RootState) => state.tasks);
    const { user, theme: themeMode } = useAppSelector((state: RootState) => state.auth);
    const theme = useTheme();

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.isCompleted).length,
        pending: tasks.filter(t => !t.isCompleted).length,
    };

    const loadTasks = async () => {
        dispatch(fetchTasksStart());
        try {
            const response = await api.get('/tasks');
            dispatch(fetchTasksSuccess(response.data));
        } catch (err: any) {
            dispatch(fetchTasksFailure(err.response?.data?.message || 'Failed to fetch tasks'));
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleToggleComplete = async (task: any) => {
        try {
            const response = await api.put(`/tasks/${task._id}`, { ...task, isCompleted: !task.isCompleted });
            dispatch(updateTask(response.data));
        } catch (err) {
            Alert.alert('Error', 'Failed to update task');
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        dispatch(logout());
    };

    const handleDeleteTask = async (id: string) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/tasks/${id}`);
                            dispatch(deleteTask(id));
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete task');
                        }
                    },
                },
            ]
        );
    };

    const sortedTasks = sortTasks(tasks);

    const renderTaskItem = ({ item }: { item: any }) => (
        <Card style={[styles.taskCard, item.isCompleted && styles.completedCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Card.Content style={styles.cardContent}>
                <TouchableOpacity
                    style={styles.leftContainer}
                    onPress={() => navigation.navigate('AddTask', { task: item })}
                >
                    <IconButton
                        icon={() => item.isCompleted ?
                            <CheckCircle2 size={24} color={theme.colors.primary} /> :
                            <Circle size={24} color={theme.colors.outline} />
                        }
                        onPress={() => handleToggleComplete(item)}
                    />
                    <View style={styles.textContainer}>
                        <Text
                            variant="titleMedium"
                            style={[styles.taskTitle, item.isCompleted && styles.completedText, { color: theme.colors.onSurface }]}
                        >
                            {item.title}
                        </Text>
                        <View style={styles.dateContainer}>
                            <Calendar size={12} color={theme.colors.outline} style={{ marginRight: 4 }} />
                            <Text variant="bodySmall" style={[styles.dateText, { color: theme.colors.outline }]}>
                                {format(new Date(item.dateTime), 'MMM dd, HH:mm')}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.actionsContainer}>
                    <View style={[
                        styles.priorityBadge,
                        { backgroundColor: item.priority === 'high' ? '#FFDAD6' : item.priority === 'medium' ? '#FFDDBE' : '#D1E8FF' }
                    ]}>
                        <Text
                            variant="labelSmall"
                            style={[
                                styles.priorityText,
                                { color: item.priority === 'high' ? '#410002' : item.priority === 'medium' ? '#2A1800' : '#001D36' }
                            ]}
                        >
                            {item.priority.toUpperCase()}
                        </Text>
                    </View>
                    <IconButton
                        icon={() => <Trash2 size={20} color={theme.colors.error} />}
                        onPress={() => handleDeleteTask(item._id)}
                    />
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surfaceVariant }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text variant="headlineSmall" style={[styles.welcomeText, { color: theme.colors.onSurfaceVariant }]}>
                            Hello, {user?.email.split('@')[0]}
                        </Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}>
                            Welcome back
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        <IconButton
                            icon={() => themeMode === 'dark' ? <Sun size={24} color={theme.colors.onSurfaceVariant} /> : <Moon size={24} color={theme.colors.onSurfaceVariant} />}
                            onPress={() => dispatch(toggleTheme())}
                        />
                        <IconButton
                            icon={() => <LogOut size={24} color={theme.colors.error} />}
                            onPress={handleLogout}
                        />
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>{stats.total}</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>TOTAL</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#4CAF50' }}>{stats.completed}</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>DONE</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#FF9800' }}>{stats.pending}</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>PENDING</Text>
                    </View>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={sortedTasks}
                    renderItem={renderTaskItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyLarge">No tasks yet. Add one to get started!</Text>
                        </View>
                    }
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('AddTask')}
                label="Add Task"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
    },
    welcomeText: {
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    taskCard: {
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
    },
    completedCard: {
        opacity: 0.6,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        marginLeft: 4,
        flex: 1,
    },
    taskTitle: {
        fontWeight: '600',
    },
    completedText: {
        textDecorationLine: 'line-through',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    priorityText: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        paddingHorizontal: 8,
    },
});

export default HomeScreen;
