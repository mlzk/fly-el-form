## 表单结构更新示例

### 增量更新

通过选择框的 onChange 事件更新form结构
:::demo

```vue
<template>
	<div class="update-demo">
		<div class="demo-buttons" style="margin-bottom: 20px;">
			<el-button @click="changeFormSchema">更新表单</el-button>
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
					componentEvents: {
						onChange: (val) => {
							this.changeFormSchema(val)
						},
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
		changeFormSchema(val) {
			this.formConfig[0].name = '姓名2'
			this.formConfig[2].rules = [
				{ required: true, message: '请输入年龄' },
				{
          validator: (rule, value, callback) => {
            if (value > 20) {
              callback(new Error('年龄不能大于20'))
            }
            callback()
					},
				},
				{
					  type: 'number',
					min: 18,
					max: 100,
					message: '年龄必须在18-100之间',
					trigger: 'blur',
				},
			]
		},

		updateSource() {
			// 更新数据源
			this.$refs.form.updateSource([
				{
					key: 'city',
					value: [
						{ value: 'hangzhou', label: '杭州' },
						{ value: 'nanjing', label: '南京' },
						{ value: 'suzhou', label: '苏州' },
					],
				},
			])
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

### 通过 key更新

通过更新key来更新form结构（不推荐，因为每次更新都会重新渲染整个表单，性能较差）
:::demo

```vue
<template>
	<div class="update-demo">
		<fly-el-form
			ref="form"
			:form="formConfig"
			:key="formConfigKey"
			@submit="handleSubmit"
		/>
		<div class="demo-buttons">
			<el-button @click="updateForm">更新表单</el-button>
		</div>
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
					key: 'age',
					rules: [{ required: true, message: '请输入年龄' }],
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		updateForm() {
			// 更新表单值
			const newConfig = this.formConfig.map((item) => {
				if (item.key === 'name') {
					return {
						...item,
						name: '姓名2',
						componentProps: {
							...item.componentProps,
							maxlength: 20,
							showWordLimit: true,
						},
					}
				}
				// if (item.key === 'city') {
				// 	return {
				// 		...item,
				// 		value: val,
				// 	}
				// }
				return item
			})
			newConfig[2].rules = [
				{ required: true, message: '请输入年龄' },
				{ min: 18, max: 100, message: '年龄必须在18-100之间' },
			]
			this.formConfig = newConfig
			this.formConfigKey++
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
