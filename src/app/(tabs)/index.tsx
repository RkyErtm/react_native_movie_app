import {ActivityIndicator, FlatList, Image, ScrollView, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {images} from "../../../constants/images";
import {icons} from "../../../constants/icons";
import SearchBar from "../../components/searchbar";
import fetchMovies from "@/services/api";
import useFetch from "@/services/useFetch";
import MovieCard from "@/components/MovieCard";
import {getTrendingMovies} from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
    const router = useRouter();


    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError
    } = useFetch(() => {
        return fetchMovies({query: ''});
    })

    // @ts-ignore
    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className={"absolute w-full z-0"}/>
            {moviesLoading || trendingLoading ? (
                <ActivityIndicator
                    size={"large"}
                    color={"#0000ff"}
                    className={"mt-10 self-center"}/>
            ) : moviesError || trendingError ? (
                <Text className="px-5">
                    Error: {moviesError?.message || trendingError?.message}
                </Text>
            ) : (
                <FlatList
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    data={movies ?? []}
                    renderItem={({item}) => <MovieCard {...item}/>}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "flex-start",
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 10,
                    }}
                    contentContainerStyle={{paddingBottom: 100}}
                    ListHeaderComponent={
                        <View>
                            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"/>
                            <SearchBar
                                onPress={() => router.push("/search")}
                                placeholder="Search through 300+ movies online"
                            />

                            {trendingMovies && trendingMovies.length > 0 && (
                                <View className="mt-10">
                                    <Text className="text-lg text-white font-bold mb-3">
                                        Trending Movies
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{gap: 26}}
                                    >
                                        {trendingMovies.map((item, index) => (
                                            <TrendingCard
                                                key={`${item.movie_id}-${index}`}
                                                movie={item}
                                                index={index}
                                            />
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            <Text className="text-lg text-white font-bold mb-3 mt-5">
                                Latest Movies
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}