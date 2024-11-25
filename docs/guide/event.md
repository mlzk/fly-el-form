# 表单事件

| 事件名称 | 说明         | 回调参数 |
| :------- | :----------- | :------- |
| submit   | 表单提交事件 | formData |
| reset    | 表单重置事件 |          |


## submit

表单触发提交时的回调函数，参数为表单数据对象和表单校验结果


```js
[
	{
		valid: true,
		formValues: {...},
	},
]
```

## reset

表单触发重置时的回调函数，无参数

### 示例
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
		name: 'formItemName',
		type: 'el-input',
		key: 'formItemName',
		required: true,
		value: '',
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