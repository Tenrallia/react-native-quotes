import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { Navigation } from "./router";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/about.webp"),
  require("./assets/poloniex.webp"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <Navigation
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    />
  );
}
