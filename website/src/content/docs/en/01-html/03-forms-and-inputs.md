---
title: 'Forms & Inputs'
description: 'Collecting user data with HTML forms'
---

Websites aren't just documents for reading — they are two-way conversations. Whether you are logging in, searching for a product, or submitting feedback, **HTML forms** are the primary mechanism for collecting user input.

## The `<form>` Element

Every form starts with the `<form>` wrapper, which defines where and how user data is submitted:

- `action`: The target URL or endpoint that processes the submitted data.
- `method`: The HTTP verb to use — typically `GET` (for search queries appended to URL) or `POST` (for sensitive or state-changing data like passwords or payments).

Always associate every input with a `<label>`. This isn't just good design; it is crucial for screen readers and expands the clickable target area for users on touch devices:

```html
<label for="username">Username</label>
<input type="text" id="username" name="username" required />
```

## Essential `<input>` Types

The `<input>` element is remarkably versatile, changing its behavior and mobile keyboard based on the `type` attribute:

- `type="text"`: Standard single-line plain text.
- `type="email"`: Ensures an `@` symbol and valid domain format; opens an email-optimized keyboard on mobile devices.
- `type="password"`: Obscures typed characters for security.
- `type="number"`: Restricts input to numerical digits; allows `min`, `max`, and `step` constraints.
- `type="checkbox"`: A binary toggle (checked/unchecked) for independent options.
- `type="radio"`: Mutually exclusive selections within a group sharing the exact same `name` attribute.

## Multi-line and Selection Controls

When a single line isn't enough, HTML provides dedicated controls:

- `<select>` & `<option>`: Dropdown menus for picking one (or multiple) predefined values.
- `<textarea>`: Multi-line text input with configurable `rows` and `cols`.
- `<button type="submit">`: Triggers form validation and initiates data submission. (Always specify `type="button"` for buttons that shouldn't submit a form!)

## Native Form Validation Attributes

Before JavaScript even runs, modern browsers provide powerful, native client-side validation out of the box:

- `required`: Prevents submission if the field is empty.
- `minlength` & `maxlength`: Restricts string character count.
- `min` & `max`: Constrains numerical values or dates.
- `pattern`: Evaluates input against a custom Regular Expression (RegEx).

## Complete Example

Here is a practical, accessible registration form combining these controls:

```html
<form action="/api/signup" method="POST">
  <fieldset>
    <legend>Create an Account</legend>

    <div>
      <label for="fullname">Full Name</label>
      <input type="text" id="fullname" name="fullname" required minlength="2" />
    </div>

    <div>
      <label for="email">Work Email</label>
      <input type="email" id="email" name="email" required />
    </div>

    <div>
      <label for="experience">Experience Level</label>
      <select id="experience" name="experience" required>
        <option value="">-- Choose level --</option>
        <option value="junior">Junior Developer</option>
        <option value="mid">Mid-level Developer</option>
        <option value="senior">Senior Developer</option>
      </select>
    </div>

    <div>
      <label for="bio">Bio</label>
      <textarea id="bio" name="bio" rows="4" maxlength="200" placeholder="Tell us about yourself..."></textarea>
    </div>

    <div>
      <label>
        <input type="checkbox" name="terms" required />
        I agree to the terms of service
      </label>
    </div>

    <button type="submit">Register</button>
  </fieldset>
</form>
```

> [!WARNING]
> Client-side validation improves user experience by giving instant feedback, but **never trust client validation alone**. Always validate and sanitize all form data on the server!
