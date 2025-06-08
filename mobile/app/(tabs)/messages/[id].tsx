import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from "@/constants/store";
import {initial} from "lodash";

const apiKey = "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";



const getResponse = async (message,initial) =>{
    const messages = [
        { role: "system", content: initial },
        { role: "user", content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4.1-nano",
            messages: messages
        })
    })

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    let data = await response.json();

    console.log(data.choices[0].message.content);
    return data;
};

export default function ChatWithUser() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { recipes } = useStore();
    const recipe = recipes.find(recipe => recipe.id == id);

    const initial_prompt = `Jesteś ${recipe ? recipe.title : "ciekawym pączkiem"}, odpowiadaj użytkownikowi i zadawaj pytania aby utrzymywać rozmowę, flirtuj z nim i zadawaj żarty`;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const goBackAndClearChat = () => {
        setMessages([]); // Wyczyść rozmowę
        router.navigate("messages"); // Wróć do poprzedniego ekranu
    };
    const sendMessage = () => {
        if (input.trim()) {
            setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), text: input, sender: "user" }])
            setInput("");
            getResponse(input, initial_prompt).then(response => {
                setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), text: response.choices[0].message.content, sender: "system" }]);
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {recipe && (
                <View style={styles.header}>
                    <Image source={{ uri: recipe.img_url }} style={styles.image} />
                    <Text style={styles.title}>Rozmawiasz z {recipe.title}</Text>
                </View>
            )}

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageBubble,
                            item.sender === "user" ? styles.userMessage : styles.systemMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messagesContainer}
            />

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Napisz coś zabawnego..."
                    placeholderTextColor="#999"
                />
                <View style={styles.sendButtonWrapper}>
                    <Button title="Wyślij" onPress={sendMessage} color="#4CAF50" />
                </View>
            </View>

            <View style={styles.backButton}>
                <Button title="← Powrót" onPress={goBackAndClearChat} color="#555" />

            </View>


        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#eee',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    messagesContainer: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'flex-end',
    },
    messageBubble: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 6,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6', // zielony jak w WhatsAppie
    },
    systemMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC', // jasny szary
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    backButton: {
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    sendButtonWrapper: {
        borderRadius: 25,
        overflow: 'hidden', // Zaokrąglenie przycisku Button
    },
});
