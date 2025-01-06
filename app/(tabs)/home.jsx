import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../global/axios";
import { ProviderCard, SearchInput } from "../../components";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get("customer/providers/");
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProviders();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex items-center justify-center h-full">
          {/* LOGO */}
          <Text className="text-5xl font-semibold text-black pt-5 text-center font-psemibold">
            U-Bird Eats
          </Text>

          {/* Search Input */}
          <View className="w-full px-4 mt-6">
            <SearchInput />
          </View>

          {/* Restaurant List */}
          {!isLoading && (
            <View className="w-full items-center justify-center mt-6">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  id={provider.id}
                  shop_name={provider.shop_name}
                  category={provider.category}
                  image_url={provider.image_url}
                />
              ))}
            </View>
          )}

          {providers.length === 0 && !isLoading && (
            <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
              沒有找到任何餐廳
            </Text>
          )}

          {/* Loader */}
          {isLoading && (
            <View className="container flex justify-center items-center mt-20 pt-20">
              <ActivityIndicator animating={isLoading} color="#000" size="50" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
