import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.phoenix.read',
  name: '红果免费短剧',
  groups: [
    {
      key: -1,
      name: '开屏广告',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: 'com.dragon.read.pages.splash.SplashActivity',
          matches:
            '@[name="android.view.ViewGroup"][clickable=true][childCount=1] <2 FrameLayout < [id="android:id/content"]',
          snapshotUrls: 'https://i.gkd.li/i/28822294',
        },
      ],
    },
  ],
});
