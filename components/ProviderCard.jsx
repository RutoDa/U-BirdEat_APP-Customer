import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


const ProviderCard = ({ id, shop_name, category, image_url }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/provider/${id}`)}
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden w-11/12"
    >
      <Image
        source={{ uri: image_url }}
        className="w-full h-48 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800">{shop_name}</Text>
        <View className="flex-row items-center mt-2">
          <Text className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProviderCard;
