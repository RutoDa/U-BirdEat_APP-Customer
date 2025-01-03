import { View, Text } from "react-native";


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

export default ChatMessage;