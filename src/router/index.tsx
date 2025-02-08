import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import images from "assets";
import { Home, Quotes } from "screens";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "О приложении",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={images.about}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Updates: {
      screen: Quotes,
      options: {
        title: "Котировки",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={images.poloniex}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    // Profile: {
    //   screen: Profile,
    //   // linking: {
    //   //   path: ":user(@[a-zA-Z0-9-_]+)",
    //   //   parse: {
    //   //     user: (value) => value.replace(/^@/, ""),
    //   //   },
    //   //   stringify: {
    //   //     user: (value) => `@${value}`,
    //   //   },
    //   // },
    // },
    // Settings: {
    //   screen: Settings,
    //   options: ({ navigation }) => ({
    //     presentation: "modal",
    //     headerRight: () => (
    //       <HeaderButton onPress={navigation.goBack}>
    //         <Text>Close</Text>
    //       </HeaderButton>
    //     ),
    //   }),
    // },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
