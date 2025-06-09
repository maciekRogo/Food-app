import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import { useStore } from "@/constants/store";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export default function MessagesScreen() {
    const { recipes, interactedRecipes } = useStore();
    const router = useRouter();

    const availableRecipes = recipes.filter(recipe => {
        const interaction = interactedRecipes.find(interaction => interaction.recipeId === recipe.id);
        return interaction && interaction.action !== 'dislike';
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Twoje przepisy</Text>
                {availableRecipes.length > 0 ? (
                    availableRecipes.map((recipe) => (
                        <TouchableOpacity
                            key={recipe.id}
                            style={styles.card}
                            onPress={() => router.push(`/cos/${recipe.id}`)}
                        >
                            <Image source={{ uri: recipe.img_url }} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                <Text style={styles.subtitle}>Kliknij, by porozmawiać</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Działaj kociaku, albo dzisiaj nic nie jesz 😼</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
        paddingBottom: 80,
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        width: width - 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 8,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyContainer: {
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
    },
});
