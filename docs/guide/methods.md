# 表单方法

表单提供了一些方法用于某些需求的实现

| 方法名称         | 说明                     | 参数         | 返回值                                                                     |
| :--------------- | :----------------------- | :----------- | :------------------------------------------------------------------------- |
| submit           | 触发校验                 |              |                                                                            |
| reset            | 重置表单校验摒并清空表单 |              |                                                                            |
| setFormValues    | 设置表单值（表单复现）   | form         |                                                                            |
| setKeyValue      | 设置表单某个key的数据    | (key, value) |                                                                            |
| getFormValues    | 获取表单数据             |              |                                                                            |
| updateSource | 更新数据源              | [{key:String,value:[]}]        |                                                                            |
| updateRequestSource | 更新配置接口的数据源               | [key] ｜ key     |                                                                            |
| getFormRef          | 获取表单实例             |         |返回 form 组件的 ref 实例 |
| getComponentRefByKey          | 获取表单组件实例             | key          |返回该 key 值的  ref 实例  |

::: tip

组件使用的简单数据和接口数据更新建议使用`updateSource`,如果要更新的数据源不需要传入数据，也可以使用`updateRequestSource`触发接口数据源更新

:::

### 示例
:::demo

```vue
<template>
	<label-item>
		<el-button @click="submit">submit</el-button>
		<el-button @click="reset">reset</el-button>
		<el-button @click="setFormValues">setFormValues</el-button>
		<el-button @click="setKeyValue">setKeyValue</el-button>
		<el-button @click="getFormValues">getFormValues</el-button>
		<el-button @click="getFormRef">通过getFormRef获取formRef触发校验</el-button>
		<el-button @click="focus">通过getComponentRefByKey使el-input获取焦点</el-button>
		<el-button @click="updateSource">更新数据源</el-button>
		
	</label-item>

	<fly-el-form
		ref="formRef"
		class="my-edit-form"
		model="form"
		:form-props="formProps"
		:form="originData"
		:show-footer="true"
		enable-spin
	/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const originData: any = ref(null)
import { ElMessage } from 'element-plus'
originData.value = [
	{
		type: 'el-row',
		children: [
			{
				name: 'input框',
				type: 'el-input',
				key: 'input',
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
				name: '选择框',
				type: 'el-select',
				key: 'select',
				required: true,
				requiredType: 'number',
				source: {
					data: [
						{
							label: '选项一',
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

const formRef = ref(null)
const submit = () => {
	formRef.value.submit()
}
const reset = () => {
	formRef.value.reset()
}
const setFormValues = () => {
	formRef.value.setFormValues({
		input: '这是通过方法设置的表单值',
		select: 1,
	})
}
const setKeyValue = () => {
	formRef.value.setKeyValue('input', '这是通过方法设置的表单值')
}
const getFormValues = () => {
	const formValues = formRef.value.getFormValues()
	ElMessage.success(JSON.stringify(formValues))
}
const getFormRef = (key?: string) => {
	const componentRef = formRef.value.getFormRef(key)
	console.log(componentRef)
	componentRef.validate((valid: any, errors: any) => {
		if (valid) {
			ElMessage.success('校验成功')
		}
	})
}
const focus = () => {
	const componentRef = formRef.value.getComponentRefByKey('input')
	componentRef.focus()
}
const updateSource = () => {
	formRef.value.updateSource([{
		key:'select',
		value:[{
			label:'更新后的选项一',
			value:1
		}]
	}])
}
</script>
```

:::


