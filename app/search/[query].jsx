import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../global/axios";
import { ProviderCard, SearchInput } from "../../components";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';


const Search = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const { query } = useLocalSearchParams();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get("customer/providers?search="+query);
        setProviders(response.data);
      } catch (error) {
        console.error("Error fetching providers data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex items-center justify-center h-full">
          {/* LOGO */}
          <Text className="text-5xl font-semibold text-black pt-5 text-center font-psemibold">
            U-Bird Eats
          </Text>

          {/* Search Input */}
          <View className="w-full px-4 mt-6">
            <SearchInput initialQuery={query} />
          </View>

          {/* Search Result */}
          {query && (
            <View className="w-full px-6 mt-4">
            <Text className="text-black font-pregular">
              搜尋結果: {query}
            </Text>
          </View>
          )}

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

          {/* No Result */}
          {!isLoading && providers.length === 0 && (
            <View className="w-full items-center justify-center mt-6">
              <MaterialIcons name="error-outline" size={50} color="black" />
              <Text className="text-black font-pregular">
                找不到符合條件的餐廳
              </Text>
            </View>
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

export default Search;
