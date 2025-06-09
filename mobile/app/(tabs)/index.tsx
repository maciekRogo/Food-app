import React, {useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {useStore} from "@/constants/store";

const { width, height } = Dimensions.get('window');

export default function TinderLikeCards() {
    const { filtered_recipes, getRecipes, addInteractedRecipe, filterRecipes } = useStore();

    useEffect(() => {
        const fetchCards = async () => {
            await getRecipes();
        };
        fetchCards();
        filterRecipes();
    }, []);

    const onSwiped = (cardIndex: number) => {

        console.log('Przesunięto kartę:', filtered_recipes[cardIndex]);
    };

    const onSwipedAll = () => {
        console.log('Wszystkie karty zostały przesunięte');
    };

    const renderCard = (card) => {
        if (!card) {
            return (
                <View style={styles.card}>
                    <Text style={styles.cardText}>Brak kart do wyświetlenia</Text>
                </View>
            );
        }
        return (
            <View style={styles.card}>
                <Image source={{ uri: card.img_url }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>
                    Hej mały, jeśli chcesz mnie zjeść, daj w lewo
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Swiper
                cards={filtered_recipes}
                renderCard={renderCard}
                onSwiped={onSwiped}
                onSwipedAll={onSwipedAll}
                onSwipedRight={(cardIndex) => {
                    let recipe_id = filtered_recipes[cardIndex].id;
                    addInteractedRecipe(recipe_id,"like");
                }}
                onSwipedLeft={(cardIndex) => {
                    let recipe_id = filtered_recipes[cardIndex].id;
                    addInteractedRecipe(recipe_id,"dislike");
                }}
                cardIndex={0}
                backgroundColor="transparent"
                stackSize={3}
                cardVerticalMargin={20}
                stackSeparation={15}
                overlayLabels={{
                    left: {
                        title: 'NIE LUBIĘ',
                        style: {
                            label: {
                                color: 'red',
                                fontSize: 25,
                                fontWeight: 'bold',
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                marginTop: 20,
                                marginLeft: -20,
                            },
                        },
                    },
                    right: {
                        title: 'LUBIĘ',
                        style: {
                            label: {
                                color: 'green',
                                fontSize: 25,
                                fontWeight: 'bold',
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: 20,
                                marginLeft: 20,
                            },
                        },
                    },
                }}
            />
        </View>
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
    card: {
        width: width * 0.9,
        height: height -190,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 10,
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardImage: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover',
    },

    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        marginHorizontal: 10,
        color: '#333',
        textAlign: 'center',
    },

    cardDescription: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 15,
        color: '#666',
        textAlign: 'center',
    },
});