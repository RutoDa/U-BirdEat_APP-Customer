import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import axiosInstance from "../../global/axios";
import { FormField, CustomButton } from "../../components";

const ProviderDetails = () => {
  const { id } = useLocalSearchParams();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [form, setForm] = useState({
    delivery_address: "",
    memo: "",
  });

  const handleQuantityChange = (id, value) => {
    value = parseInt(value);
    if (isNaN(value) || value < 0) value = 0;
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmission = async () => {
    const order = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([product_id, quantity]) => ({
        id: product_id,
        count: quantity,
      }));

    if (order.length === 0) {
      Alert.alert("請選擇至少一項商品");
      return;
    }
    if (form.delivery_address.trim() === "") {
      Alert.alert("請填寫送餐地址");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("customer/order/", {
        products: order,
        order_detail: {
          provider: id,
          delivery_address: form.delivery_address,
          memo: form.memo,
        },
      });

      if (response.status == 201) {
        Alert.alert("訂單送出成功", "您的訂單已送出，請等待餐廳備餐");
        router.replace(`/order/${response.data.id}`);
      } else {
        Alert.alert("發生錯誤", "訂單送出失敗，請稍後再試");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      Alert.alert("發生錯誤", "訂單送出失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axiosInstance.get(`customer/providers/${id}/`);
        setProvider(response.data);
      } catch (error) {
        console.error("Error fetching provider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "訂餐",
        }}
      />
      <SafeAreaView className="flex-1 bg-white">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <ScrollView>
            <View className="flex-1 justify-center items-center">
              {/* Image Container */}
              <View className="w-11/12 h-[200px] bg-gray-100 items-center">
                <Image
                  source={{ uri: provider.provider.image_url }}
                  className="w-full h-[200px] rounded-t-xl"
                  resizeMode="cover"
                />
              </View>

              {/* Content Container */}
              <View className="p-4 items-center">
                <Text className="text-3xl font-bold text-gray-800 text-center">
                  {provider.provider.shop_name}
                </Text>
                <View className="mt-2 flex-row items-center justify-center">
                  <Text className="text-blue-600 bg-blue-50 px-4 py-1 rounded-full text-center">
                    {provider.provider.category}
                  </Text>
                </View>
                {/* Products List */}
                <View className="px-4 w-full items-center">
                  {provider.products.map((product) => {
                    return (
                      <View
                        key={product.id}
                        className="flex-row justify-between items-center w-full p-4 mt-4 border-2 border-gray-400 rounded-xl bg-white"
                      >
                        <Text className="text-center text-blue-600 font-semibold px-3 py-1 rounded-full bg-red-50">
                          NT$ {product.price}
                        </Text>
                        <Text className="text-xl font-bold text-gray-800 flex-1 text-center">
                          {product.name}
                        </Text>

                        <View className="flex-row items-center justify-center">
                          <TouchableOpacity
                            className="border border-gray-300 rounded-md w-6 h-12 mr-2 flex items-center justify-center"
                            onPress={() =>
                              handleQuantityChange(
                                product.id,
                                (quantities[product.id] || 0) - 1
                              )
                            }
                          >
                            <Text className="text-gray-600">-</Text>
                          </TouchableOpacity>

                          <Text
                            className="w-12 h-12 border border-gray-300 rounded-md text-center flex items-center justify-center text-2xl"
                            style={{
                              lineHeight: 36,
                            }}
                          >
                            {quantities[product.id] || "0"}
                          </Text>

                          <TouchableOpacity
                            onPress={() =>
                              handleQuantityChange(
                                product.id,
                                (quantities[product.id] || 0) + 1
                              )
                            }
                            className="border border-gray-300 rounded-md w-6 h-12 ml-2 flex items-center justify-center"
                          >
                            <Text className="text-gray-600">+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                  {/* Delivery Address */}
                  <FormField
                    title="送餐地址"
                    value={form.delivery_address}
                    handleChangeText={(e) =>
                      setForm({ ...form, delivery_address: e })
                    }
                    otherStyles="mt-7 bg-"
                  />

                  {/* Memo */}
                  <FormField
                    title="備註"
                    value={form.memo}
                    handleChangeText={(e) => setForm({ ...form, memo: e })}
                    otherStyles="mt-7"
                  />
                </View>
              </View>
              <View className="w-11/12 flex justify-center items-center p-4 mb-4">
                {/* Order Button */}
                <CustomButton
                  title={isSubmitting ? "送出中..." : "送出訂單"}
                  handlePress={handleSubmission}
                  containerStyles="mt-7 w-full"
                  isLoading={isSubmitting}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default ProviderDetails;
