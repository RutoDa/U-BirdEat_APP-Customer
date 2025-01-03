import {
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../global/axios";
import { Stack, useRouter } from "expo-router";
import { OrderCard } from "../../components";


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
