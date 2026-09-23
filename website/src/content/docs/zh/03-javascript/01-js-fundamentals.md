---
title: 'JavaScript 基础'
description: '让网页真正鲜活起来'
---

如果说 HTML 是网页的骨架，CSS 是网页的外表与衣着，那么 **JavaScript 就是网页的神经系统和肌肉**。正是它将原本冷冰冰的静态文档，变成了能够响应用户每一次点击、输入和交互的动态现代应用。

在开始前，你需要明白关于 JavaScript 最核心的一个事实：**它是目前所有主流网页浏览器唯一能够原生执行的编程语言**。无论你日常使用的是 TypeScript、CoffeeScript 还是 Dart，最终都必须编译或转译为 JavaScript 才能在浏览器中运行。

接下来，我们将以资深开发者的视角，带你系统掌握每位前端工程师必须夯实的核心基础。

---

## 1. 变量 (Variables)：存储程序数据

在 JavaScript 中，变量是保存数据的容器。早期 JavaScript 只有 `var` 这一个声明关键字；现代 JavaScript (ES6+) 引入了 `let` 和 `const`。

### 为什么在现代开发中坚决弃用 `var`？

```javascript
// var 的核心痛点：函数作用域与变量提升 (Hoisting)
if (true) {
  var role = 'admin';
}
console.log(role); // 输出 'admin' —— 变量泄漏到了代码块外部！

// 重复声明不会报错
var count = 1;
var count = 2; // 静默覆盖，极易引发难以察觉的隐蔽 Bug
```

`var` 不具备`块级作用域 (Block Scope)`，并且具有特殊的`变量提升 (Hoisting)`机制，这极易造成变量污染和混淆。

### 现代声明规范：优先 `const`，需要重新赋值时使用 `let`

```javascript
// 90% 的场景优先使用 const (常量声明，不允许重新绑定)
const maxRetries = 3;
// maxRetries = 4; // 抛出错误 TypeError: Assignment to constant variable.

// 注意：用 const 声明的对象与数组，其内部属性依然是可变的！
const user = { name: 'Alex' };
user.name = 'Taylor'; // 完全合法！const 锁定的是内存引用地址，而非对象内部值

// 只有明确需要重新赋值时，才使用 let
let currentScore = 0;
currentScore += 10; // 合法
```

> **资深开发者建议：** 默认使用 `const`。只有当你明确知道这个值会在后续逻辑中被重新赋值（例如循环计数器或状态切换标识）时，才使用 `let`。在现代项目中永远不要再使用 `var`。

---

## 2. 数据类型 (Data Types)

JavaScript 包含 **7 种原始类型 (Primitive Types)**（按值传递）以及 **1 种引用类型 (Reference Types)**（对象，按引用传递）。

```javascript
// 原始类型 (Primitives)
const username = 'DevOdyssey';     // 字符串 (String)
const age = 25;                    // 数字 (Number，包含整数和浮点数)
const isOnline = true;             // 布尔值 (Boolean)
let unassigned;                    // 未定义 (Undefined，已声明但未赋值)
const emptyValue = null;           // 空值 (Null，明确表示没有任何对象)
const uniqueId = Symbol('id');     // 符号 (Symbol，独一无二的标识符)
const largeNumber = 9007199254740991n; // 大整数 (BigInt，任意精度整数)

// 引用类型 (Reference Types / Objects)
const profile = {
  name: 'Alex',
  skills: ['HTML', 'CSS', 'JavaScript'],
}; // 对象 (Object)

const scores = [95, 88, 100];      // 数组 (Array，特殊对象)

console.log(typeof username);      // 'string'
console.log(typeof age);           // 'number'
console.log(typeof profile);       // 'object'
console.log(Array.isArray(scores)); // true
```

> **踩坑预警：** 执行 `typeof null` 会返回 `'object'`！这是 1995 年 JavaScript 第一版发布时留下的著名历史设计失误，为了保证旧版网页的向后兼容性，该行为一直被保留至今。

---

## 3. 操作符 (Operators)：处理数值与逻辑

### 算术与赋值
```javascript
const sum = 10 + 5;       // 15
const product = 4 * 2;    // 8
const remainder = 10 % 3; // 1 (取模运算)
let balance = 100;
balance += 50;            // 150 (简写语法，等价于 balance = balance + 50)
```

### 严格相等 (`===`) 与宽松相等 (`==`)
在日常代码中，**永远使用全等号 (`===`)**。宽松相等 (`==`) 会在比较时触发隐式的`类型转换 (Type Coercion)`，导致诸多反常识的结果：

```javascript
5 == '5';   // true —— 危险的自动类型转换！
0 == false; // true —— 极易引入逻辑错误！
null == undefined; // true

5 === '5';  // false —— 类型不同即为 false，安全且结果可预测
0 === false; // false
```

### 逻辑运算符
```javascript
const isLoggedIn = true;
const hasPremium = false;

// 逻辑与 (&&)、逻辑或 (||)、逻辑非 (!)
const canWatchMovie = isLoggedIn && hasPremium; // false
const canBrowse = isLoggedIn || hasPremium;     // true
const isGuest = !isLoggedIn;                   // false

// 空值合并操作符 (Nullish Coalescing ??)：仅当值为 null 或 undefined 时生效
const customTimeout = 0;
const timeout = customTimeout ?? 5000; // 0（若用 ||，0 会被视作假值导致错误回退为 5000）
```

---

## 4. 条件控制 (Conditionals)

通过条件分支控制代码的执行路径：

```javascript
const status = 404;

// if / else if / else
if (status === 200) {
  console.log('请求成功');
} else if (status === 404) {
  console.log('页面未找到');
} else {
  console.log('服务器错误');
}

// 三元表达式 (Ternary Operator)：适合行内简短条件赋值
const message = status === 200 ? '一切正常' : '出错了';

// switch 语句：适合匹配固定的离散枚举值
switch (status) {
  case 200:
    console.log('OK');
    break;
  case 401:
  case 403:
    console.log('未授权访问');
    break;
  default:
    console.log('未知状态');
}
```

---

## 5. 循环语句 (Loops)：重复逻辑

```javascript
const tools = ['Git', 'Vite', 'VSCode'];

// 1. 经典 for 循环（需要索引时的标准写法）
for (let i = 0; i < tools.length; i++) {
  console.log(`工具 #${i + 1}: ${tools[i]}`);
}

// 2. for...of 循环（遍历数组与可迭代对象的最优解）
for (const tool of tools) {
  console.log(tool);
}

// 3. while 循环（在条件满足时持续运行）
let countdown = 3;
while (countdown > 0) {
  console.log(countdown);
  countdown--;
}
```

---

## 6. 函数 (Functions)：代码复用的基石

函数是封装可复用业务逻辑的核心单元。JavaScript 提供了三种常见的定义方式：

```javascript
// 1. 函数声明 (Function Declaration) —— 具备提升特性，可在声明前调用
function greet(name = '开发者') {
  return `你好，${name}！`;
}

// 2. 函数表达式 (Function Expression) —— 不具备提升特性
const formatPrice = function (amount) {
  return `¥${amount.toFixed(2)}`;
};

// 3. 箭头函数 (Arrow Function) —— ES6 引入，语法简洁，具有词法 this 绑定
const multiply = (a, b) => a * b;

// 带有多行代码块的箭头函数
const calculateTax = (subtotal, rate) => {
  const tax = subtotal * rate;
  return subtotal + tax;
};

console.log(greet('小明'));       // '你好，小明！'
console.log(formatPrice(19.99));  // '¥19.99'
console.log(multiply(6, 7));      // 42
```

### 如何选型？
- 顶级作用域的通用工具函数，推荐使用`函数声明 (Function Declaration)`，提升可读性。
- 作为回调函数、数组操作方法（如 `.map()`、`.filter()`）以及简短行内逻辑时，优先使用`箭头函数 (Arrow Function)`。

掌握了语法与运行机制之后，接下来让我们深入浏览器运行时，了解如何通过 JavaScript 操控真正的网页元素：`文档对象模型 (DOM)`。
