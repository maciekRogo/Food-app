import {View, Text, StyleSheet, Dimensions, Image, ScrollView} from "react-native";
import {useStore} from "@/constants/store";
const { width, height } = Dimensions.get('window');

export default function MessagesScreen() {
    const { recipes,interactedRecipes } = useStore();

    let availableRecipes = recipes.filter(recipe => {
        let interaction = interactedRecipes.find(interaction => interaction.recipeId === recipe.id);
        if (interaction){
            return interaction.action !== 'dislike';
        }
        return false;
    });


    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View
                style={styles.container}
            >
                <Text>Messages Screen</Text>
                {availableRecipes.length > 0 ? (
                    availableRecipes.map((recipe) => (
                        <View key={recipe.id} style={styles.row}>
                            <Image source={{uri: recipe.img_url}} style={{width:64,height:64}}/>
                            <Text>{recipe.title}</Text>
                        </View>
                    ))): <View>Działaj kociaku albo dzisiaj nic nie jesz</View>}
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
        paddingBottom: 80,
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 40,
        marginBottom: 20,
    }
});