# 🤝 Contributing to Velto

感谢你对 **Velto** 的关注！我们欢迎各种形式的贡献，包括但不限于修复 Bug、添加新功能、改进文档、创建 Issue 等。

---

## 📋 快速指南

### 🧑‍💻 如何参与开发

1. **Fork 本仓库**
2. 创建你的分支：

   ```bash
   git checkout -b feat/my-feature
   ```
3. 提交你的修改：

   ```bash
   git commit -m 'feat: 添加某功能'
   ```
4. 推送到你的分支：

   ```bash
   git push origin feat/my-feature
   ```
5. 发起 Pull Request（PR）

---

## 🧼 代码规范

请确保你的代码遵守以下规范：

* 使用 **TypeScript**
* 使用 `pnpm` 管理依赖
* 保持风格一致（建议使用项目中的 eslint 和 prettier）
* 命名清晰、注释合理
* 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

### 常见提交类型：

* `feat`: 新功能
* `fix`: 修复问题
* `docs`: 修改文档
* `style`: 不影响代码逻辑的改动（如空格、格式化）
* `refactor`: 代码重构（不包括修复或新功能）
* `test`: 添加或修改测试
* `chore`: 其他杂项修改（构建、配置等）

---

## 🐞 如何提交 Issue

在提交 Issue 之前，请确认以下事项：

* 检查 [已有 Issue](https://github.com/zebing/velto/issues) 中是否存在相同问题
* 提供 **复现步骤** 或 **最小可重现代码**
* 指明使用的 Node.js 版本、浏览器环境、Velto 版本等信息

---

## 🧪 本地开发

项目使用 `pnpm` 进行依赖管理，请先安装：

```bash
npm install -g pnpm
```

安装依赖并启动开发环境：

```bash
pnpm install
pnpm dev
```

运行测试：

```bash
pnpm test
```

---

## ❤️ 感谢你的贡献！

无论是修复 bug、添加文档、提出想法还是改进 API，我们都非常感激你花时间帮助 Velto 成长 🙏

---

如果你需要我把 `README.md` 和 `CONTRIBUTING.md` 一起打包导出为 markdown 文件或 GitHub PR 模板，也可以告诉我。
