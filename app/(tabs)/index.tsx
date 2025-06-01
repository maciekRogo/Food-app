import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const { width, height } = Dimensions.get('window');


const cards = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, text: `Karta ${i + 1}` }));

export default function TinderLikeCards() {
    const onSwiped = (cardIndex: number) => {
        console.log('Przesunięto kartę:', cards[cardIndex]);
    };

    const onSwipedAll = () => {
        console.log('Wszystkie karty zostały przesunięte');
    };

    const renderCard = (card: { id: number; text: string }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{card.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Swiper
                cards={cards}
                renderCard={renderCard}
                onSwiped={onSwiped}
                onSwipedAll={onSwipedAll}
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
        height: height -170,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 40,
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});