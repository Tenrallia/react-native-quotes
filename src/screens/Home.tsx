import React from "react";
import { Button, Text } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Добро пожаловать!</Text>
      <Text>Это приложение для отображение котировок.</Text>
      <Text>Спасибо за посещение!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default React.memo(Home);
