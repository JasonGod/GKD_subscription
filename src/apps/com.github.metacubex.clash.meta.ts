import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.github.metacubex.clash.meta',
  name: 'Clash Meta for Android',
  groups: [
    {
      key: 1,
      name: '功能类-代理页面自动点击延迟测试',
      matchTime: 10000,
      actionMaximum: 1,
      rules: [
        {
          fastQuery: true,
          activityIds: 'com.github.kr328.clash.ProxyActivity',
          matches: '[vid="url_test_view"][visibleToUser=true]',
          exampleUrls: 'https://e.gkd.li/490f4572-a1af-4345-8f6e-3b0081929628',
          snapshotUrls: 'https://i.gkd.li/i/20926416',
          excludeSnapshotUrls: 'https://i.gkd.li/i/20926355',
        },
      ],
    },
    {
      key: 2,
      name: '功能类-订阅页面自动刷新',
      matchTime: 10000,
      actionMaximum: 1,
      rules: [
        {
          fastQuery: true,
          activityIds: 'com.github.kr328.clash.ProfilesActivity',
          matches: '[vid="update_view"][desc="新建"]',
          exampleUrls:
            'https://e.gkd.li/57941037/40ece44f-883f-429a-aa0c-17dac15a50e4',
          snapshotUrls: 'https://i.gkd.li/i/28804477',
        },
      ],
    },
  ],
});
