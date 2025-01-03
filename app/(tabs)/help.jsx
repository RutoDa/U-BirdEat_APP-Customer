import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";


const Help = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <Text className="text-5xl font-semibold text-black pt-5 text-center font-psemibold mb-40">
          U-Bird Eats{`\n`}智慧助理
        </Text>
        <View className="flex-1 bg-white p-4 justify-center space-y-6">
          <TouchableOpacity
            className="bg-blue-500 p-6 rounded-xl flex-row items-center space-x-4 mb-8"
            onPress={() => router.push("/chatbot")}
          >
            <MaterialIcons name="smart-toy" size={48} color="white" />
            <View className="flex-1 mx-4">
              <Text className="text-white text-xl font-bold mb-2">
                智能機器人功能
              </Text>
              <Text className="text-white text-sm">
                透過聊天了解您的需求，為您推薦最適合的餐廳與商品
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 p-6 rounded-xl flex-row items-center space-x-4"
            onPress={() => router.push("/random-meal")}
          >
            <FontAwesome name="random" size={48} color="white" />
            <View className="flex-1 mx-4">
              <Text className="text-white text-xl font-bold mb-2">
                隨機選餐功能
              </Text>
              <Text className="text-white text-sm">
                只要設定預算，讓系統為您搭配完美的餐點組合
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Help;
