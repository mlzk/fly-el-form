# 表单操作

表单的操作按钮可以通过配置或者自定义的方式实现

## Action

`action`控制显示的按钮和顺序,可以按需求新增`key`(结合`actionProps`自定义按钮)

``` js

action: ['submit', 'reset',...]

```

## ActionProps

`actionProps`控制按钮的属性

| 参数名称         | 类型   | 是否必选 | 说明                                                |
| :--------------- | :----- | :------- | :-------------------------------------------------- |
| componentProps  | object |          | 按钮组件的 props 配置，如 'type'、'size'、'icon' 等 |
| componentEvents | object |          | 按钮组件的事件，如 'onClick' 等                    |
| text             | string |          | 按钮的文字                                          |

``` js

{
	
	submit: {
		componentProps: {
			type: 'primary',
			icon: 'search',
		},
		text: '检索',
	},
	reset: {
		componentProps: {
			type: 'default',
			icon: 'refresh',
		},
		text: '重置',
	},
	custom: {
		componentProps: {
			type: 'warning',
			icon: 'edit',
			round: true,
		},
		componentEvents: {
			onClick: () => {
			ElMessage.info('自定义事件')
			},
		},
		text: '自定义',
	},
}

```


### 示例
:::demo

```vue

<template>
	
	<fly-el-form
		ref="formRef"
		class="my-edit-form"
		model="form"
		:form-props="formProps"
		:form="originData"
		:action-props="actionProps"
		:action="action"
		:show-footer="true"
	
	/>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const originData: any = ref(null)
originData.value = [
	{
		type: 'el-row',
		children: [
			{
				name: '任务名称',
				type: 'el-input',
				key: 'taskName',
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
							label: '产品一',
							value: 1,
						},
					],
				},
				colProps: {
					md: 24,
					lg: 24,
				},
			},
		],
	},
]


const action = ref([ 'custom','submit', 'reset'])
const actionProps = ref({
	
	submit: {
		componentProps: {
			type: 'primary',
			icon: 'search',
		},
		text: '检索',
	},
	reset: {
		componentProps: {
			type: 'default',
			icon: 'refresh',
		},
		text: '重置',
	},
	custom: {
		componentProps: {
			type: 'warning',
			icon: 'edit',
			round: true,
		},
		componentEvents: {
			onClick: () => {
			ElMessage.info('自定义事件')
			},
		},
		text: '自定义',
	},
})

const handleSubmit = (form: any) => {
	console.log('handleSubmit')
	console.log(form)
}
const handleReset = () => {
	console.log('handleReset')
}

const formRef = ref(null)

</script>

```

:::

## FooterRowProps

操作按钮的对齐方式依靠`el-row`的`justify`属性实现

### 示例

:::demo

```vue

<template>

	<label-item>
		 <el-radio-group v-model="footerRowProps.justify">
			<el-radio label="start">左对齐</el-radio>
			<el-radio label="end">右对齐</el-radio>
			<el-radio label="center">居中</el-radio>
			<el-radio label="space-around">两端对齐around</el-radio>
			<el-radio label="space-between">两端对齐between</el-radio>
			<el-radio label="space-evenly">两端对齐evenly</el-radio>
     
    </el-radio-group>
		</label-item>
	<fly-el-form
		ref="formRef"
		class="my-edit-form"
		model="form"
		:form-props="formProps"
		:form="originData"
		:show-footer="true"
		:footerRowProps="footerRowProps"
	/>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const originData: any = ref(null)
originData.value = [
	{
		type: 'el-row',
		children: [
			{
				name: '任务名称',
				type: 'el-input',
				key: 'taskName',
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
							label: '产品一',
							value: 1,
						},
					],
				},
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
const footerRowProps = ref({
	gutter:0,
	justify: 'center',
	align: 'middle',
	tag:'div'
})


const formRef = ref(null)

</script>

```

:::

## 自定义表单操作按钮

可以通过`show-footer`设置为`false`，结合需要自行绘制或者其它方式通过`method`实现表单的校验



