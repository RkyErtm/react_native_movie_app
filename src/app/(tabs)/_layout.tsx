import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { icons } from "../../../constants/icons";
import { images } from "../../../constants/images";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <View
        style={styles.selectedTab}
        className={
          "flex-row justify-center items-center rounded-full overflow-hidden"
        }
      >
        <Image
          source={images.highlight}
          style={styles.highlight}
          resizeMode="stretch"
        />
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className={"text-secondary text-base font-semibold ml-2"}>
          {title}
        </Text>
      </View>
    );
  }
  return (
    <View className={"size-full justify-center items-center rounded-full"}>
      <Image source={icon} tintColor={"#A8B5DB"} className="size-5" />
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        // 52px bar - 2px border - the tab button's 5px padding on each side.
        tabBarIconStyle: { width: 112, height: 40 },
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0f0d23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          // The floating bar already has bottom spacing via marginBottom.
          paddingBottom: 0,
          paddingTop: 0,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0f0d23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name={"search"}
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name={"saved"}
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Saved" />
          ),
        }}
      />
      <Tabs.Screen
        name={"profile"}
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;

const styles = StyleSheet.create({
  selectedTab: {
    width: 112,
    height: 50,
  },
  highlight: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
});
