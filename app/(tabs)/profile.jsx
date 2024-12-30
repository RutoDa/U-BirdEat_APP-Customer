import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { icons } from "../../constants";
import { EmptyState, InfoBox, VideoCard } from "../../components";
import { useAuth } from "../../context/AuthProvider";
import { CustomButton } from "../../components";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    Alert.alert("成功", "登出成功");
    router.replace("/");
  };

  return (
    <SafeAreaView className="h-full bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center justify-center min-h-full px-4">
          {/* Profile Header */}
          <View className="flex items-center justify-center mt-8 w-full">
            <View className="shadow-xl bg-white rounded-full p-2 border-2 border-blue-100">
              <Image
                source={icons.profile}
                className="w-36 h-36 rounded-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mt-6">
              {user.real_name}
            </Text>
            <View className="flex-row items-center mt-3 bg-blue-50 px-4 py-2 rounded-full">
              <Ionicons name="call-outline" size={18} color="#3b82f6" />
              <Text className="text-blue-600 ml-2 font-medium">
                {user.phone}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="w-full h-[1px] bg-gray-200 my-8" />

          {/* Actions Section */}
          <View className="w-full px-4 space-y-4">
            <CustomButton
              title="修改個人資料"
              handlePress={() => router.push("editProfile")}
              containerStyles="mb-4"
              buttonStyles=""
              textStyles="text-white font-bold text-lg"
              leftIcon={
                <Ionicons name="person-outline" size={22} color="white" />
              }
            />

            <CustomButton
              title="查看訂單紀錄"
              handlePress={() => router.push("order/orders")}
              containerStyles="mb-4"
              buttonStyles=""
              textStyles="text-white font-bold text-lg"
              leftIcon={
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="white"
                />
              }
            />

            <CustomButton
              title="登出平台會員"
              handlePress={handleLogout}
              containerStyles="mb-4"
              buttonStyles=""
              textStyles="text-white font-bold text-lg"
              leftIcon={
                <Ionicons name="log-out-outline" size={22} color="white" />
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
