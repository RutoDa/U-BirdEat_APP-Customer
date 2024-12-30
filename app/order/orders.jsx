import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../global/axios";
import { Stack, useRouter } from "expo-router";

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("zh-TW");
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "商家製作中";
      case 1:
        return "等待外送中";
      case 2:
        return "外送中";
      case 3:
        return "已送達";
      default:
        return "未知狀態";
    }
  };

  return (
    <View className="bg-white p-4 mb-2 rounded-lg shadow mx-2">
      <View className="flex-row justify-between mb-2">
        <Text className="text-lg font-bold">{order.shop_name}</Text>
        <Text className="text-green-600 font-bold">
          NT$ {order.total_price}
        </Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-gray-600">訂單編號: {order.id}</Text>
        <Text className="text-blue-600">{getStatusText(order.status)}</Text>
      </View>
      <Text className="text-gray-500 text-sm mt-1">
        {formatDate(order.created_at)}
      </Text>
      {order.deliver_name && (
        <Text className="text-gray-600 mt-1">外送員: {order.deliver_name}</Text>
      )}
    </View>
  );
};

const orders = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setorders] = useState([]);

  useEffect(() => {
    const fetchorders = async () => {
      try {
        const response = await axiosInstance.get("customer/orders/");
        setorders(response.data);
      } catch (error) {
        console.error("Error fetching orders data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchorders();
  }, []);
  return (
    <>
      <Stack.Screen options={{ title: "訂單紀錄" }} />
      <SafeAreaView className="flex-1 bg-gray-300">
        {isLoading ? (
          <ActivityIndicator size="large" className="flex-1" />
        ) : (
          <ScrollView>
            {orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <OrderCard key={order.id} order={order} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default orders;
