# 今日拾光

> 收集大家的美好的地方。

一款 PWA 情绪记录 & 手账工具。不是社交，不对话，不回复。每个人留一片碎片，像在黑暗里放一盏灯。

## 功能

- **手账白板** — 照片（最多2张）+ 贴纸 + 文字自由拖拽排版，html2canvas 截图保存，所见即所得
- **拍照转贴纸** — 浏览器端 AI 抠图（@imgly/background-removal），自动白色轮廓描边，存到贴纸库
- **碎片系统** — 抽一片陌生人留下的碎片，心有共鸣就「也留一片」
- **做一件小事** — 80 条预设小事，随机抽取，完成后记录心情
- **时光轴** — 朋友圈式卡片 + 情绪收集罐 + GitHub 风格热力图 + 周报/月报
- **分享卡片** — 5 种样式（拍立得 / 引用卡 / 信纸 / 印章 / 极简）
- **主题切换** — 原色 / 春樱 / 夏海 / 秋枫 / 冬雪
- **PWA** — 可安装到手机桌面，离线可用

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 19 |
| 构建 | Vite 8 + Tailwind CSS v4 |
| 语言 | TypeScript |
| 动画 | Framer Motion |
| 字体 | LXGW WenKai（霞鹜文楷） |
| AI | @imgly/background-removal（浏览器端抠图） |
| 截图 | html2canvas |
| PWA | vite-plugin-pwa |

## 开发

```bash
npm install
npm run dev
# 浏览器打开 http://localhost:5173
```

## 构建

```bash
npm run build
# 产物在 dist/ 目录
```

## 项目结构

```
src/
├── components/
│   ├── BoardEditor.tsx       # 手账白板编辑器
│   ├── FragmentCard.tsx      # 碎片卡片
│   ├── FuguangTimeline.tsx   # 时光轴
│   ├── GlassJar.tsx          # 情绪收集罐
│   ├── MoodHeatmap.tsx       # 情绪热力图
│   ├── MoodReport.tsx        # 周报/月报
│   ├── ShareCard.tsx         # 分享卡片
│   ├── StickerMaker.tsx      # 贴纸制作器（AI抠图）
│   ├── StickerPicker.tsx     # 贴纸库选择器
│   └── SwipeCard.tsx         # 滑动卡片
├── utils/
│   └── memoryUtils.ts        # 数据模型 & 存储
├── App.tsx                   # 主组件
├── index.css                 # 全局样式
└── main.tsx                  # 入口
```

## License

MIT
