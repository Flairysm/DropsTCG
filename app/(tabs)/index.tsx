import { Text, View } from "react-native";
import {Link} from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#150133',
      }}
    >
      <Text style={{ color: '#ffffff' }}>Hi</Text>
    </View>
  );
}
