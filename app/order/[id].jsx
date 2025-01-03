import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../global/axios";


const ProviderDetails = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const loadingAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 450,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: -450,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`customer/order/${id}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
    const intervalId = setInterval(fetchOrder, 3000);
    return () => clearInterval(intervalId);
  }, [id]);

  const getStatusText = (status) => {
    const statusMap = {
      0: { text: "商家製作中", color: "bg-yellow-200 text-black" },
      1: { text: "等待外送中", color: "bg-blue-100 text-white" },
      2: { text: "外送中", color: "bg-purple-100 text-white" },
      3: { text: "已送達", color: "bg-green-100 text-white" },
    };
    return (
      statusMap[status] || {
        text: "未知狀態",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "訂單資訊" }} />
      <SafeAreaView className="flex-1 bg-white">
        {order != null && order.status < 3 && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              backgroundColor: "#3b82f6",
              transform: [
                {
                  translateX: loadingAnim,
                },
              ],
            }}
          />
        )}

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <ScrollView className="flex-1">
            {/* Order Header */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-2xl font-bold">{order.shop_name}</Text>
              <View className="flex-row items-center mt-2">
                <Text
                  className={`px-3 py-1 rounded-full ${
                    getStatusText(order.status).color
                  }`}
                >
                  {getStatusText(order.status).text}
                </Text>
              </View>
              <Text className="text-gray-500 mt-1">
                訂單編號：#{order.id.toString().padStart(6, "0")}
              </Text>
              <Text className="text-gray-500 mt-2">
                下單時間: {new Date(order.created_at).toLocaleString()}
              </Text>
            </View>

            {/* Products List */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold mb-4">訂購項目</Text>
              {order.products.map((product, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg"
                >
                  <View>
                    <Text className="font-medium">{product.name}</Text>
                    <Text className="text-gray-500">x{product.count}</Text>
                  </View>
                  <Text className="font-semibold">
                    NT$ {product.price * product.count}
                  </Text>
                </View>
              ))}
            </View>

            {/* Delivery Info */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold mb-2">外送資訊</Text>
              <Text className="text-gray-700">
                外送員：{order.deliver_name || "尚未指派"}
              </Text>
              {order.memo && (
                <View className="mt-3">
                  <Text className="font-bold">備註</Text>
                  <Text className="text-gray-700 mt-1">{order.memo}</Text>
                </View>
              )}
            </View>

            {/* Total Price */}
            <View className="p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">總金額</Text>
                <Text className="text-xl font-bold text-blue-600">
                  NT$ {order.total_price}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default ProviderDetails;
