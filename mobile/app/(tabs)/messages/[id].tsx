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

    const sendMessage = () => {
        if (input.trim()) {
            setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), text: input, sender: "user" }])
            setInput("");
            getResponse(input,initial_prompt).then(response => {
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
                    <Text style={styles.title}>Chat with {recipe.title}</Text>
                </View>
            )}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.sender === "user" ? styles.userMessage : styles.otherMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
            <Button title="Go Back" onPress={() => router.navigate("messages")} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 128,
        height: 128,
        borderRadius: 64,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    messagesContainer: {
        flexGrow: 1,
        padding: 10,
    },
    message: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1f7c4',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f1f1',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 40,
        marginRight: 10,
    },
});