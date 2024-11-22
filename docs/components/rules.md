# 字段校验

## 简单校验

默认会根据字段的name字段生成必填提示信息，可以通过`required`字段控制是否必填

::: tip

组件也会根据字段的name自动生成placeholder信息，可以通过`placeholder`字段覆盖默认的占位提示符

:::

::: warning

表单会根据使用的组件类型自动校验数据类型，也可以通过`requiredType`字段覆盖默认的校验数据类型`string`

:::

>

```js
[
	{
		key: 'key',
		type: 'el-input',
		name: '名称',
		placeholder: '这是覆盖默认的占位符',
		required: true,
		requiredType: 'number',
	},
]
```

## 通过rules自定义校验

```js
{
	name: '正整数校验',
	required: true,
	type: 'el-input-number',
	key: 'batchCount',
	componentsProps: {
		min: 1,
	},
	value: 1,
	rules: [{
		required: true,
		message: '请输入正整数',
		trigger: ['change'],
		pattern: /^[1-9]\d*$/,
	},
	],
}

```

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
		name: '自定义校验',
		required: true,
		type: 'el-input-number',
		key: 'batchCount',
		componentsProps: {
			min: 1,
		},
		value: 1,
		rules: [
			{
				required: true,
				message: '请输入正整数',
				trigger: ['change'],
				pattern: /^[1-9]\d*$/,
			},
		],
	},
	{
		name: '手机号',
		required: true,
		type: 'el-input',
		key: 'phone',
		rules: [
			{
				required: true,
				message: '请输入正确的手机号',
				trigger: ['change'],
				pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
			},
		],
	},
]

const formProps = ref({
	inline: true,
	labelPosition: 'top',
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
