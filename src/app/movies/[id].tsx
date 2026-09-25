import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

import {fetchMovieDetails} from "@/services/api";
import useFetch from "@/services/useFetch";
import {icons} from "../../../constants/icons";

import {useEffect, useState} from "react";
import {isMovieSaved, toggleSaveMovie, SavedMovie} from "@/services/storage";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({label, value}: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const MovieDetails = () => {
    const router = useRouter();
    const {id} = useLocalSearchParams(); // Tıklanan filmin ID'sini URL'den çeker

    const [isSaved, setIsSaved] = useState<boolean>(false);

    const {data: movie, loading} = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    useEffect(() => {
        if (movie?.id) {
            checkSavedStatus(movie.id);
        }
    }, [movie]);

    const checkSavedStatus = async (movieId: number) => {
        const saved = await isMovieSaved(movieId);
        setIsSaved(saved);
    }

    // Favorilere ekleme çıkarma yapan fonksiyon
    const handleToggleSave = async () => {
        if (!movie) return;

        const movieToSave: SavedMovie = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path!,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
        };

        const newSavedStatus = await toggleSaveMovie(movieToSave);
        setIsSaved(newSavedStatus); // Butonun durumunu (Saved / Save Movie) anında günceller
    };

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <ActivityIndicator/>
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{paddingBottom: 80}}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                    />

                    <TouchableOpacity
                        className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
                        <Image
                            source={icons.play}
                            className="w-6 h-7 ml-1"
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>

                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-xl">{movie?.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">
                            {movie?.release_date?.split("-")[0]} •
                        </Text>
                        <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
                    </View>

                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4"/>

                        <Text className="text-white font-bold text-sm">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>

                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>

                    <MovieInfo label="Overview" value={movie?.overview}/>
                    <MovieInfo
                        label="Genres"
                        value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
                    />

                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo
                            label="Budget"
                            value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
                        />
                        <MovieInfo
                            label="Revenue"
                            value={`$${Math.round(
                                (movie?.revenue ?? 0) / 1_000_000
                            )} million`}
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={
                            movie?.production_companies?.map((c) => c.name).join(" • ") ||
                            "N/A"
                        }
                    />
                </View>
            </ScrollView>

            {/* Alt Sabit Butonlar Alanı */}
            <View className="absolute bottom-5 left-0 right-0 mx-5 flex-row gap-x-3 z-50">
                {/* Geri Dön Butonu */}
                <TouchableOpacity
                    className="flex-1 bg-dark-100 rounded-lg py-3.5 flex-row items-center justify-center border border-light-300/20"
                    onPress={router.back}
                >
                    <Image
                        source={icons.arrow}
                        className="size-5 mr-1 rotate-180"
                        tintColor="#fff"
                    />
                    <Text className="text-white font-semibold text-base">Go Back</Text>
                </TouchableOpacity>

                {/* Favorilere Ekle / Çıkar Butonu */}
                <TouchableOpacity
                    className={`flex-1 rounded-lg py-3.5 flex-row items-center justify-center ${
                        isSaved ? "bg-dark-100 border border-accent" : "bg-accent"
                    }`}
                    onPress={handleToggleSave}>
                    <Image
                        source={icons.star} // Varsa favori/kalp ikonun, yoksa star ikonu
                        className="size-5 mr-2"
                        tintColor={isSaved ? "#AB8BFF" : "#fff"}
                    />
                    <Text className="text-white font-semibold text-base">{isSaved ? "Saved" : "Save Movie"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MovieDetails;