# 表单布局

在`mode='form'`时，可以使用`el-row`和`el-col`作为`type`类型进行嵌套排版

>

```js
[
	{
		type: 'el-row',
		children: [
			{
				name: 'name',
				type: 'el-input',
				key: 'key',
				// 通过colProps控制字段所在的el-col所占的宽度
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
				//...
				colProps: {
					md: 12,
					lg: 12,
				},
			},
			{
				//...
				colProps: {
					md: 12,
					lg: 12,
				},
			},
		],
	},
]
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
		type: 'el-row',
		children: [
			{
				name: '产品类型',
				type: 'el-cascader',
				key: 'type',
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
				name: '产品名称',
				type: 'el-input',
				key: 'productName',
				required: true,
				colProps: {
					md: 12,
					lg: 12,
				},
			},
			{
				name: '型号',
				type: 'el-input',
				key: 'model',
				required: true,
				colProps: {
					md: 12,
					lg: 12,
				},
			},
		],
	},
	{
		type: 'el-row',
		children: [
			{
				name: '数量',
				type: 'el-input-number',
				key: 'quantity',
				required: true,
				colProps: {
					md: 12,
					lg: 12,
				},
			},
			{
				name: '单位',
				type: 'el-cascader',
				key: 'unit',
				required: true,
				colProps: {
					md: 12,
					lg: 12,
				},
			},
		],
	},
	{
		type: 'el-row',
		children: [
			{
				name: '单位产品净重（kg）',
				type: 'el-input-number',
				key: 'weight',
				required: true,
				colProps: {
					md: 12,
					lg: 12,
				},
			},
			{
				name: '单位产品毛重（kg）',
				type: 'el-input-number',
				key: 'grossWeight',
				required: true,
				colProps: {
					md: 12,
					lg: 12,
				},
			},
		],
	},
	{
		type: 'el-row',
		children: [
			{
				name: '统计时段',
				type: 'el-date-picker',
				key: 'timePeriod',
				required: true,
				requiredType: 'array',
				componentsProps: {
					type: 'daterange',
					'start-placeholder': '开始时间',
					'end-placeholder': '结束时间',
					valueFormat: 'YYYY-MM-DD',
				},
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
				name: '特殊类型',
				type: 'el-radio-group',
				key: 'lifecycle',
				required: true,
				source: {
					data: [
						{
							label: '类型一',
							value: '0',
						},
						{
							label: '类型二',
							value: '1',
						},
					],
				},
				value: '0',
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
				name: '是否需要运输',
				type: 'el-switch',
				key: 'switch',
				required: false,
				colProps: {
					md: 24,
					lg: 24,
				},
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
