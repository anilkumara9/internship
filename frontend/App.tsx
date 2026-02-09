import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, adaptNavigationTheme, MD3Theme, useTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store/store';
import { useAppSelector } from './src/hooks/reduxHooks';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import type { RootState } from './src/store/store';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import AddTaskScreen from './src/screens/Task/AddTaskScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

const MainStack = () => {
    const theme = useTheme();
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: { fontWeight: 'bold' },
            headerShadowVisible: false,
        }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const RootNavigator = ({ theme }: { theme: any }) => {
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    return (
        <NavigationContainer theme={theme}>
            {isAuthenticated ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme: any = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
        primary: '#6750A4',
    },
    fonts: MD3LightTheme.fonts,
};

const CombinedDarkTheme: any = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
        primary: '#D0BCFF',
    },
    fonts: MD3DarkTheme.fonts,
};

function MainApp() {
    const themeMode = useAppSelector((state: RootState) => state.auth.theme);
    const theme = themeMode === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

    return (
        <PaperProvider theme={theme}>
            <RootNavigator theme={theme} />
        </PaperProvider>
    );
}

export default function App() {
    return (
        <ReduxProvider store={store}>
            <MainApp />
        </ReduxProvider>
    );
}
