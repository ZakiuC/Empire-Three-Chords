# Empire の Three Chords

帝国の三和弦。

一个用于音乐练习的单页随机抽取器，会在调性、级数、转位、指型四个维度中生成练习目标，并提供主题切换、自动巡航和词池配置。

## 在线访问

- GitHub Pages: https://zakiuc.github.io/Empire-Three-Chords/

## 功能

- 四维随机结果抽取：调性、级数、转位、指型
- 手动随机与自动巡航
- 4 套可切换主题，含亮暗混合方案
- 右侧设置抽屉，可调整主题、巡航节奏和词池内容
- 本地持久化保存主题、节奏和词池配置

## 本地使用

这是一个纯静态页面项目，不需要构建。

直接打开 [index.html](./index.html) 即可运行。

如果你想通过本地服务器访问，也可以在项目目录里使用任意静态服务器，例如：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 部署

当前仓库已发布到 GitHub Pages。

如果后续继续修改页面，只需要提交并推送到 `main` 分支，GitHub Pages 会继续从仓库内容提供站点。