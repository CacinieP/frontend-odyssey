---
title: '异步编程与模块化'
description: '数据请求与代码组织'
---

运行在浏览器中的 JavaScript 本质上是 **单线程 (Single-threaded)** 的。这意味着它在同一时刻只能执行一个任务。如果网络请求是同步阻塞的，那么在服务器返回响应的几秒钟内，整个网页界面就会彻底卡死：按钮无法点击、动画停止播放，用户只能面对卡顿甚至崩溃的浏览器。

现代 JavaScript 借助`异步编程 (Async)`与`模块化 (Modules)`机制，完美解决了非阻塞耗时任务与代码解耦组织的难题。

---

## 1. 异步编程的演进史

JavaScript 处理耗时操作（如网络请求、定时器、文件读取）均采用非阻塞模型。在语言发展史上，异步处理经历了三个重要阶段：

### 1. 回调函数 (Callback) 与“回调地狱 (Callback Hell)”
```javascript
// 早期写法：层层嵌套的回调函数
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getInvoice(orders[0].id, (err, invoice) => {
      // 形成金字塔式的“回调地狱”，异常捕获和阅读成本极高
    });
  });
});
```

### 2. 期约 (Promise, ES6 / 2015)
`期约 (Promise)` 代表一个当前未知但未来会得出结果的操作对象。它具有三种状态：等待态 (Pending)、已兑现 (Fulfilled) 和已拒绝 (Rejected)：

```javascript
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getInvoice(orders[0].id))
  .then((invoice) => console.log('发票详情:', invoice))
  .catch((err) => console.error('捕获到异常:', err));
```

### 3. `async / await` (ES2017 现代标准)
`async / await` 是建立在 Promise 基础之上的语法糖，它让异步代码具有如同同步代码一般的线性阅读体验，可直接使用 `try / catch` 进行错误处理：

```javascript
async function loadUserInvoice(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const invoice = await getInvoice(orders[0].id);
    return invoice;
  } catch (err) {
    console.error('加载发票失败:', err.message);
  }
}
```

---

## 2. 现代网络请求：Fetch API

现代浏览器内置的 `fetch()` 函数返回一个 Promise，用于发起标准的 HTTP 网络请求。

### 发起 GET 请求
```javascript
async function fetchUserProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    // 务必检查 response.ok 状态（HTTP 状态码处于 200–299 区间）
    if (!response.ok) {
      throw new Error(`HTTP 异常: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}
```

### 发起 POST 请求
```javascript
async function createPost(postData) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`创建文章失败: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
```

---

## 3. ES 模块化 (ES Modules)

早期的网页脚本全部共享同一个全局作用域 (`window`)，极易造成命名冲突。现代规范引入了 **ES 模块 (ES Modules, ESM)**，每个 JavaScript 文件都是一个独立封闭的作用域，必须显式声明导出与导入。

在 HTML 页面中使用原生模块时，需要在 `<script>` 标签中指明 `type="module"`：
```html
<script type="module" src="./main.js"></script>
```

### 命名导出与导入 (Named Export / Import)
当一个文件提供多个独立的辅助工具函数时，推荐使用命名导出：

```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

```javascript
// main.js
import { add, PI } from './math.js';
// 也可以在导入时重命名：
import { subtract as minus } from './math.js';

console.log(add(10, 5)); // 15
```

### 默认导出与导入 (Default Export / Import)
当一个模块主要职责是输出单个类、核心函数或组件时，使用默认导出：

```javascript
// UserService.js
export default class UserService {
  async getUser(id) {
    // ...
  }
}
```

```javascript
// app.js
import UserService from './UserService.js';
const users = new UserService();
```

> **资深开发者建议：** 工具函数库强烈建议优先使用`命名导出 (Named Export)`。这能提供更精准的编辑器自动补全，避免团队命名漂移，并且更有利于现代打包工具进行`摇树优化 (Tree-shaking)`以剔除无用代码。
