# 样式定制

本指南介绍如何自定义 UEditor Plus Designer 的样式。

## CSS 类名

UEditor Plus Designer 使用以下 CSS 类名前缀：

- `pb-section` - Section 相关
- `upd-` - 组件相关

## 覆盖默认样式

### 素材面板

```vue
<style>
/* 面板背景 */
.material-panel {
  background: #f9f9f9 !important;
}

/* 分类列表 */
.material-panel .categories {
  background: #ffffff !important;
  border-right: 1px solid #e0e0e0 !important;
}

/* 素材项 */
.material-item {
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
}

.material-item:hover {
  border-color: #42b983 !important;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2) !important;
}
</style>
```

### Section 样式

```vue
<style>
/* Section 默认样式 */
.pb-section {
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

/* Section 激活状态 */
.pb-section-active {
  outline: 2px solid #42b983 !important;
  outline-offset: 2px;
}

/* Section 悬停效果 */
.pb-section:hover {
  outline: 1px dashed #999;
}
</style>
```

### 工具栏

```vue
<style>
/* 工具栏背景 */
.section-tools {
  background: rgba(0, 0, 0, 0.8) !important;
  border-radius: 4px !important;
  padding: 8px !important;
}

/* 工具栏按钮 */
.section-tools button {
  color: #ffffff !important;
  background: transparent !important;
  border: none !important;
  padding: 4px 8px !important;
  cursor: pointer;
}

.section-tools button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}
</style>
```

## 使用 CSS 变量

通过 CSS 变量自定义主题色：

```vue
<template>
  <div class="custom-theme">
    <UEditorPlusDesigner :config="config" />
  </div>
</template>

<style>
.custom-theme {
  /* 主题色 */
  --primary-color: #42b983;
  --hover-color: #33a372;
  
  /* 边框色 */
  --border-color: #e0e0e0;
  
  /* 背景色 */
  --bg-color: #ffffff;
  --panel-bg-color: #f9f9f9;
}

/* 应用变量 */
.custom-theme .pb-section-active {
  outline-color: var(--primary-color) !important;
}

.custom-theme .material-item:hover {
  border-color: var(--primary-color) !important;
}
</style>
```

## 完整主题示例

### 深色主题

```vue
<template>
  <div class="dark-theme">
    <UEditorPlusDesigner :config="config" />
  </div>
</template>

<style>
.dark-theme {
  /* 素材面板 */
  --panel-bg: #1e1e1e;
  --panel-border: #333333;
  --panel-text: #e0e0e0;
  
  /* Section */
  --section-active: #42b983;
  --section-hover: #666666;
  
  /* 工具栏 */
  --toolbar-bg: rgba(30, 30, 30, 0.95);
  --toolbar-text: #ffffff;
}

.dark-theme .material-panel {
  background: var(--panel-bg) !important;
  color: var(--panel-text) !important;
}

.dark-theme .material-panel .categories {
  background: var(--panel-bg) !important;
  border-right-color: var(--panel-border) !important;
}

.dark-theme .material-item {
  background: #2a2a2a !important;
  border-color: var(--panel-border) !important;
  color: var(--panel-text) !important;
}

.dark-theme .material-item:hover {
  border-color: var(--section-active) !important;
}

.dark-theme .pb-section-active {
  outline-color: var(--section-active) !important;
}

.dark-theme .section-tools {
  background: var(--toolbar-bg) !important;
}

.dark-theme .section-tools button {
  color: var(--toolbar-text) !important;
}
</style>
```

### 自定义尺寸

```vue
<style>
/* 编辑器容器 */
.custom-size .designer-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 800px;
}

/* 素材面板宽度 */
.custom-size .material-panel {
  width: 300px !important;
}

/* 素材项大小 */
.custom-size .material-item {
  height: 120px !important;
  font-size: 14px !important;
}

/* 工具栏按钮大小 */
.custom-size .section-tools button {
  padding: 6px 12px !important;
  font-size: 14px !important;
}
</style>
```

## 响应式设计

```vue
<style>
/* 桌面端 */
@media (min-width: 1024px) {
  .material-panel {
    width: 300px !important;
  }
}

/* 平板 */
@media (max-width: 1023px) and (min-width: 768px) {
  .material-panel {
    width: 250px !important;
  }
  
  .material-item {
    height: 100px !important;
  }
}

/* 移动端 */
@media (max-width: 767px) {
  .material-panel {
    position: absolute;
    width: 100% !important;
    height: 50% !important;
    bottom: 0;
    left: 0;
    z-index: 1000;
  }
  
  .section-tools {
    font-size: 12px !important;
  }
  
  .section-tools button {
    padding: 4px 6px !important;
  }
}
</style>
```

## 自定义动画

```vue
<style>
/* Section 插入动画 */
.pb-section {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 工具栏显示动画 */
.section-tools {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 素材项悬停动画 */
.material-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.material-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
```

## Scoped vs Global

### Scoped 样式

只影响当前组件：

```vue
<style scoped>
.material-panel {
  /* 只在当前组件生效 */
}
</style>
```

### Global 样式

影响所有组件：

```vue
<style>
.pb-section {
  /* 全局生效 */
}
</style>
```

### 混合使用

```vue
<style scoped>
/* Scoped 样式 */
.container {
  padding: 20px;
}
</style>

<style>
/* Global 样式 */
.pb-section-active {
  outline-color: #42b983 !important;
}
</style>
```

## CSS Modules

如果使用 CSS Modules：

```vue
<template>
  <div :class="$style.container">
    <UEditorPlusDesigner :config="config" />
  </div>
</template>

<style module>
.container {
  padding: 20px;
  background: #f5f5f5;
}

.container :global(.pb-section-active) {
  outline-color: #42b983 !important;
}
</style>
```

## 最佳实践

### 1. 使用 !important 谨慎

只在必要时使用：

```css
/* ✅ 覆盖第三方库样式 */
.material-panel {
  background: #f9f9f9 !important;
}

/* ❌ 避免过度使用 */
.my-class {
  color: red !important;
  font-size: 14px !important;
}
```

### 2. 保持样式一致

使用CSS变量维护一致性：

```css
:root {
  --primary-color: #42b983;
  --border-radius: 4px;
  --spacing: 8px;
}

.material-item {
  border-radius: var(--border-radius);
  padding: var(--spacing);
}
```

### 3. 考虑性能

避免复杂的选择器：

```css
/* ❌ 避免 */
div.container > ul > li > a:hover {
  color: red;
}

/* ✅ 推荐 */
.nav-link:hover {
  color: red;
}
```

## 相关链接

- [配置选项](./configuration.md)
- [Vue 使用指南](./vue-usage.md)
- [React 使用指南](./react-usage.md)
