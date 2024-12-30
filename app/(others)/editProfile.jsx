import { View, Text, Image, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton, FormField } from "../../components";
import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";
import { icons } from "../../constants";
import axiosInstance from "../../global/axios";

const EditProfile = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    real_name: user?.real_name || "",
    phone: user?.phone || "",
  });

  const submit = async () => {
    if (form.real_name === "" || form.phone === "") {
      Alert.alert("錯誤", "請填寫所有欄位");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosInstance.put("customer/profile/", {
        real_name: form.real_name,
        phone: form.phone,
      });

      if (response.status === 200 && response.data) {
        setUser(response.data);
        Alert.alert("成功", "個人資料修改成功");
        router.back();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("錯誤", "APP出現不明錯誤，請稍後重試!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex justify-center h-full px-8">
          <Text className="text-5xl font-semibold text-black pt-5 text-center font-psemibold">
            個人資料修改
          </Text>

          <FormField
            title="真實姓名"
            value={form.real_name}
            handleChangeText={(e) => setForm({ ...form, real_name: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="手機號碼"
            value={form.phone}
            handleChangeText={(e) => setForm({ ...form, phone: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title={isSubmitting ? "修改中..." : "修改"}
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;
