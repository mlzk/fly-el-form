# FlyElForm

基于 element-plus 封装的 JSON To Form 轻量化表单组件，常见企业后台或中台场景可以减少大量的重复工作和代码量

## 基础用法

### search模式

表头检索筛选场景

:::demo

```vue
<template>
	<FlyElForm
		model="search"
		:form="originData"
		@submit="handleSubmit"
		@reset="handleReset"
	/>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const originData = ref([
	{
		name: '企业名称',
		type: 'el-input',
		key: 'companyName',
		required: true,
		value: '',
	},
	{
		name: '企业类型',
		type: 'el-select',
		key: 'companyType',
		source: {
			data: [
				{
					label: '选项一',
					value: 1,
				},
				{
					label: '选项二',
					value: 2,
				},
			],
		},
		required: false,
		value: '',
	},
])

const handleSubmit = () => {
	console.log('handleSubmit')
}
const handleReset = () => {
	console.log('handleReset')
}
</script>
```

:::

### 表单模式

配合`el-row`,`el-col`实现表单的排版

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
				name: '收资任务名称',
				type: 'el-input',
				key: 'productBrand',
				required: true,
				colProps: {
					md: 24,
					lg: 24,
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