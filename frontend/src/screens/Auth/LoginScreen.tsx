import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { LogIn, Mail, Lock } from 'lucide-react-native';
import type { RootState } from '../../store/store';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);
    const theme = useTheme();

    const handleLogin = async () => {
        if (!email || !password) return;

        dispatch(loginStart());
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            await SecureStore.setItemAsync('userToken', token);
            dispatch(loginSuccess({ token, user }));
        } catch (err: any) {
            dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Surface style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
                        <LogIn size={40} color={theme.colors.onPrimaryContainer} />
                    </Surface>
                    <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onSurface }]}>Welcome Back</Text>
                    <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.outline }]}>Sign in to manage your tasks efficiently</Text>
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

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        Login
                    </Button>

                    <View style={styles.footer}>
                        <Text style={{ color: theme.colors.onSurface }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
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
        marginBottom: 48,
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

export default LoginScreen;
