# 配置项

## 常用配置

:::demo

```vue
<template>
	<div>
		<div class="opation">
			<label-item title="行内换行模式">
				<el-switch v-model="formProps.inline" />
			</label-item>
			<label-item title="隐藏标签" tips="隐藏标签时默认标签位置为顶部">
				<el-switch v-model="formProps.hideLabel" />
			</label-item>
			<label-item title="禁用">
				<el-switch v-model="formProps.disabled" />
			</label-item>
			<label-item title="隐藏必填标记">
				<el-switch v-model="formProps.hideRequiredAsterisk" />
			</label-item>

			<label-item title="标签位置">
				<el-select v-model="formProps.labelPosition" style="width: 120px">
					<el-option value="left">左</el-option>
					<el-option value="right">右</el-option>
					<el-option value="top">上</el-option>
				</el-select>
			</label-item>
			<label-item
				title="展示底部"
				tips="隐藏之后可以通过自定义操作按钮通过ref手动调用方法"
			>
				<el-switch v-model="showFooter" />
			</label-item>
			<label-item
				title="inlineBlock"
				tips="该属性用于定义行内换行模式。如果设置为 true，则表单控件会在同一行中显示，并根据内容自动换行。如果设置为 false，则表单控件会分行显示。     "
			>
				<el-switch v-model="inlineBlock" />
			</label-item>
			<label-item
				title="动态修改工种数据源"
				tips="静态数据可以通过更改form数据来完成，如果是使用source配置的请求方法，可以通过 this.$refs.queryForm.updateSources('key')来重新获取"
			>
				<el-button @click="changeSource">修改数据源</el-button>
			</label-item>
		</div>
		<fly-el-form
			model="form"
			:inlineBlock="inlineBlock"
			:formProps="formProps"
			ref="queryForm"
			:form="originData"
			@submit="handleSubmit"
			:enableSpin="spin"
			:action="['submit', 'reset']"
			@reset="handleReset"
			:actionProps="actionProps"
			:showFooter="showFooter"
		/>
	</div>
</template>

<script>
import { h, resolveComponent } from 'vue'

export default {
	name: 'page-Form',
	components: {},
	data() {
		return {
			spin: false,
			showFooter: true,
			inlineBlock: true,
			formProps: {
				hideLabel: false,
				inline: false,
				disabled: false,
				hideRequiredAsterisk: false,
				labelPosition: 'left',
				labelWidth: '120px',
			},
			originData: [
				{
					name: '姓名',
					required: true,
					type: 'el-input',
					key: 'name',
					value: '',
				},
				{
					name: '姓名 textarea',
					required: true,
					type: 'el-input',
					componentProps: {
						type: 'textarea',
					},
					key: 'name2',
					value: '',
				},
				{
					// name: '隐藏字段',
					hidden: true,
					key: 'id',
					type: 'el-input',
					// value: '',
				},
				{
					name: '年龄',
					required: true,
					type: 'el-input-number',
					key: 'age',
					value: 1, // 初始
				},
				{
					name: '工种',
					type: 'el-select',
					key: 'type',
					required: true,
					componentProps: {
						clearable: true,
					},
					source: {
						data: [
							{
								name: '1',
								id: '1',
							},
							{
								name: '2',
								id: '2',
							},
							{
								name: '3',
								id: '3',
							},
						],
					},
					optionSlot: (item, h) => {
						return h('span', {
							class: 'custom-option',
							style: {
								color: 'red',
							},
						}, [
							h('span', item.name),
							h('span', item.id),
						])
					},
					showName: 'name',
					showValue: 'id',
				},
				{
					name: '条件显隐字段',
					type: 'el-switch',
					key: 'visable',
					value: false, // 初始
				},
				{
					name: '自定义校验',
					required: true,
					placeholder: '请输入正整数',
					type: 'el-input-number',
					key: 'batchCount',
					componentProps: {
						min: 1,
					},
					value: 1, // 初始
					visitable: (status, form) => {
						// form 为表单数据
						return form.visable
					},
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
					name: '复选框',
					type: 'el-checkbox-group',
					key: 'visable2',
					required: true,
					// value: [], // 必须是数组且必要有初始值
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
					name: '单选框',
					type: 'el-radio-group',
					required: true,
					key: 'visable2RadioGroup',
					source: {
						data: [
							{
								label: '1-1',
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
					name: '下拉菜单分组',
					type: 'el-select',
					key: 'type2',
					required: true,
					componentProps: {
						clearable: true,
					},
					custom: { group: true },
					source: {
						data: {
							分组1: [
								{
									name: '1',
									id: '1',
								},
								{
									name: '2',
									id: '2',
								},
								{
									name: '3',
									id: '3',
								},
							],
							分组2: [
								{
									name: '4',
									id: '4',
								},
								{
									name: '5',
									id: '5',
								},
								{
									name: '6',
									id: '6',
								},
							],
						},
					},
					showName: 'name',
					showValue: 'id',
				},
				{
					name: 'datetime',
					required: true,
					type: 'el-date-picker',
					key: 'datetime',
					componentProps: {
						type: 'datetime',
					},
				},
				{
					name: 'datetimerange',
					required: true,
					requiredType: 'array',
					type: 'el-date-picker',
					key: 'datetimerange',
					componentProps: {
						type: 'datetimerange',
					},
				},
				{
					name: 'TimePicker',
					required: true,
					type: 'el-time-select',
					key: 'TimePicker',
					componentProps: {
						type: 'time',
					},
				},
				{
					name: 'Cascader',
					required: true,
					type: 'el-cascader',
					key: 'Cascader',
					source: {
						data: [
							{
								value: 'beijing',
								label: '北京',
								children: [
									{
										value: 'gugong',
										label: '故宫',
									},
									{
										value: 'tiantan',
										label: '天坛',
									},
									{
										value: 'wangfujing',
										label: '王府井',
									},
								],
							},
							{
								value: 'jiangsu',
								label: '江苏',
								children: [
									{
										value: 'nanjing',
										label: '南京',
										children: [
											{
												value: 'fuzimiao',
												label: '夫子庙',
											},
										],
									},
									{
										value: 'suzhou',
										label: '苏州',
										children: [
											{
												value: 'zhuozhengyuan',
												label: '拙政园',
											},
											{
												value: 'shizilin',
												label: '狮子林',
											},
										],
									},
								],
							},
						],
					},
				},
				{
					name: 'Rate',
					required: true,
					type: 'el-rate',
					key: 'Rate',
				},
				{
					name: 'Upload',
					type: 'el-upload',
					key: 'Upload',
					required: true,
					requiredType: 'array',
					componentProps: {
						data: {},
						action: 'https://jsonplaceholder.typicode.com/posts/',
						'list-type': 'picture-card',
						'on-success': (res, file, fileList) => {
							console.log(res, file, fileList)
						},
						'on-preview': (file) => {
							console.log(file)
						},
						'on-remove': (file, fileList) => {
							console.log(file, fileList)
						},
						'on-progress': (e, file, fileList) => {
							console.log(e, file, fileList)
						},
						'on-change': (file, fileList) => {
							console.log(file, fileList)
						},
						'on-error': (file, fileList) => {
							console.log(file, fileList)
						},
					},
					slot: (h) => {
						return h(resolveComponent('ElIcon'), null, {
							default: () => h(	resolveComponent('UploadFilled')),
						})
					},
				},
				{
					name: 'ColorPicker',
					required: true,
					type: 'el-color-picker',
					key: 'ColorPicker',
				},
				{
					name: 'Slider',
					required: true,
					type: 'el-slider',
					key: 'Slider',
					requiredType: 'number',
				},
			],
			actionProps: {
				submit: {
					componentProps: {
						type: 'primary',
						icon: 'search',
					},
					text: '查询',
				},
				reset: {
					componentProps: {
						type: 'default',
						icon: 'refresh',
					},
					text: '重置',
				},
			},
		}
	},
	beforeMount() {},
	created() {},
	mounted() {},
	methods: {
		handleSubmit(formData) {
			console.log(formData)
			if (!formData.formValues.name && !formData.formValues.type)
				return this.$message.error('请完善表单')
			this.$emit('handleSearch', formData.formValues)
		},
		handleReset() {
			this.$emit('handleSearch', {})
		},
		changeSource() {
			this.originData[3].source.data = [
				{
					name: '4',
					id: '4',
				},
				{
					name: '5',
					id: '5',
				},
				{
					name: '6',
					id: '6',
				},
			]
		},
	},
	watch: {},
}
</script>
```

:::
