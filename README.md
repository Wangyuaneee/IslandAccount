# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
# 岛屿计数器（IslandAccount）

一个基于 React + TypeScript + Vite 的算法可视化小工具，用交互式网格演示在“岛屿数量”问题中的 BFS 与 DFS 搜索过程。支持调整网格、选择算法与速度、查看执行步骤和统计信息，并提供历史保存与算法详情说明。

## 在线地址
- GitHub Pages：`https://wangyuaneee.github.io/IslandAccount/`

## 功能特性
- 交互式网格编辑：点击切换海洋与陆地，支持多种网格尺寸
- 算法控制面板：开始/暂停/重置，BFS/DFS 切换，速度调节
- 实时状态与进度：当前步骤、访问位置、执行进度、岛屿计数
- 执行结果统计：总岛屿数、访问节点数、总步骤、耗时显示
- 算法详情页：系统性介绍 BFS/DFS 的原理、步骤、复杂度与伪代码
- 历史与保存：保存当前网格配置，便于复用与对比

## 技术栈
- `React 18`、`TypeScript`
- `Vite 4`
- `Tailwind CSS 3`
- `Zustand`（状态管理）
- `react-router-dom 6`（路由）
- `lucide-react`（图标）

## 本地运行
1. 安装 Node.js 18 或 20（推荐 20），然后在项目根目录执行：
   - 安装依赖：`npm ci`（或 `npm install`）
   - 开发启动：`npm run dev`
2. 访问：`http://localhost:5173/IslandAccount/`
   - 项目已在路由中设置 `basename="/IslandAccount"`，本地与线上均建议通过子路径访问

## 构建与本地预览（模拟线上路径）
- 构建（GitHub Pages 基础路径）：`npm run build:gh`
- 预览（先构建再预览）：`npm run preview:gh`
- 访问：`http://localhost:4173/IslandAccount/`

常规构建：`npm run build`（不带基础路径）。

## 部署说明（GitHub Pages）
- 已内置工作流：`.github/workflows/deploy.yml`
- 触发方式：推送到 `main` 分支或手动 `workflow_dispatch`
- 关键点：
  - 构建时设置 `--base=/IslandAccount/`，保证静态资源在子路径能正确加载
  - 构建后复制 `404.html`（由 `index.html` 生成）作为单页应用的回退页，解决直接访问子路由的 404 空白问题
  - 部署完成后页面地址为 `https://wangyuaneee.github.io/IslandAccount/`

## 目录结构
```
├─ .github/workflows/deploy.yml     # GitHub Pages 自动部署
├─ public/favicon.svg               # 站点图标
├─ index.html                       # 页面模板（标题与 favicon）
├─ src/
│  ├─ App.tsx                       # 路由入口（basename=/IslandAccount）
│  ├─ pages/
│  │  ├─ Home.tsx                   # 首页（编辑区、控制面板、说明与对比）
│  │  └─ AlgorithmDetails.tsx       # 算法详情页
│  ├─ components/
│  │  ├─ AlgorithmControlPanel.tsx  # 控制面板
│  │  ├─ GridEditor.tsx             # 网格编辑器
│  │  └─ StatusDisplay.tsx          # 状态显示
│  ├─ algorithms/bfs.ts             # BFS 异步可视化实现
│  ├─ algorithms/dfs.ts             # DFS 异步可视化实现
│  ├─ store/islandStore.ts          # Zustand 全局状态与算法驱动
│  ├─ utils/algorithmUtils.ts       # 网格/访问矩阵等工具
│  ├─ main.tsx, index.css, types.ts # 入口与类型
│  └─ vite-env.d.ts
├─ vite.config.ts                   # Vite 配置
├─ tailwind.config.js, postcss.config.js
└─ package.json                     # 脚本与依赖
```

## 使用指南
1. 选择算法与速度
2. 在网格中点击设置陆地或海洋
3. 点击“开始算法”观察 BFS/DFS 的遍历过程
4. 可在执行中暂停、重置，或保存当前网格配置
5. 通过右侧状态区域查看实时步骤与指标
6. 点击导航“算法详情”查看更深入的说明与对比

## 常见问题
- 页面空白或资源 404：请确保通过子路径访问 `.../IslandAccount/`
- 直接访问子路由 404：已提供 `404.html` 作为回退页，刷新后应正常
- 本地 Node 版本过低：依赖要求 Node ≥ 18，建议升级到 18/20
- 部署未生效：在仓库的 `Actions` 和 `Settings → Pages` 检查工作流与发布状态

## 许可证
- 本项目未显式设置许可证。如需开源授权，请补充 `LICENSE` 文件

## 致谢
- 图标：`lucide-react`
- 构建工具：`Vite`
