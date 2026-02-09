import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface, SegmentedButtons, useTheme, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addTask, updateTask } from '../../store/slices/taskSlice';
import api from '../../services/api';
import { format } from 'date-fns';
import { Calendar, Clock, AlignLeft, Flag, CheckCircle2, ChevronLeft } from 'lucide-react-native';
import { useEffect } from 'react';

const AddTaskScreen = ({ navigation, route }: any) => {
    const editingTask = route.params?.task;

    const [title, setTitle] = useState(editingTask?.title || '');
    const [description, setDescription] = useState(editingTask?.description || '');
    const [dateTime, setDateTime] = useState(editingTask ? new Date(editingTask.dateTime) : new Date());
    const [deadline, setDeadline] = useState(editingTask ? new Date(editingTask.deadline) : new Date());
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editingTask?.priority || 'medium');
    const [loading, setLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

    const theme = useTheme();
    const dispatch = useAppDispatch();

    const handleSaveTask = async () => {
        if (!title) return;

        setLoading(true);
        try {
            if (editingTask) {
                const response = await api.put(`/tasks/${editingTask._id}`, {
                    title,
                    description,
                    dateTime,
                    deadline,
                    priority,
                });
                dispatch(updateTask(response.data));
            } else {
                const response = await api.post('/tasks', {
                    title,
                    description,
                    dateTime,
                    deadline,
                    priority,
                });
                dispatch(addTask(response.data));
            }
            navigation.goBack();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <IconButton
                    icon={() => <ChevronLeft size={24} color={theme.colors.onSurface} />}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                    {editingTask ? 'Edit Task' : 'New Task'}
                </Text>
            </View>

            <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
                <TextInput
                    label="What needs to be done?"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />

                <TextInput
                    label="Description (Optional)"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />

                <View style={styles.section}>
                    <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.outline }]}>Priority</Text>
                    <SegmentedButtons
                        value={priority}
                        onValueChange={setPriority as any}
                        buttons={[
                            { value: 'low', label: 'Low', checkedColor: theme.colors.primary },
                            { value: 'medium', label: 'Medium', checkedColor: theme.colors.primary },
                            { value: 'high', label: 'High', checkedColor: theme.colors.primary },
                        ]}
                        style={styles.segmentedButtons}
                    />
                </View>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.datePickerButton, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={20} color={theme.colors.primary} />
                        <View style={styles.dateTextContainer}>
                            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Date</Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{format(dateTime, 'MMM dd, yyyy')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.datePickerButton, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Clock size={20} color={theme.colors.primary} />
                        <View style={styles.dateTextContainer}>
                            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Time</Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{format(dateTime, 'HH:mm')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.datePickerButton, { marginTop: 12, backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]}
                    onPress={() => setShowDeadlinePicker(true)}
                >
                    <Flag size={20} color={theme.colors.error} />
                    <View style={styles.dateTextContainer}>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Deadline</Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{format(deadline, 'MMM dd, yyyy')}</Text>
                    </View>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dateTime}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setDateTime(date);
                        }}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={dateTime}
                        mode="time"
                        display="default"
                        onChange={(event, date) => {
                            setShowTimePicker(false);
                            if (date) setDateTime(date);
                        }}
                    />
                )}

                {showDeadlinePicker && (
                    <DateTimePicker
                        value={deadline}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDeadlinePicker(false);
                            if (date) setDeadline(date);
                        }}
                    />
                )}

                <Button
                    mode="contained"
                    onPress={handleSaveTask}
                    loading={loading}
                    disabled={loading || !title}
                    style={styles.saveButton}
                    contentStyle={styles.saveButtonContent}
                >
                    {editingTask ? 'Update Task' : 'Save Task'}
                </Button>
            </Surface>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginLeft: -12,
    },
    title: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    formCard: {
        padding: 20,
        borderRadius: 24,
    },
    input: {
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 8,
        fontWeight: '600',
    },
    segmentedButtons: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datePickerButton: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    dateTextContainer: {
        marginLeft: 10,
    },
    saveButton: {
        marginTop: 24,
        borderRadius: 16,
    },
    saveButtonContent: {
        paddingVertical: 10,
    },
});

export default AddTaskScreen;
