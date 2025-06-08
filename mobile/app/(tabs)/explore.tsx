import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

interface Product {
    id: string;
    name: string;
    quantity: number;
    unit: string;
}
import {useStore} from "@/constants/store";

export default function ExploreScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [unit, setUnit] = useState('g'); // Domyślnie gramy
    const {addIngredient, removeIngredient, filterRecipes} = useStore();


    // Ładowanie danych z AsyncStorage przy starcie
    useEffect(() => {
        const loadProducts = async () => {
            const storedProducts = await AsyncStorage.getItem('products');
            if (storedProducts) {
                let products_ = JSON.parse(storedProducts);

                products_.forEach((product: Product) => {
                  addIngredient(product.name);
                })

                setProducts(products_);
            }
        };
        loadProducts();
    }, []);

    // Zapis danych do AsyncStorage przy każdej zmianie
    useEffect(() => {
        AsyncStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = () => {
        if (!productName || !productQuantity) {
            Alert.alert('Błąd', 'Podaj nazwę, ilość i jednostkę produktu.');
            return;
        }

        const quantity = parseInt(productQuantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            Alert.alert('Błąd', 'Ilość musi być liczbą większą od 0.');
            return;
        }

        // Dodaje składnik do globalnego stanu
        addIngredient(productName)

        setProducts((prevProducts) => {
            const existingProduct = prevProducts.find(
                (product) =>
                    product.name.toLowerCase() === productName.toLowerCase() &&
                    product.unit === unit
            );

            if (existingProduct) {
                return prevProducts.map((product) =>
                    product.id === existingProduct.id
                        ? { ...product, quantity: product.quantity + quantity }
                        : product
                );
            } else {
                // Dodanie nowego produktu
                return [
                    ...prevProducts,
                    { id: Date.now().toString(), name: productName, quantity, unit },
                ];
            }
        });

        setProductName('');
        setProductQuantity('');
        filterRecipes();
    };

    const removeProduct = (id: string) => {
        //Usuwa składnik z globalnego stanu :)))) UWU OWO ONI-CHANN
        let name = products.find((product) => product.id === id)?.name;
        removeIngredient(name)

        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));

        filterRecipes()
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Text style={styles.title}>Twoje produkty</Text>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.product}>
                                <Text style={styles.productText}>
                                    {item.name} - {item.quantity} {item.unit}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => removeProduct(item.id)}
                                    style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>Usuń</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nazwa produktu"
                            value={productName}
                            onChangeText={setProductName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ilość"
                            value={productQuantity}
                            onChangeText={setProductQuantity}
                            keyboardType="numeric"
                        />
                        <Picker
                            selectedValue={unit}
                            onValueChange={(itemValue) => setUnit(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label="Gramy (g)" value="g" />
                            <Picker.Item label="Mililitry (ml)" value="ml" />
                        </Picker>
                        <Button title="Dodaj produkt" onPress={addProduct} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    product: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    productText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    picker: {
        height: 60,
        marginBottom: 10,
        justifyContent: 'center',
    },
});