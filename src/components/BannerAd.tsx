import React from "react";
import { Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const IOS_BANNER_AD_UNIT_ID = "ca-app-pub-7143283411955031/5438625984";
const ANDROID_BANNER_AD_UNIT_ID = "ca-app-pub-7143283411955031/9377870999";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === "ios"
  ? IOS_BANNER_AD_UNIT_ID
  : ANDROID_BANNER_AD_UNIT_ID;

const MyBannerAd = () => {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

export default React.memo(MyBannerAd);
