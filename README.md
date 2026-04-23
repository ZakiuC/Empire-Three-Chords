# Empire の Three Chords

帝国の三和弦。

这是一个用于音乐练习的单页随机抽取器，会在调性、级数、转位、指型四个维度中生成练习目标，并提供主题切换、自动巡航、自定义节奏和词池编辑能力。

当前版本已从单文件页面重构为基于 Vite 的 React + TypeScript + Tailwind 项目，同时保留原有 Nothing 风格视觉和全部核心交互。

## 在线访问

- GitHub Pages: https://zakiuc.github.io/Empire-Three-Chords/

## 功能概览

- 四维随机抽取：调性、级数、转位、指型
- 主面板突出显示主结果，辅助面板同步展示其他维度
- 支持手动随机和 Auto Cruise 自动巡航
- 支持预设节奏与自定义毫秒间隔
- 支持 4 套主题切换：Paper、Studio、OLED、Graphite
- 支持在设置抽屉中实时编辑各维度词池
- 使用 localStorage 持久化主题、词池和巡航节奏
- 保留原始字号自适应、抽屉开关、Escape 关闭等交互细节

## 技术栈

- Vite 5
- React 18
- TypeScript 5
- Tailwind CSS 3
- PostCSS + Autoprefixer
- GitHub Actions + GitHub Pages

## 本地开发

### 环境要求

- Node.js 18 及以上
- npm 9 及以上

### 安装依赖

```powershell
npm install
```

### 启动开发环境

```powershell
npm run dev
```

默认会启动 Vite 开发服务器，通常地址为：

- http://localhost:5173/

### 生产构建

```powershell
npm run build
```

构建输出目录为 `dist/`。

### 本地预览构建结果

```powershell
npm run preview
```

## 可用脚本

```json
{
	"dev": "vite",
	"build": "tsc --noEmit && vite build",
	"preview": "vite preview",
	"lint": "tsc --noEmit"
}
```

- `npm run dev`：启动开发服务器
- `npm run build`：先做 TypeScript 检查，再输出生产构建
- `npm run preview`：本地预览 `dist/` 产物
- `npm run lint`：执行 TypeScript 无输出检查

## 项目结构

```text
.
├─ .github/workflows/deploy.yml
├─ index.html
├─ legacy.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ src
	 ├─ App.tsx
	 ├─ index.css
	 ├─ main.tsx
	 ├─ types.ts
	 ├─ vite-env.d.ts
	 ├─ components
	 │  ├─ ResultValue.tsx
	 │  └─ SegmentBar.tsx
	 └─ lib
			├─ constants.ts
			└─ utils.ts
```

- `index.html`：Vite 应用入口壳
- `legacy.html`：重构前的单文件版本备份
- `src/App.tsx`：主界面与交互逻辑
- `src/index.css`：视觉变量、布局和 Nothing 风格样式
- `src/lib/constants.ts`：初始词池、主题、时间选项、存储 key
- `src/lib/utils.ts`：加载存储、格式化、结果计算等工具函数

## 数据持久化

页面会把配置保存到浏览器 localStorage，当前使用以下 key：

- `empire-three-chords-theme`
- `empire-three-chords-pools`
- `empire-three-chords-timing`

这意味着刷新页面后，主题、词池和自动巡航节奏都会保留。

## GitHub Pages 部署

仓库已配置 GitHub Actions 自动部署流程，定义在 `.github/workflows/deploy.yml`。

部署逻辑如下：

- push 到 `main` 分支时自动触发
- 在 CI 中执行 `npm ci`
- 执行 `npm run build`
- 上传 `dist/` 作为 Pages 部署产物
- 发布到 GitHub Pages

### 首次启用时需要的仓库设置

如果仓库还没有切到 Actions 部署，需要在 GitHub 仓库中手动做一次设置：

1. 打开 `Settings`
2. 进入 `Pages`
3. 将 `Source` 设置为 `GitHub Actions`

完成这一步后，后续每次 push 到 `main` 都会自动发布新版本。

## 关于 `index.html`

当前仓库根目录的 `index.html` 是 Vite 开发入口，不再是过去那个“直接双击即可运行”的完整单文件页面。

如果你要运行当前版本，请使用：

- `npm run dev`
- 或 `npm run build` 后再 `npm run preview`

## 设计说明

项目保留了原版页面的核心设计方向：

- 高对比几何布局
- 单色为主、强调线框和密度节奏
- 大字号主结果与小字号辅助信息并置
- 通过主题预设切换纸白、工作台、纯黑、石墨四种气质

Tailwind 主要承担工程化集成与基础能力，核心视觉仍由手写样式和 CSS 变量控制，以确保原有界面比例、层次和细节不被稀释。