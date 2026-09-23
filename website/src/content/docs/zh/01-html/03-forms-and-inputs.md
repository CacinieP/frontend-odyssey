---
title: '表单与输入'
description: '使用 HTML 表单收集用户数据'
---

网页绝非单纯用来单向阅读的信息载体，它更是一场双向对话。无论是用户登录账号、搜索商品还是提交反馈建议，**HTML 表单 (Forms)** 都是收集用户输入的核心基石。

## `<form>` 容器元素

一切表单交互均始于 `<form>` 标签，它定义了数据应该提交至何处以及采用何种传输协议：

- `action`：接收并处理表单数据的服务器目标 URL。
- `method`：提交数据所使用的 HTTP 请求方法 —— 常用 `GET`（通常用于搜索查询，参数拼接于 URL）或 `POST`（用于包含密码、个人信息或变更状态的敏感数据）。

务必为每一个表单控件关联 `<label>` **标签 (Label)**。这不仅能让屏幕阅读器读出控件用途，还能显著扩大触控屏幕上的点击热区：

```html
<label for="username">用户名</label>
<input type="text" id="username" name="username" required />
```

## 核心输入类型 (`<input>`)

`<input>` 标签具有极强的灵活性，其表现形式和移动端软键盘会依据 `type` 属性智能切换：

- `type="text"`：标准单行纯文本输入框。
- `type="email"`：**邮箱输入 (Email)**，验证必须包含 `@` 及合规域名，在移动设备上会自动唤起带有 `@` 和 `.com` 快捷键的键盘。
- `type="password"`：**密码框 (Password)**，掩码遮蔽输入的字符以保证隐私安全。
- `type="number"`：**数字输入 (Number)**，只允许输入数字，并支持 `min`、`max` 和 `step` 步长约束。
- `type="checkbox"`：**复选框 (Checkbox)**，用于开关状态或多项独立选择。
- `type="radio"`：**单选框 (Radio Button)**，同组选项共享同一个 `name` 属性，实现互斥单选。

## 多行输入与选择控件

当单行输入无法满足需求时，HTML 提供了专用交互组件：

- `<select>` 与 `<option>`：**下拉选择框 (Dropdown Menu)**，供用户在预设选项中挑选一项或多项。
- `<textarea>`：**多行文本域 (Textarea)**，支持自定义 `rows`（行数）和 `cols`（列数）。
- `<button type="submit">`：**提交按钮 (Submit Button)**，触发浏览器内置校验并提交表单数据。（对于仅供 JS 绑定的普通按钮，务必声明 `type="button"` 以免意外触发表单提交）。

## 原生表单验证属性 (Form Validation)

在 JavaScript 代码运行之前，现代浏览器就内置了开箱即用的**客户端验证 (Client-side Validation)** 能力：

- `required`：字段必填，若为空则阻断提交并给出原生提示。
- `minlength` 与 `maxlength`：限制文本字符串的最少与最多字符数。
- `min` 与 `max`：限定数字或日期的上下边界范围。
- `pattern`：使用**正则表达式 (Regular Expression)** 匹配特定格式（如电话号码、邮编）。

## 完整代码示例

下面是一个包含上述各类控件与原生校验的规范注册表单：

```html
<form action="/api/signup" method="POST">
  <fieldset>
    <legend>创建新账号</legend>

    <div>
      <label for="fullname">真实姓名</label>
      <input type="text" id="fullname" name="fullname" required minlength="2" />
    </div>

    <div>
      <label for="email">工作邮箱</label>
      <input type="email" id="email" name="email" required />
    </div>

    <div>
      <label for="experience">开发经验</label>
      <select id="experience" name="experience" required>
        <option value="">-- 请选择级别 --</option>
        <option value="junior">初级开发者 (Junior)</option>
        <option value="mid">中级开发者 (Mid-level)</option>
        <option value="senior">资深开发者 (Senior)</option>
      </select>
    </div>

    <div>
      <label for="bio">个人简介</label>
      <textarea id="bio" name="bio" rows="4" maxlength="200" placeholder="简单介绍一下你自己..."></textarea>
    </div>

    <div>
      <label>
        <input type="checkbox" name="terms" required />
        我已阅读并同意服务条款
      </label>
    </div>

    <button type="submit">立即注册</button>
  </fieldset>
</form>
```

> [!WARNING]
> 客户端验证能够提供即时反馈并大幅改善用户体验，但**绝不能仅依赖客户端验证**。网络请求随时可被伪造或拦截，所有数据必须在服务端进行二次验证与清洗！
