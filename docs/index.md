---
layout: home

title: Fly-El-Form
titleTemplate:  element-plus的 JSON To Form 轻量化表单组件。

hero:
  name: "Fly-El-Form"
  text: "轻量化表单组件"
  tagline: "表单结构由配置驱动，把渲染、校验、数据回填、联动请求都收敛到一套配置与统一接口里，适合字段多且存在联动/异步数据源的业务场景。"
		
  image: /logo.svg
	actions:
    - theme: brand
      text: 安装
      link: /guide/install
    - theme: alt
      text: API
      link: /guide/api


---
## Install 安装

```bash
npm install fly-el-form --save
```

### Import 全局引入

```js
// main.js
// ...引入vue和ElementPlus之后 这里需要 全局引入ElementPlus和@element-plus/icons-vue
// 引入组件库
import FlyElForm from "fly-el-form";
import 'fly-el-form/lib/style.css';

Vue.use(FlyElForm);

```
## Usage 使用

配置好form，在模板中使用

```vue 
<template>
	<fly-el-form model="form" :form="originData" />
</template>

```
## Example 示例
:::demo

```vue
<template>
	<fly-el-form
		model="form"
		:form-props="formProps"
		:form="originData"
		@submit="handleSubmit"
	/>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
const originData: any = ref(null)
originData.value = [
	{
		type: 'el-row',
		children: [
			{
				name: '任务名称',
				type: 'el-input',
				key: 'productBrand',
				required: true,
				colProps: {
					md: 24,
					lg: 24,
					sm: 24,
					xs: 24,
				},
			},
		],
	},
	{
		type: 'el-row',
		children: [
			{
				name: '关联产品',
				type: 'el-select',
				key: 'certificationClientName',
				required: true,
				requiredType:'number',
				source: {
					data: [
						{
							label: '产品一',
							value: 1,
						},
					],
				},
				colProps: {
					md: 12,
					lg: 12,
					sm: 24,
					xs: 24,
				},
			},
			{
				name: '型号',
				type: 'el-input',
				componentProps: {
					disabled: true,
				},
				key: 'certificationClientAddress',
				required: false,
				colProps: {
					md: 12,
					lg: 12,
					sm: 24,
					xs: 24,
				},
			},
		],
	},
]

const formProps = ref({
	labelPosition: 'top',
})

const handleSubmit = (form: any) => {
	console.log(form)
}

</script>
```

:::