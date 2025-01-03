import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { CustomButton, FormField } from "../../components";
import axiosInstance from "../../global/axios";
import { useAuth } from "../../context/AuthProvider";


const CustomerSignIn = () => {
  const { login } = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.password === "") {
      Alert.alert("錯誤", "請填寫所有欄位");
    }

    setSubmitting(true);

    try {
      const response = await axiosInstance.post("token/", {
        username: form.username,
        password: form.password,
      });
      await login(response.data);
      Alert.alert("成功", "登入成功");
      router.replace("home");
    } catch (error) {
      Alert.alert("錯誤", "帳號或密碼錯誤！");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-7xl pt-5 text-black font-psemibold text-center">
            U-Bird Eats
          </Text>

          <Text className="text-3xl font-semibold text-black mt-10 font-psemibold">
            會員登入
          </Text>

          <FormField
            title="帳號"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            keyboardType="username"
          />

          <FormField
            title="密碼"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title={isSubmitting ? "登入中..." : "登入"}
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-200 font-pregular">
              你還沒有帳號嗎?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-green-100"
            >
              註冊會員
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerSignIn;
