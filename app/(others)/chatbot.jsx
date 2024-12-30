import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../global/axios";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <View
      className={`flex flex-row ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 mx-3`}
    >
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-green mr-2 justify-center items-center">
          <Text className="text-white font-bold">U</Text>
        </View>
      )}
      <View
        className={`rounded-3xl px-4 py-3 max-w-[75%] shadow-sm ${
          isUser ? "bg-green-700" : "bg-gray-300"
        }`}
        style={{
          elevation: 2,
        }}
      >
        <Text
          className={`${
            isUser ? "text-white" : "text-gray-800"
          } text-base leading-6`}
        >
          {message.content}
        </Text>
        <Text
          className={`text-[10px] mt-1 ${
            isUser ? "text-blue-200" : "text-gray-500"
          }`}
        >
          {new Date(message.created_at).toLocaleString("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const loadChatHistory = async () => {
    try {
      const response = await axiosInstance.get("customer/chatbot/");
      setMessages(response.data.history);
    } catch (error) {
      console.error("Error loading chat history:", error);
      Alert.alert("錯誤", "無法載入聊天紀錄");
    }
  };

  const clearChat = async () => {
    try {
      await axiosInstance.delete("customer/chatbot/");
      setMessages([]);
      Alert.alert("成功", "聊天紀錄已清除");
    } catch (error) {
      console.error("Error clearing chat:", error);
      Alert.alert("錯誤", "無法清除聊天紀錄");
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      },
    ]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("customer/chatbot/", {
        prompt: userMessage,
      });

      await loadChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("錯誤", "無法發送訊息");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white">
        <View className="py-2 px-3 border-b border-gray-200 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-1.5 mr-2"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="w-8 h-8 rounded-full bg-green justify-center items-center mr-2">
              <Text className="text-white font-bold">U</Text>
            </View>
            <Text className="text-base font-semibold">U-Bird 智能助手</Text>
          </View>
          <TouchableOpacity onPress={clearChat} className="p-1.5">
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 pt-4"
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <View className="flex-row items-center p-4 mx-3">
            <View className="w-8 h-8 rounded-full bg-green mr-2 justify-center items-center">
              <Text className="text-white font-bold">U</Text>
            </View>
            <View className="bg-gray-100 rounded-3xl px-4 py-3 shadow-sm">
              <View className="flex-row items-center space-x-1">
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="border-t border-gray-200 bg-white"
      >
        <View className="flex-row items-center p-2">
          <TextInput
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 mr-2 bg-gray-50"
            placeholder="輸入訊息..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isLoading || !inputText.trim()}
            className={`rounded-full p-3 ${
              isLoading || !inputText.trim() ? "bg-gray-300" : "bg-green-700"
            }`}
          >
            <Ionicons
              name="send"
              size={24}
              color={isLoading || !inputText.trim() ? "#666" : "white"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBot;
