import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View, TextInput, Button, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                router.replace('/login');
            } else {
                const errorData = await response.json();
                alert(JSON.stringify(errorData));
            }
        } catch (error) {
            alert('Błąd połączenia z serwerem');
        }
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <Text style={styles.title}>Rejestracja</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Zarejestruj</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
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
        backgroundColor: '#34C759',
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
        color: '#34C759',
        textAlign: 'center',
        marginTop: 8,
    },
});
