import {StyleSheet, Text, View} from "react-native";
import {Link} from "expo-router";

export default function Index() {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-5xl text-accent font-bold">Welcomeee!</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
