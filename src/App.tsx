import React, { useEffect } from "react";
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
      // linking={{
      //   enabled: "auto",
      //   prefixes: [
      //     // Change the scheme to match your app's scheme defined in app.json
      //     "helloworld://",
      //   ],
      // }}
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    />
  );
}
