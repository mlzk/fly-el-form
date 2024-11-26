# 数据源

## 简单数据

简单数据可以通过配置`source``data`进行设置

```js
;[
	{
		key: 'key',
		type: 'el-select',
		name: '名称',
		requiredType: 'number',
		source: {
			data: [
				{
					label: 'Es',
					value: 1,
				},
				{
					label: 'Kibana',
					value: 2,
				},
			],
		},
		// 或者通过组件的props进行设置
		// componentProps: {
		// 	data: [],
		// }
		required: true,
	},
]
```
### 示例
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
		key: 'key',
		type: 'el-select',
		name: '名称',
		requiredType: 'number',
		source: {
			data: [
				{
					label: 'Es',
					value: 1,
				},
				{
					label: 'Kibana',
					value: 2,
				},
			],
		},
		required: true,
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

## 接口数据

通过配置source的`requestFunction`进行设置

| 参数名称         | 类型           | 是否必选 | 说明                                                                                          |
| :--------------- | :------------- | :------- | :-------------------------------------------------------------------------------------------- |
| requestFunction  | async function |          | 获取数据的异步函数                                                                            |
| params           | object         |          | 数据源的 API 接口静态参数                                                                     |
| handle           | function       |          | 数据源的处理函数，第一个参数为接口返回的数据,第二个参数为请求参数，第三个参数是 form          |
| effectKeys       | array          |          | form 中设置为请求参数的 key 集合，作为接口的请求参数参与请求                                  |
| effectKeysHandle | function       |          | effectKeys 参数值的处理函数返回值作为请求方法的参数                                           |
| data             | array          |          | 手动设置的数据源的数据（配合 showName/showValue）requestFunction 的优先级高于 data 设置的数据 |

示例

```js
{
	{
				name: '所属流程',
				type: 'el-select',
				key: 'type',
				required: true,
				requiredType: 'number',
				source: {
					requestFunction: async () => {
						return http.get('/mock/allProcess')
					},
					handle: (res) => {
						return res.data
					},
				},
			},
}

```
### 示例
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
// 模拟接口
const mockApiRequest = async (params) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				data: [
					{
						label: 'Es',
						value: 1,
					},
					{
						label: 'Kibana',
						value: 2,
					},
				],
			})
		})
	})
}
originData.value = [
	{
		name: '所属流程',
		type: 'el-select',
		key: 'type',
		required: true,
		requiredType: 'number',
		source: {
			requestFunction: mockApiRequest,
			handle: (res) => {
				return res.data
			},
		},
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

## 联动数据源

当前组件的数据源受到同表单其他字段值的影响

::: warning

如果在`componentEvents`自定义`on-change`事件,该配置无效请手动使用ref调用`updateSource`方法主动触发数据源更新

:::
示例

```js
[
	{
		name: '产品系列',
		type: 'el-select',
		key: 'product',
		required: true,
		requiredType: 'number',
		effectKeys: ['type'],
		componentProps: {
			clearable: true,
		},
		source: {
			data: [
				{
					label: '类型一',
					value: 1,
				},
				{
					label: '类型二',
					value: 2,
				},
			],
		},
	},
	{
		name: '所属流程',
		type: 'el-select',
		key: 'type',
		required: true,
		requiredType: 'number',
		source: {
			effectKeys: ['product'],
			requestFunction: mockApiRequest,
			handle: (res) => {
				return res.data
			},
		},
	},
]

```
### 示例
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
// 模拟接口
const mockApiRequest = async (params) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let data = []
			let key = params.product
			if (key === 1) {
				data = [
					{
						label: '类型一1',
						value: 1,
					},
					{
						label: '类型一2',
						value: 2,
					},
				]
			} else if (key === 2) {
				data = [
					{
						label: '类型二-1',
						value: 3,
					},
					{
						label: '类型二-2',
						value: 4,
					},
				]
			}
			resolve({
				data,
			})
		})
	})
}
originData.value = [
	{
		name: '产品系列',
		type: 'el-select',
		key: 'product',
		required: true,
		requiredType: 'number',
		effectKeys: ['type'],
		componentProps: {
			clearable: true,
		},
		source: {
			data: [
				{
					label: '类型一',
					value: 1,
				},
				{
					label: '类型二',
					value: 2,
				},
			],
		},
	},
	{
		name: '所属流程',
		type: 'el-select',
		key: 'type',
		required: true,
		requiredType: 'number',
		source: {
			effectKeys: ['product'],
			requestFunction: mockApiRequest,
			handle: (res) => {
				return res.data
			},
		},
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
