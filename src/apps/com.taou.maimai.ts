import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.taou.maimai',
  name: '脉脉',
  groups: [
    {
      key: 0,
      name: '局部广告-通知弹窗',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: 'com.taou.maimai.MainActivity',
          matches:
            '[id="com.taou.maimai:id/close_btn" || vid="close_btn"][visibleToUser=true]',
        },
      ],
    },
    {
      key: 2,
      name: '更新提示',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: 'com.taou.maimai.MainActivity',
          matches:
            '@ImageView[childCount=0][clickable=true][visibleToUser=true] <2 FrameLayout < [id="android:id/content"]',
          snapshotUrls: 'https://i.gkd.li/i/28843663',
        },
      ],
    },
  ],
});
