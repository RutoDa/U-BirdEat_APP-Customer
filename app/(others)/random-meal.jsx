import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../global/axios";

const RandomMeal = () => {
  const [submitting, setSubmitting] = useState(false);
  const [budget, setBudget] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (budget === "" || deliveryAddress === "") {
      setError("請填寫所有欄位");
      return;
    }
    if (isNaN(budget)) {
      setError("預算必須為數字");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosInstance.post("customer/random_choice/", {
        budget: parseInt(budget, 10),
        delivery_address: deliveryAddress,
      });
      Alert.alert("成功", "已為您選擇餐廳並配餐，請查看訂單");
      router.replace(`/order/${response.data.id}`);
    } catch (error) {
      if (error.response) {
        Alert.alert("抱歉", error.response.data.error);
      } else {
        Alert.alert("錯誤", "無法選擇餐廳");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="max-w-md w-full mx-auto space-y-6">
        <Text className="pt-5 text-5xl font-bold text-center text-gray-800">
          隨機選餐
        </Text>
        <View className="flex items-center justify-center">
          <Ionicons name="dice-outline" size={100} color="green" />
        </View>
        <View className="w-full h-20">
          <Text className="text-center text-gray-600 h-full pb-4 mb-4 border-b border-gray-300">
            請輸入您的預算和外送地址{"\n"}
            我們將為您隨機選擇一家餐廳並下單{"\n"}
          </Text>
        </View>

        {submitting ? (
          <View className="flex items-center justify-center p-40">
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
          <View className="space-y-4">
            <TextInput
              className="w-full px-4 mb-3 py-3 rounded-lg border border-gray-300 focus:border-blue-500"
              placeholder="輸入預算"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
            <TextInput
              className="w-full px-4 mb-3 py-3 rounded-lg border border-gray-300 focus:border-blue-500"
              placeholder="輸入外送地址"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
            />
            {error ? (
              <Text className="text-red-500 text-sm mb-2">{error}</Text>
            ) : (
              <Text className="text-red-500 text-sm mb-2">{}</Text>
            )}
            <TouchableOpacity
              className="w-full bg-green-600 py-4 rounded-lg active:bg-green-100"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-bold text-lg">
                開始隨機選餐
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default RandomMeal;
