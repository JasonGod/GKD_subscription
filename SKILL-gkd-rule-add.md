---
name: gkd-rule-add
description: '为 GKD 订阅项目添加新应用规则。用户提供快照链接和包名后，自动完成规则创建、构建、提交和推送。适用于 GKD 自定义订阅规则维护场景。'
license: MIT
allowed-tools: WebFetch, Glob, Grep, Read, Write, Edit, RunCommand, LS
---

# GKD 规则添加流程

## 概述

为 GKD 订阅项目自动添加新应用规则。用户只需提供快照链接和包名，系统自动完成：
1. 解析快照获取应用信息
2. 创建规则文件
3. 构建订阅
4. 提交并推送更新

## 用户输入格式

用户需提供以下信息：
- **快照链接**: `https://i.gkd.li/i/xxxxxxx`（必填）
- **包名**: 如 `com.example.app`（必填）
- **应用名称**: 如 `示例应用`（可选，从快照推断）
- **Activity**: 如 `com.example.MainActivity`（可选，从快照推断）
- **元素属性**: id/vid/desc/name 等（可选，从快照推断）
- **规则名称**: 如 `开屏广告`、`局部广告-xxx`（可选，根据场景推断）

## 工作流程

### 步骤 1: 解析快照

```bash
# 尝试从快照获取信息
WebFetch https://i.gkd.li/i/xxxxxxx
```

快照页面通常包含：
- 应用包名
- 应用名称
- 当前 Activity
- 元素树结构（id、vid、desc、name、clickable 等）

**注意**: 快照页面可能只返回元数据，若无法获取详细元素信息，需用户提供补充信息。

### 步骤 2: 检查现有规则

```bash
# 搜索是否已存在该应用的规则文件
Glob pattern: "src/apps/${packageName}.ts"
Grep pattern: "${packageName}" path: "src/apps"
```

- 若已存在：追加新规则到现有文件
- 若不存在：创建新规则文件

### 步骤 3: 创建规则文件

**新应用规则模板**:

```typescript
import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: '${packageName}',
  name: '${appName}',
  groups: [
    {
      key: ${groupKey},
      name: '${ruleName}',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: '${activityId}',
          matches: '${selector}',
          snapshotUrls: '${snapshotUrl}',
        },
      ],
    },
  ],
});
```

**规则命名规范**:

| 规则类型 | key | 名称格式 |
|---------|-----|---------|
| 开屏广告 | -1 | `开屏广告` |
| 局部广告 | 0+ | `局部广告-xxx` |
| 全屏广告 | 1+ | `全屏广告-xxx` |
| 分段广告 | 2+ | `分段广告-xxx` |
| 更新提示 | 3+ | `更新提示` |
| 评价提示 | 4+ | `评价提示` |
| 权限提示 | 5+ | `权限提示-xxx` |
| 功能类 | 9+ | `功能类-xxx` |

**选择器编写规范**:

```typescript
// 有 id/vid 时优先使用
matches: '[id="com.example:id/close"]'
matches: '[vid="close_button"]'

// 有 desc/text 时使用文本匹配
matches: '[desc="跳过"][clickable=true]'
matches: '[text*="跳过"][text.length<10]'

// 无明确属性时，使用 name + 层级定位
matches: '@[name="android.view.ViewGroup"][clickable=true] <2 FrameLayout < [id="android:id/content"]'

// 组合条件
matches: 'ImageView[childCount=0] < @ViewGroup[clickable=true] <n [id="android:id/content"]'
```

### 步骤 4: 运行验证和构建

```bash
# 验证规则语法
pnpm run check

# 构建订阅文件
pnpm run build
```

### 步骤 5: 修复 CHANGELOG（保留历史）

```bash
# 构建会重写 CHANGELOG，需手动合并保留历史
NEW_CHANGELOG=$(cat dist/CHANGELOG.md)
ORIGINAL=$(git show origin/main:dist/CHANGELOG.md)
printf "%s\n\n---\n\n%s" "$NEW_CHANGELOG" "$ORIGINAL" > dist/CHANGELOG.md
```

### 步骤 6: 提交并推送

```bash
# 添加所有变更
git add -A

# 提交（使用 conventional commit 格式）
git commit -m "feat: 新增${appName}应用规则

- 添加 ${packageName} 应用${ruleName}规则
- 匹配 Activity: ${activityId}
- 快照: ${snapshotUrl}"

# 切换到 main 分支并合并（如当前在功能分支）
git checkout main
git merge ${currentBranch} --no-edit

# 推送到远程
git push origin main
```

## 元素选择器参考

### 基本属性匹配

| 属性 | 选择器语法 |
|-----|-----------|
| id | `[id="com.example:id/xxx"]` |
| vid | `[vid="xxx"]` |
| text | `[text="xxx"]` 或 `[text*="xxx"]` |
| desc | `[desc="xxx"]` 或 `[desc*="xxx"]` |
| name | `[name="android.view.ViewGroup"]` |
| clickable | `[clickable=true]` |
| childCount | `[childCount=1]` |
| visibleToUser | `[visibleToUser=true]` |

### 层级关系

| 关系 | 语法 |
|-----|-----|
| 父级 | `<` 或 `<n`（n层） |
| 子级 | `>` 或 `>n`（n层） |
| 兄弟 | `+` 或 `+n` |
| 后代 | `<<n` |
| 可点击目标 | `@` 前缀 |

### 常用模式

```typescript
// 点击包含"跳过"文本的元素
'[text*="跳过"][text.length<10][clickable=true]'

// 点击 ImageView 的可点击父级
'ImageView[childCount=0] < @ViewGroup[clickable=true]'

// 点击特定层级的 ViewGroup
'@[name="android.view.ViewGroup"][clickable=true] <2 FrameLayout < [id="android:id/content"]'

// 点击广告旁边的关闭按钮
'[text="广告"] + ImageView[clickable=true]'
```

## 项目结构参考

```
/workspace
├── src/
│   ├── apps/           # 应用规则文件
│   │   ├── com.example.app.ts
│   │   └── ...
│   ├── categories.ts   # 规则分类定义
│   ├── globalGroups.ts # 全局规则组
│   └── subscription.ts # 订阅配置
├── dist/               # 构建产物
│   ├── JasonGod_gkd.json5         # 订阅文件
│   ├── JasonGod_gkd.version.json5 # 版本信息
│   ├── CHANGELOG.md               # 变更记录
│   └── README.md                  # 说明文档
├── scripts/
│   ├── build.ts        # 构建脚本
│   └── check.ts        # 验证脚本
└── version.txt         # 版本号存储
```

## 常见问题处理

### 1. 快照无法获取元素详情

向用户询问：
- Activity 名称
- 目标元素的 id/vid/desc/name
- 元素层级关系（是否可点击、父级结构）

### 2. 规则文件已存在

追加新规则组到现有文件的 `groups` 数组中，确保 key 不重复。

### 3. CHANGELOG 历史丢失

构建脚本会重写 CHANGELOG，需手动合并：
```bash
NEW_CHANGELOG=$(cat dist/CHANGELOG.md)
ORIGINAL=$(git show origin/main:dist/CHANGELOG.md)
printf "%s\n\n---\n\n%s" "$NEW_CHANGELOG" "$ORIGINAL" > dist/CHANGELOG.md
```

### 4. 版本号未递增

确保 `version.txt` 存在且值为当前版本号，构建时会自动递增。

### 5. 推送失败（在功能分支）

```bash
git checkout main
git merge ${featureBranch} --no-edit
git push origin main
```

## 示例对话

**用户**: 
```
https://i.gkd.li/i/28822294
包名：com.phoenix.read
```

**Agent 执行**:
1. WebFetch 快照 → 获取应用信息
2. 检查 `src/apps/com.phoenix.read.ts` → 不存在
3. 创建规则文件（推断为开屏广告或局部广告）
4. `pnpm run check && pnpm run build`
5. 合并 CHANGELOG 历史
6. 提交：`feat: 新增红果免费短剧应用规则`
7. 推送到 origin/main

**输出**:
```
已添加红果免费短剧规则：
- 包名：com.phoenix.read
- 规则：局部广告-播放页插入广告
- 订阅版本：1 → 2
- 推送状态：✅ 已推送到 origin/main

请在 GKD 中刷新订阅检测更新。
```

## 注意事项

1. **规则命名准确性**: 根据实际场景命名，开屏广告用 key=-1，其他广告用 key≥0
2. **选择器精确性**: 避免过于宽泛的匹配，防止误触正常 UI 元素
3. **CHANGELOG 保留**: 每次构建后必须合并历史，否则丢失变更记录
4. **推送确认**: 确保推送到 main 分支，否则 GKD 无法检测更新
5. **版本递增**: 构建会自动递增版本号，GKD 通过版本号检测更新