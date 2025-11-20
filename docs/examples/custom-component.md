## 获取组件的 ref实例

### 增量更新

通过选择框的 onChange 事件更新form结构
::: warning
 注意：请在控制台查看；获取组件实例需要在组件渲染完成后调用，否则会返回 null。
:::
:::demo

```vue
<template>
	<div class="update-demo">
		<div class="demo-buttons" style="margin-bottom: 20px;">
			<el-button @click="getFormRef">获取form组件实例</el-button>
			<el-button @click="getComponentRef('city')">获取城市选择框组件实例</el-button>
		</div>
		<fly-el-form
			ref="form"
			:form="formConfig"
			:key="formConfigKey"
			@submit="handleSubmit"
		/>
	</div>
</template>

<script>
export default {
	name: 'UpdateBasicDemo',
	data() {
		return {
			changeFlag: true,
			formConfig: [
				{
					type: 'demo-component',
					key: 'demo-component',
				},
				{
					name: '姓名',
					type: 'el-input',
					key: 'name',
					value: '',
				},
				{
					name: '城市',
					type: 'el-select',
					key: 'city',
					source: {
						data: [
							{ value: 'beijing', label: '北京' },
							{ value: 'shanghai', label: '上海' },
							{ value: 'guangzhou', label: '广州' },
						],
					},
				},
				{
					name: '年龄',
					type: 'el-input-number',
					required: true,
					requiredType:'number',
					key: 'age',
					rules: [],
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		handleSubmit(val) {
			console.log(val)
		},
		/**
		 * 获取组件实例
		 * @param key 生成component的key 同时会填入ref 通过this.$refs[key]调用
		 */
		getFormRef() {
			try {
				// @ts-ignore
				const formRef = this.$refs.form.getFormRef()
				console.log(formRef)
			} catch (error) {
				console.error(error)
			}
		},
		/**
		 * 获取组件实例
		 * @param key 生成component的key 同时会填入ref 通过this.$refs[key]调用
		 */
		getComponentRef(key) {
			try {
				// @ts-ignore
				const componentRef = this.$refs.form.getComponentRefByKey(key)
				console.log(componentRef)
			} catch (error) {
				console.error(error)
			}
		},

	},
}
</script>

<style>
.update-demo {
	padding: 20px;
}
.demo-buttons {
	margin-top: 20px;
}
</style>
```

:::
## 如果是系统注册的自定义组件还可以通过useFormValues获取表单值
::: warning
 注意：请在组件中引入useFormValues函数；否则会抛出错误。
:::

```vue
<template>
	<div class="demo-buttons" >
		我是自定义组件：{{ formValues }}
	</div>
</template>
<script setup>
import  { useFormValues } from 'fly-el-form'
const formValues = useFormValues()

</script>

```

