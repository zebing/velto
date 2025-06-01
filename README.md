# Velto

**Velto** 是一个无虚拟 DOM 的现代 Web 框架，专注于性能和开发者体验，适用于构建高效的前端应用。

## ✨ 特性

* **无虚拟 DOM**：直接操作真实 DOM，减少中间抽象层，提升渲染性能。
* **响应式系统**：内置轻量级响应式机制，简洁易用。
* **组件化开发**：支持函数式组件，结构清晰，易于组合。
* **零依赖**：核心库无第三方依赖，体积小巧。
* **TypeScript 支持**：全量使用 TypeScript 编写，类型安全，开发体验良好。

## 📦 安装

```sh [npm]
$ npm create velto@latest
```

```sh [pnpm]
$ pnpm create velto
```

```sh [yarn]
$ yarn create velto
```

```sh [bun]
$ bun create velto
```


## 🚀 快速开始

```ts
import { ref, watch } from '@velto/runtime';

const count = ref(0);

watch(() => count.value, (newVal, oldVal) => {
  console.log(`Count changed: ${oldVal} → ${newVal}`);
});

count.setValue(count.value++);
```



## 📚 文档

详细文档请访问：[veltojs.github.io/docs](https://veltojs.github.io/docs)

## 🧪 示例项目

查看 [examples](https://github.com/zebing/velto/tree/master/examples/velto) 目录，了解如何使用 Velto 构建应用。

## 🛠️ 贡献指南

欢迎贡献代码、提交问题或提供建议。请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件。

---

Velto 致力于提供一个简洁、高效的前端开发体验。如果您有任何问题或建议，欢迎在 [issues](https://github.com/zebing/velto/issues) 中提出。
