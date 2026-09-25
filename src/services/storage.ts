import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
}

const FAVORITES_KEY = '@favorite_movies';

export const getSavedMovies = async (): Promise<SavedMovie[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error("Favori filmler getirilirken hata oluştu:", error);
        return [];
    }
};

export const isMovieSaved = async (id: number): Promise<boolean> => {
    try {
        const savedMovies = await getSavedMovies();
        return savedMovies.some((movie) => movie.id === id);
    } catch (error) {
        console.error("Film kontrolü yapılırken hata oluştu:", error);
        return false;
    }
}

export const toggleSaveMovie = async (movie: SavedMovie): Promise<boolean> => {
    try {
        const savedMovies = await getSavedMovies();
        const isAlreadySaved = savedMovies.some((item) => item.id === movie.id);

        let updatedMovies: SavedMovie[];
        if (isAlreadySaved) {
            // Film zaten ekliyse listeden çıkar
            updatedMovies = savedMovies.filter((item) => item.id !== movie.id);
        } else {
            updatedMovies = [...savedMovies, movie];
        }
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedMovies));

        return !isAlreadySaved;
    } catch (error) {
        console.error("Film kaydedilirken hata oluştu:", error);
        return false;
    }
}