---
layout: home

title: Fly-El-Form
titleTemplate: 基于 element-plus的 JSON To Form 轻量化表单组件。

hero:
  name: "Fly-El-Form"
  text: "基于 element-plus"
  tagline: " JSON To Form 轻量化表单组件，常见企业后台或中台场景可以减少大量的重复工作和代码量"

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

### 全局引入

```js
// main.js
// ...引入vue和ElementPlus之后
// 引入组件库
import FlyElForm from "fly-el-form";
Vue.use(FlyElForm);

```
## Usage 使用

:::demo

```vue
<template>
	<fly-el-form
		class="my-edit-form"
		model="form"
		:form-props="formProps"
		:form="originData"
		:action-props="actionProps"
		:show-footer="true"
		enable-spin
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
							label: 'Es',
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
				componentsProps: {
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
	inline: true,
	labelPosition: 'top',
})
const actionProps = ref({
	submit: {
		componentsProps: {
			type: 'primary',
			icon: 'search',
		},
		text: '检索',
	},
	reset: {
		componentsProps: {
			type: 'default',
			icon: 'refresh',
		},
		text: '重置',
	},
})

const handleSubmit = (form: any) => {
	console.log('handleSubmit')
	console.log(form)
}
const handleReset = () => {
	console.log('handleReset')
}
</script>
```

:::