import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useAuth } from "../context/AuthProvider";

const Welcome = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.icon}
            className="w-[130px] h-[130px]"
            resizeMode="contain"
          />

          {/* <Image
                    source={images.cards}
                    className="max-w-[380px] w-full h-[298px]"
                    resizeMode="contain"
                /> */}

          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              歡迎使用 U-Bird Eats!{"\n"}
              餓了，就快點下單吧!{" "}
            </Text>
          </View>

          <CustomButton
            title="開始使用"
            handlePress={() => router.push("sign-in")}
            containerStyles="w-64 mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
