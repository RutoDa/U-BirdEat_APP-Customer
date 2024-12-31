import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Loader } from "../../components";
import { useAuth } from "../../context/AuthProvider";

const AuthLayout = () => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </>
  );
};

export default AuthLayout;
