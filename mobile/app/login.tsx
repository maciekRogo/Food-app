import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View, TextInput, Button, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import {api_host} from "@/constants/api_url";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log("fetchuje")
            const response = await fetch(`http://${api_host}:8000/api/users/login_via_request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                router.replace('/(tabs)');
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Niepoprawne dane logowania');
            }
        } catch (error) {
            console.log(error)
            alert('Błąd połączenia z serwerem');
        }
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <Text style={styles.title}>Zaloguj się</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
            />
            <TextInput
                placeholder="Hasło"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Zaloguj</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    link: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 8,
    },
});
