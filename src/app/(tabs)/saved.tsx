import {useState, useCallback} from "react";
import {View, Text, FlatList, Image, ActivityIndicator} from "react-native";
import {useFocusEffect} from "expo-router";

import {images} from "../../../constants/images";
import {icons} from "../../../constants/icons";

import MovieCard from "@/components/MovieCard";
import {getSavedMovies, SavedMovie} from "@/services/storage";
import {SafeAreaView} from "react-native-safe-area-context";

const Save = () => {

    const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Hafızadan kayıtlı filmleri çeken fonksiyon
    const fetchSavedMovies = async () => {
        setLoading(true);
        const movies = await getSavedMovies();
        setSavedMovies(movies);
        setLoading(false);
    };

    // Ekran her odağa geldiğinde listeyi yenile
    useFocusEffect(
        useCallback(() => {
            fetchSavedMovies();
        }, [])
    );

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                data={savedMovies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <View className="mt-20 mb-5">
                        <View className="w-full flex-row justify-center mb-5">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>
                        <Text className="text-2xl text-white font-bold">
                            Saved Movies
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                No saved movies yet. Start adding your favorites!
                            </Text>
                        </View>
                    ) : null
                }
            />

            {loading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    className="absolute self-center top-1/2"
                />
            )}
        </View>
    );
};

export default Save;