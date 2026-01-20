# 自定义素材加载器

本指南详细介绍如何实现自定义素材加载器，对接您的后端 API。

## 概述

UEditor Plus Designer 提供两个加载器接口：

- **categoryLoader**: 加载素材分类
- **styleLoader**: 加载素材列表

## 分类加载器

### 接口定义

```typescript
type CategoryLoader = () => Promise<MaterialCategory[]>

interface MaterialCategory {
  id: number | string        // 分类ID
  title: string              // 分类名称
  pid?: number | string      // 父分类ID（可选）
  sort?: number              // 排序（可选）
  _child?: MaterialCategory[] // 子分类（可选）
}
```

### 基础实现

```typescript
const categoryLoader = async (): Promise<MaterialCategory[]> => {
  try {
    const response = await fetch('/api/categories')
    const data = await response.json()
    
    return data.map(item => ({
      id: item.id,
      title: item.name,
      pid: item.parentId,
      sort: item.order
    }))
  } catch (error) {
    console.error('Load categories failed:', error)
    return []
  }
}

const config = {
  categoryLoader
}
```

### 树形结构

如果您的 API 返回扁平数据，需要转换为树形结构：

```typescript
const categoryLoader = async (): Promise<MaterialCategory[]> => {
  const response = await fetch('/api/categories')
  const flatData = await response.json()
  
  // 构建树形结构
  const buildTree = (
    items: any[],
    parentId: number | null = null
  ): MaterialCategory[] => {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        id: item.id,
        title: item.name,
        pid: item.parentId,
        sort: item.order,
        _child: buildTree(items, item.id)
      }))
  }
  
  return buildTree(flatData)
}
```

## 素材加载器

### 接口定义

```typescript
type StyleLoader = (params?: MaterialQueryParams) => Promise<StyleListData>

interface MaterialQueryParams {
  categoryId?: number | string
  keywords?: string
  page?: number
  pageSize?: number
}

interface StyleListData {
  records: MaterialItem[]
  total: number
  page: number
  pageSize: number
}

interface MaterialItem {
  id: number | string
  title: string
  html: string
  categoryId?: number | string
  cover?: string
  [key: string]: any
}
```

### 基础实现

```typescript
const styleLoader = async (
  params?: MaterialQueryParams
): Promise<StyleListData> => {
  try {
    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: params?.categoryId,
        keyword: params?.keywords,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20
      })
    })
    
    const data = await response.json()
    
    return {
      records: data.items.map(item => ({
        id: item.id,
        title: item.name,
        html: item.content,
        categoryId: item.categoryId,
        cover: item.thumbnail
      })),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize
    }
  } catch (error) {
    console.error('Load materials failed:', error)
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: 20
    }
  }
}

const config = {
  styleLoader
}
```

## 完整示例

### Vue 3

```vue
<template>
  <UEditorPlusDesigner
    ref="designerRef"
    :config="config"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UEditorPlusDesigner } from 'ueditor-plus-designer'
import type {
  DesignerConfig,
  MaterialCategory,
  MaterialQueryParams,
  StyleListData
} from 'ueditor-plus-designer'

const designerRef = ref(null)

// 分类加载器
const categoryLoader = async (): Promise<MaterialCategory[]> => {
  try {
    const response = await fetch('/api/categories', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.map((item: any) => ({
      id: item.id,
      title: item.name,
      pid: item.parentId,
      sort: item.order,
      _child: item.children?.map((child: any) => ({
        id: child.id,
        title: child.name,
        pid: item.id
      }))
    }))
  } catch (error) {
    console.error('Load categories failed:', error)
    // 显示错误提示
    showError('加载分类失败')
    return []
  }
}

// 素材加载器
const styleLoader = async (
  params?: MaterialQueryParams
): Promise<StyleListData> => {
  try {
    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        categoryId: params?.categoryId,
        keyword: params?.keywords,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      records: data.items.map((item: any) => ({
        id: item.id,
        title: item.name,
        html: item.content,
        categoryId: item.categoryId,
        cover: item.thumbnail,
        // 可以添加自定义字段
        author: item.author,
        createTime: item.createTime
      })),
      total: data.total,
      page: data.page || params?.page || 1,
      pageSize: data.pageSize || params?.pageSize || 20
    }
  } catch (error) {
    console.error('Load materials failed:', error)
    showError('加载素材失败')
    return {
      records: [],
      total: 0,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20
    }
  }
}

const config: DesignerConfig = {
  ueditorPath: '/ueditor-plus',
  categoryLoader,
  styleLoader
}

// 辅助函数
function getToken(): string {
  return localStorage.getItem('token') || ''
}

function showError(message: string): void {
  // 显示错误提示
  console.error(message)
}
</script>
```

### React

```tsx
import React, { useRef } from 'react'
import { UEditorPlusDesigner } from './components/UEditorPlusDesigner'
import type {
  DesignerConfig,
  MaterialCategory,
  MaterialQueryParams,
  StyleListData
} from './components/UEditorPlusDesigner'

function App() {
  const designerRef = useRef(null)

  // 分类加载器
  const categoryLoader = async (): Promise<MaterialCategory[]> => {
    try {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      return data.map((item: any) => ({
        id: item.id,
        title: item.name,
        pid: item.parentId,
        sort: item.order
      }))
    } catch (error) {
      console.error('Load categories failed:', error)
      return []
    }
  }

  // 素材加载器
  const styleLoader = async (
    params?: MaterialQueryParams
  ): Promise<StyleListData> => {
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        records: data.items.map((item: any) => ({
          id: item.id,
          title: item.name,
          html: item.content,
          categoryId: item.categoryId,
          cover: item.thumbnail
        })),
        total: data.total,
        page: data.page || 1,
        pageSize: data.pageSize || 20
      }
    } catch (error) {
      console.error('Load materials failed:', error)
      return {
        records: [],
        total: 0,
        page: 1,
        pageSize: 20
      }
    }
  }

  const config: DesignerConfig = {
    ueditorPath: '/ueditor-plus',
    categoryLoader,
    styleLoader
  }

  function getToken(): string {
    return localStorage.getItem('token') || ''
  }

  return (
    <UEditorPlusDesigner
      ref={designerRef}
      config={config}
    />
  )
}

export default App
```

## 高级功能

### 请求缓存

避免重复请求：

```typescript
// 分类缓存
let categoryCache: MaterialCategory[] | null = null

const categoryLoader = async (): Promise<MaterialCategory[]> => {
  if (categoryCache) {
    return categoryCache
  }
  
  const response = await fetch('/api/categories')
  const data = await response.json()
  
  categoryCache = data
  return data
}
```

### 请求取消

使用 AbortController 取消请求：

```typescript
let controller: AbortController | null = null

const styleLoader = async (
  params?: MaterialQueryParams
): Promise<StyleListData> => {
  // 取消之前的请求
  if (controller) {
    controller.abort()
  }
  
  controller = new AbortController()
  
  try {
    const response = await fetch('/api/materials', {
      method: 'POST',
      body: JSON.stringify(params),
      signal: controller.signal
    })
    
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled')
    }
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: 20
    }
  }
}
```

### 加载状态

显示加载指示器：

```typescript
const styleLoader = async (
  params?: MaterialQueryParams
): Promise<StyleListData> => {
  // 显示加载
  showLoading()
  
  try {
    const response = await fetch('/api/materials')
    const data = await response.json()
    return data
  } catch (error) {
    showError('加载失败')
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: 20
    }
  } finally {
    // 隐藏加载
    hideLoading()
  }
}
```

### 重试机制

自动重试失败的请求：

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return response
      }
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      if (i === retries - 1) throw error
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries reached')
}

const styleLoader = async (
  params?: MaterialQueryParams
): Promise<StyleListData> => {
  try {
    const response = await fetchWithRetry('/api/materials', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return await response.json()
  } catch (error) {
    console.error('Load failed after retries:', error)
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: 20
    }
  }
}
```

## API 设计建议

### 分类 API

```
GET /api/categories

Response:
[
  {
    "id": 1,
    "name": "通用模板",
    "parentId": null,
    "order": 1,
    "children": [
      {
        "id": 11,
        "name": "标题",
        "parentId": 1,
        "order": 1
      }
    ]
  }
]
```

### 素材 API

```
POST /api/materials

Request:
{
  "categoryId": 11,
  "keyword": "标题",
  "page": 1,
  "pageSize": 20
}

Response:
{
  "items": [
    {
      "id": 101,
      "name": "标题模板1",
      "content": "<div class=\"pb-section\">...</div>",
      "categoryId": 11,
      "thumbnail": "https://example.com/thumb.jpg",
      "author": "John",
      "createTime": "2024-01-01"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

## 相关链接

- [配置选项](./configuration.md)
- [API 参考](../api/overview.md)
- [素材类型](../api/material-types.md)
