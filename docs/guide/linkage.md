# 字段控制

## 隐藏字段

通过`hidden`字段控制字段是否显示

```js
	{	
		key: 'input',
		hidden: true,
	}

```

## 联动显示字段

可以通过`visitable`字段判断某个表单的值是否满足条件，控制自身是否显示

| 参数   | 说明                           |
| :----- | :----------------------------- |
| status | 表单状态（create，edit，view） |
| form   | 表单数据`{...}`                |

```js
{
		name: '输入框',
		type: 'el-input',
		key: 'input',
		required: true,
		value: '',
		visitable: (status, form) => {
			// form 为表单数据
			return form.radioGroup === '1'
		},
	}

```

### 示例

:::demo

```vue
<template>
	<p>单选框选择1时显示隐藏的输入框</p>
	<FlyElForm
		model="form"
		:form="originData"
		@submit="handleSubmit"
		@reset="handleReset"
	/>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const originData = ref([
	{
		name: '单选框',
		type: 'el-radio-group',
		required: true,
		key: 'radioGroup',
		source: {
			data: [
				{
					label: '1',
					value: '1',
				},
				{
					label: '2',
					value: '2',
				},
				{
					label: '3',
					value: '3',
				},
			],
		},
	},
	{
		name: '输入框',
		type: 'el-input',
		key: 'input',
		required: true,
		value: '',
		visitable: (status, form) => {
			// form 为表单数据
			return form.radioGroup === '1'
		},
	},
])

const handleSubmit = (form) => {
	console.log('handleSubmit')
	console.log('form', form)
}
const handleReset = () => {
	console.log('handleReset')
}
</script>
```

:::
