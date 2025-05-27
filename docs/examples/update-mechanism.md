## 表单更新机制示例

### 基础更新

:::demo

```vue
<template>
	<div class="update-demo">
		<fly-el-form ref="form" :form="formConfig" :key="formConfigKey" @submit="handleSubmit" />
		<div class="demo-buttons">
			<el-button @click="updateForm">更新表单</el-button>
			<el-button @click="updateSource">更新数据源</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UpdateBasicDemo',
	data() {
		return {
			formConfig: [
				{
					name: '姓名',
					type: 'el-input',
					key: 'name',
					value: '张三',
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
							this.changeFormSchema()
						},
					},
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		changeFormSchema() {
			// 创建新的配置数组
			const newConfig = this.formConfig.map(item => {
				if (item.key === 'name') {
					return {
						...item,
						name: '姓名2',
						componentProps: {
							...item.componentProps,
							maxlength: 20,
							showWordLimit: true
						}
					}
				}
				return item
			})
			// 使用Vue的响应式更新方式
			this.$nextTick(() => {
				this.formConfig = [...newConfig]
				this.formConfigKey++
			})
		},
		updateForm() {
			// 更新表单值
			this.$refs.form.setFormValues({
				name: '李四',
				city: 'shanghai',
			})
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

### 联动更新

:::demo

```vue
<template>
	<div class="update-demo">
		<fly-el-form ref="form" :form="formConfig" :key="formConfigKey" @submit="handleSubmit" />
	</div>
</template>

<script>
export default {
	name: 'UpdateLinkageDemo',
	data() {
		return {
			formConfig: [
				{
					name: '省份',
					type: 'el-select',
					key: 'province',
					source: {
						data: [
							{ value: 'zhejiang', label: '浙江' },
							{ value: 'jiangsu', label: '江苏' },
						],
					},
					effectKeys: ['city'], // 当省份改变时，会触发城市的更新
				},
				{
					name: '城市',
					type: 'el-select',
					key: 'city',
					source: {
						data: [],
						requestFunction: async (params) => {
							// 模拟根据省份获取城市列表
							const cityMap = {
								zhejiang: [
									{ value: 'hangzhou', label: '杭州' },
									{ value: 'ningbo', label: '宁波' },
								],
								jiangsu: [
									{ value: 'nanjing', label: '南京' },
									{ value: 'suzhou', label: '苏州' },
								],
							}
							return cityMap[params.province] || []
						},
						params: {},
						effectKeys: ['province'], // 依赖省份的值
					},
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		handleSubmit(formData) {
			console.log('表单数据：', formData)
		},
	},
}
</script>

<style>
.update-demo {
	padding: 20px;
}
</style>
```

:::

### 批量更新

:::demo

```vue
<template>
	<div class="update-demo">
		<fly-el-form ref="form" :form="formConfig" :key="formConfigKey" @submit="handleSubmit" />
		<div class="demo-buttons">
			<el-button @click="batchUpdate">批量更新</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UpdateBatchDemo',
	data() {
		return {
			formConfig: [
				{
					name: '姓名',
					type: 'el-input',
					key: 'name',
				},
				{
					name: '年龄',
					type: 'el-input-number',
					key: 'age',
				},
				{
					name: '城市',
					type: 'el-select',
					key: 'city',
					source: {
						data: [
							{ value: 'beijing', label: '北京' },
							{ value: 'shanghai', label: '上海' },
						],
					},
				},
				{
					name: '爱好',
					type: 'el-checkbox-group',
					key: 'hobbies',
					source: {
						data: [
							{ value: 'reading', label: '阅读' },
							{ value: 'sports', label: '运动' },
							{ value: 'music', label: '音乐' },
						],
					},
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		handleSubmit(formData) {
			console.log('表单数据：', formData)
		},
		batchUpdate() {
			// 批量更新表单值
			this.$refs.form.setFormValues({
				name: '王五',
				age: 25,
				city: 'shanghai',
				hobbies: ['reading', 'music'],
			})

			// 批量更新数据源
			this.$refs.form.updateSource([
				{
					key: 'city',
					value: [
						{ value: 'hangzhou', label: '杭州' },
						{ value: 'nanjing', label: '南京' },
					],
				},
				{
					key: 'hobbies',
					value: [
						{ value: 'coding', label: '编程' },
						{ value: 'gaming', label: '游戏' },
						{ value: 'travel', label: '旅行' },
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

### 动态表单结构

:::demo

```vue
<template>
	<div class="update-demo">
		<fly-el-form ref="form" :form="formConfig" :key="formConfigKey" @submit="handleSubmit" />
		<div class="demo-buttons">
			<el-button @click="addField">添加字段</el-button>
			<el-button @click="removeField">删除字段</el-button>
			<el-button @click="updateField">更新字段</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UpdateStructureDemo',
	data() {
		return {
			formConfig: [
				{
					name: '基本信息',
					type: 'title',
				},
				{
					name: '姓名',
					type: 'el-input',
					key: 'name',
				},
				{
					name: '年龄',
					type: 'el-input-number',
					key: 'age',
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		handleSubmit(formData) {
			console.log('表单数据：', formData)
		},
		addField() {
			// 添加新的表单项
			this.formConfig.push({
				name: '邮箱',
				type: 'el-input',
				key: 'email',
				rules: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
				],
			})
		},
		removeField() {
			// 删除最后一个表单项
			if (this.formConfig.length > 2) {
				// 保留标题和至少一个字段
				this.formConfig.pop()
			}
		},
		updateField() {
			// 更新现有字段的属性
			const nameField = this.formConfig.find((item) => item.key === 'name')
			if (nameField) {
				// 更新字段属性
				Object.assign(nameField, {
					name: '用户名',
					placeholder: '请输入用户名',
					componentProps: {
						maxlength: 20,
						showWordLimit: true,
					},
				})
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

### 复杂表单结构更新

:::demo

```vue
<template>
	<div class="update-demo">
		<fly-el-form ref="form" :form="formConfig" :key="formConfigKey" @submit="handleSubmit" />
		<div class="demo-buttons">
			<el-button @click="addSection">添加分组</el-button>
			<el-button @click="updateSection">更新分组</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UpdateComplexStructureDemo',
	data() {
		return {
			formConfig: [
				{
					name: '基本信息',
					type: 'title',
				},
				{
					type: 'el-row',
					children: [
						{
							name: '姓名',
							type: 'el-input',
							key: 'name',
						},
						{
							name: '年龄',
							type: 'el-input-number',
							key: 'age',
						},
					],
				},
			],
			formConfigKey: 0,
		}
	},
	methods: {
		handleSubmit(formData) {
			console.log('表单数据：', formData)
		},
		addSection() {
			// 添加新的分组
			this.formConfig.push({
				name: '联系方式',
				type: 'title',
			})
			this.formConfig.push({
				type: 'el-row',
				children: [
					{
						name: '手机号',
						type: 'el-input',
						key: 'phone',
						rules: [
							{ required: true, message: '请输入手机号', trigger: 'blur' },
							{
								pattern: /^1[3-9]\d{9}$/,
								message: '请输入正确的手机号',
								trigger: 'blur',
							},
						],
					},
					{
						name: '邮箱',
						type: 'el-input',
						key: 'email',
						rules: [
							{
								type: 'email',
								message: '请输入正确的邮箱格式',
								trigger: 'blur',
							},
						],
					},
				],
			})
		},
		updateSection() {
			// 更新现有分组
			const row = this.formConfig.find((item) => item.type === 'el-row')
			if (row && row.children) {
				// 更新分组中的字段
				row.children = [
					{
						name: '用户名',
						type: 'el-input',
						key: 'username',
						componentProps: {
							maxlength: 20,
							showWordLimit: true,
						},
					},
					{
						name: '密码',
						type: 'el-input',
						key: 'password',
						componentProps: {
							type: 'password',
							showPassword: true,
						},
					},
				]
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
