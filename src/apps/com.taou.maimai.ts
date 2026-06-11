import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.taou.maimai',
  name: '脉脉',
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
          activityIds: 'com.taou.maimai.MainActivity',
          matches:
            '[id="com.taou.maimai:id/close_btn" || vid="close_btn"][visibleToUser=true]',
          snapshotUrls: [
            'https://i.gkd.li/i/28843809',
            'https://i.gkd.li/i/28843663',
            'https://i.gkd.li/i/28843593',
          ],
        },
      ],
    },
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
          snapshotUrls: 'https://i.gkd.li/i/28843593',
        },
      ],
    },
  ],
});
