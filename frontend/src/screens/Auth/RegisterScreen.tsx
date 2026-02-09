import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { UserPlus, Mail, Lock } from 'lucide-react-native';
import type { RootState } from '../../store/store';

const RegisterScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);
    const theme = useTheme();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) return;
        if (password !== confirmPassword) {
            dispatch(loginFailure('Passwords do not match'));
            return;
        }

        dispatch(loginStart());
        try {
            const response = await api.post('/auth/register', { email, password });
            const { token, user } = response.data;
            await SecureStore.setItemAsync('userToken', token);
            dispatch(loginSuccess({ token, user }));
        } catch (err: any) {
            console.error('Registration Error:', err);
            console.error('Error Details:', err.response?.data || err.message);
            dispatch(loginFailure(err.response?.data?.message || 'Registration failed'));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Surface style={[styles.logoContainer, { backgroundColor: theme.colors.secondaryContainer }]} elevation={2}>
                        <UserPlus size={40} color={theme.colors.onSecondaryContainer} />
                    </Surface>
                    <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onSurface }]}>Create Account</Text>
                    <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.outline }]}>Join us and stay organized</Text>
                </View>

                <Surface style={[styles.formContainer, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon={() => <Mail size={20} color={theme.colors.outline} />} />}
                        style={styles.input}
                        activeOutlineColor={theme.colors.primary}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        left={<TextInput.Icon icon={() => <Lock size={20} color={theme.colors.outline} />} />}
                        style={styles.input}
                        activeOutlineColor={theme.colors.primary}
                    />
                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry
                        left={<TextInput.Icon icon={() => <Lock size={20} color={theme.colors.outline} />} />}
                        style={styles.input}
                        activeOutlineColor={theme.colors.primary}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        Register
                    </Button>

                    <View style={styles.footer}>
                        <Text style={{ color: theme.colors.onSurface }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Surface>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 88,
        height: 88,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    subtitle: {
        marginTop: 8,
        textAlign: 'center',
    },
    formContainer: {
        padding: 24,
        borderRadius: 28,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        borderRadius: 16,
    },
    buttonContent: {
        paddingVertical: 10,
    },
    errorText: {
        color: '#BA1A1A',
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
});

export default RegisterScreen;
