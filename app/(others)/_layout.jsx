import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const OthersLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="editProfile"
          options={{
            headerShown: true,
            title: "修改個人資料",
          }}
        />
        <Stack.Screen
          name="chatbot"
          options={{
            headerShown: false,
            title: "智能機器人U-Bird",
          }}
        />
        <Stack.Screen
          name="random-meal"
          options={{
            headerShown: true,
            title: "隨機選餐功能",
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </>
  );
};

export default OthersLayout;
