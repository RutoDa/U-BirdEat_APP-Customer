import { View, Text } from "react-native";


const OrderCard = ({ order }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString("zh-TW");
    };
  
    const getStatusText = (status) => {
      switch (status) {
        case 0:
          return "商家製作中";
        case 1:
          return "等待外送中";
        case 2:
          return "外送中";
        case 3:
          return "已送達";
        default:
          return "未知狀態";
      }
    };
  
    return (
      <View className="bg-white p-4 mb-2 rounded-lg shadow mx-2">
        <View className="flex-row justify-between mb-2">
          <Text className="text-lg font-bold">{order.shop_name}</Text>
          <Text className="text-green-600 font-bold">
            NT$ {order.total_price}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">訂單編號: {order.id}</Text>
          <Text className="text-blue-600">{getStatusText(order.status)}</Text>
        </View>
        <Text className="text-gray-500 text-sm mt-1">
          {formatDate(order.created_at)}
        </Text>
        {order.deliver_name && (
          <Text className="text-gray-600 mt-1">外送員: {order.deliver_name}</Text>
        )}
      </View>
    );
  };

export default OrderCard;