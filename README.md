# 用户注册页（register-page）

Web 开发技术 · **Lesson 1 课后作业**

使用 HTML + CSS + JavaScript 实现的响应式用户注册页，纯前端项目、无需后端与构建工具，直接用浏览器打开 `index.html` 即可运行。

## 在线预览

- GitHub 仓库：`<待填写>`
- Vercel 线上地址：`<待填写>`

## 目录结构

```
register-page/
├── index.html          # 页面结构（HTML）
├── css/
│   └── style.css       # 页面样式（CSS）
├── js/
│   └── main.js        # 表单校验与交互（JavaScript）
├── .gitignore
└── README.md
```

## 运行方式

**方式一：直接打开**

双击 `index.html`，或用 VS Code 的 Live Server 插件打开。

**方式二：本地静态服务**

```bash
# 任选其一，在项目根目录执行
npx serve .
# 或
python -m http.server 8080
```

然后浏览器访问 `http://localhost:8080`。

## 功能清单

### HTML

- 语义化标签：`main` / `section` / `header` / `label` / `form`
- 表单控件：文本、邮箱、电话、密码、复选框
- 无障碍：`label for` 关联、`aria-label`、`aria-live` 提示区
- 输入框内置图标（内联 SVG）、原生约束属性（`required` / `minlength` / `maxlength`）

### CSS

- CSS 自定义属性（变量）统一管理配色、圆角、阴影
- Flexbox 居中布局，卡片式设计 + 入场动画
- 输入框 `:focus` / `:hover` / 错误 / 通过四种状态样式
- 密码强度条（4 格），复选框为自定义样式（隐藏原生 input + 伪元素绘制）
- 提交按钮加载态（CSS 动画旋转圈）
- 响应式：`@media` 适配窄屏，并遵循 `prefers-reduced-motion`

### JavaScript

- 各字段独立校验规则，失焦校验、输入中自动消除错误
- 提交前统一校验，自动聚焦并滚动到第一个出错字段
- 密码强度实时计算（长度 + 大小写 + 数字 + 特殊字符）
- 密码显示 / 隐藏切换
- 提交加载态 + 顶部 Toast 成功 / 失败提示

## 校验规则

| 字段 | 规则 |
| --- | --- |
| 用户名 | 4-16 位字母、数字或下划线 |
| 邮箱 | 标准邮箱格式 |
| 手机号 | 11 位中国大陆手机号（`1[3-9]` 开头） |
| 密码 | 至少 8 位，同时包含字母和数字 |
| 确认密码 | 必须与密码一致 |
| 用户协议 | 必须勾选 |

## 说明

本项目为课程演示用前端页面，表单**不提交到真实后端**，提交后由 JavaScript 模拟异步请求并提示注册成功。
