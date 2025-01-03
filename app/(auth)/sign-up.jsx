import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import { CustomButton, FormField } from "../../components";
import axiosInstance from "../../global/axios";


const CustomerSignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    password2: "",
    real_name: "",
    phone: "",
  });

  const submit = async () => {
    if (
      form.username === "" ||
      form.password === "" ||
      form.real_name === "" ||
      form.phone === ""
    ) {
      Alert.alert("錯誤", "請填寫所有欄位");
      return;
    }
    if (form.password !== form.password2) {
      Alert.alert("錯誤", "兩次密碼輸入不一致");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosInstance.post("customer/", {
        username: form.username,
        password: form.password,
        password2: form.password2,
        real_name: form.real_name,
        phone: form.phone,
      });
      Alert.alert("成功", "註冊成功");
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("錯誤", "帳號已存在！");
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
            會員註冊
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

          <FormField
            title="確認密碼"
            value={form.password2}
            handleChangeText={(e) => setForm({ ...form, password2: e })}
            otherStyles="mt-7"
          />

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
            keyboardType="phone-pad"
          />

          <CustomButton
            title={isSubmitting ? "註冊中..." : "註冊"}
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerSignUp;
