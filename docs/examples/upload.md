# Upload 上传组件

## 基础用法

最基本的上传组件使用方式：

:::demo

```vue
<template>
	<div class="upload-demo">
		<fly-el-form ref="form" :form="formConfig" @submit="handleSubmit" />
	</div>
</template>

<script>
import { h, resolveComponent } from 'vue'

export default {
	name: 'UploadDemo',
	data() {
		return {
			formConfig: [
				{
					type: 'el-upload',
					key: 'files',
					name: '基础上传',
					required: true,
					requiredType: 'array',
					componentProps: {
						action:
							'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
						multiple: true,
						'show-file-list': true,
					},
					componentEvents: {
						'on-success': (res, file) => {
							console.log('上传成功:', file.name)
						},
					},
					uploadSlots: {
						tip: (h) =>
							h(
								'div',
								{ class: 'el-upload__tip' },
								'只能上传 jpg/png 文件，且不超过 500kb',
							),
					},
				},
			],
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
.upload-demo {
	padding: 20px;
}
</style>
```

:::

## 图片上传

使用 `list-type="picture-card"` 来设置图片上传样式：

:::demo

```vue
<template>
	<div class="upload-demo">
		<fly-el-form ref="form" :form="formConfig" @submit="handleSubmit" />
		<div v-if="previewUrl" class="image-preview">
			<h4>预览</h4>
			<img :src="previewUrl" style="max-width: 200px" />
		</div>
	</div>
</template>

<script>
import { h, resolveComponent } from 'vue'

export default {
	name: 'ImageUploadDemo',
	data() {
		return {
			previewUrl: '',
			formConfig: [
				{
					type: 'el-upload',
					key: 'avatar',
					name: '头像上传',
					required: true,
					componentProps: {
						action:
							'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
						'list-type': 'picture-card',
						'show-file-list': false,
					},
					componentEvents: {
						'on-success': (res, file) => {
							this.previewUrl = URL.createObjectURL(file.raw)
						},
					},
					uploadSlots: {
						default: (h) =>
							h(
								'div',
								{
									class: 'upload-trigger',
									style: {
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										height: '100%',
									},
								},
								[
									h(resolveComponent('el-icon'), null, {
										default: () => h(resolveComponent('Upload')),
									}),
								],
							),
					},
				},
			],
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
.upload-demo {
	padding: 20px;
}
.image-preview {
	margin-top: 20px;
	padding: 10px;
	border: 1px dashed #dcdfe6;
	border-radius: 4px;
}
.upload-trigger {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
</style>
```

:::

## 拖拽上传

设置 `drag` 属性可以启用拖拽上传：

:::demo

```vue
<template>
	<div class="upload-demo">
		<fly-el-form ref="form" :form="formConfig" @submit="handleSubmit" />
	</div>
</template>

<script>
import { h, resolveComponent } from 'vue'

export default {
	name: 'DragUploadDemo',
	data() {
		return {
			formConfig: [
				{
					type: 'el-upload',
					key: 'dragFiles',
					name: '拖拽上传',
					required: true,
					requiredType: 'array',
					componentProps: {
						action:
							'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
						drag: true,
						multiple: true,
					},
					componentEvents: {
						'on-success': (res, file) => {
							console.log('上传成功:', file.name)
						},
					},
					uploadSlots: {
						default: (h) =>
							h('div', { class: 'el-upload__drag-container' }, [
								h(
									resolveComponent('el-icon'),
									{ class: 'el-icon--upload' },
									{
										default: () => h(resolveComponent('Upload')),
									},
								),
								h('div', { class: 'el-upload__text' }, [
									h('em', '将文件拖到此处，或'),
									h('span', '点击上传'),
								]),
							]),
						tip: (h) =>
							h('div', { class: 'el-upload__tip' }, '支持多个文件同时上传'),
					},
				},
			],
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
.upload-demo {
	padding: 20px;
}
.el-upload__drag-container {
	padding: 20px;
	text-align: center;
}
.el-icon--upload {
	font-size: 26px;
	color: #909399;
	margin-bottom: 10px;
}
.el-upload__text {
	color: #606266;
	font-size: 14px;
}
.el-upload__text em {
	color: #409eff;
	font-style: normal;
}
</style>
```

:::

## 自定义上传按钮

通过 `uploadSlots.default` 或 `uploadSlots.trigger` 自定义上传触发区域：

```js
{
  type: 'el-upload',
  key: 'avatar',
  name: '上传头像',
  componentProps: {
    action: '/api/upload/avatar',
    'show-file-list': false
  },
  uploadSlots: {
    default: (h) => h('div', { class: 'avatar-uploader' }, [
      h('img', { src: this.formValues.avatar }),
      h('span', '点击上传头像')
    ])
  }
}
```

## 带提示的上传

使用 `uploadSlots.tip` 添加上传提示：

```js
{
  type: 'el-upload',
  key: 'documents',
  name: '文档上传',
  componentProps: {
    action: '/api/upload/docs',
    multiple: true
  },
  uploadSlots: {
    tip: (h) => h('div', { class: 'el-upload__tip' },
      '只能上传 jpg/png 文件，且不超过 500kb'
    )
  }
}
```

## 自定义文件列表

通过 `uploadSlots.file` 自定义单个文件的展示：

```js
{
  type: 'el-upload',
  key: 'documents',
  name: '文档上传',
  componentProps: {
    action: '/api/upload/docs',
    multiple: true
  },
  uploadSlots: {
    file: (file, h) => h('div', { class: 'custom-file-item' }, [
      h('i', { class: 'el-icon-document' }),
      h('span', { class: 'filename' }, file.name),
      h('span', { class: 'filesize' }, formatFileSize(file.size))
    ])
  }
}
```

## 拖拽上传

结合 Element Plus 的拖拽上传功能：

```js
{
  type: 'el-upload',
  key: 'images',
  name: '图片上传',
  componentProps: {
    action: '/api/upload/images',
    drag: true,
    multiple: true,
    'list-type': 'picture-card'
  },
  uploadSlots: {
    default: (h) => h('div', [
      h('i', { class: 'el-icon-upload' }),
      h('div', { class: 'el-upload__text' }, [
        h('em', '将文件拖到此处，或'),
        h('span', '点击上传')
      ])
    ]),
    tip: (h) => h('div', { class: 'el-upload__tip' },
      '支持多个图片同时上传'
    )
  }
}
```

## 完整的自定义示例

包含所有插槽的完整示例：

```js
{
  type: 'el-upload',
  key: 'files3',
  name: '文件上传',
  componentProps: {
    action: '/api/upload',
    multiple: true,
    'show-file-list': true,
    'list-type': 'picture',
  },
  componentEvents: {
    'on-success': (response, file, fileList) => {
      console.log('上传成功', response, file, fileList)
    }
  },
  uploadSlots: {
    default: (h) => h('div', { class: 'upload-trigger' }, [
      h('i', { class: 'el-icon-upload' }),
      h('span', '点击上传文件')
    ]),
    tip: (h) => h('div', { class: 'el-upload__tip' }, [
      h('p', '支持的文件类型：jpg, png, pdf'),
      h('p', '单个文件不超过 2MB')
    ]),
    file: (file, h) => h('div', { class: 'custom-file' }, [
      h('img', { src: file.url }),
      h('div', { class: 'info' }, [
        h('span', { class: 'name' }, file.name),
        h('span', { class: 'size' }, formatFileSize(file.size))
      ])
    ]),
    fileList: (fileList, h) => h('div', { class: 'custom-file-list' },
      fileList.map(file => h('div', { class: 'file-item' }, [
        h('span', file.name),
        h('button', { onClick: () => handleRemove(file) }, '删除')
      ]))
    )
  }
}
```

## 注意事项

1. 上传组件的值会自动绑定到 `formValues` 中
2. 可以通过 `componentProps` 配置所有 Element Plus Upload 组件的属性
3. 所有插槽都是可选的，未配置时会使用默认的渲染方式
4. 文件上传相关的回调函数（如 `on-success`、`on-error` 等）可以通过 `componentEvents` 配置

## 自定义上传方法 httpRequest

在 `Element Plus` 的 `Upload` 组件中，如果使用 `httpRequest` 来上传文件，默认情况下它并不会自动处理文件列表 (file-list) 的变化，因为 `httpRequest` 是自定义的上传方法，它不会直接与 `file-list` 进行双向绑定。
不过，还是可以通过手动处理 `file-list` 来实现双向绑定。在 `httpRequest` 中，你可以通过监听文件上传成功或失败的事件来更新 `file-list`

:::demo

```vue
<template>
	<div class="upload-demo">
		<fly-el-form ref="form" :form="formConfig" @submit="handleSubmit" />
	</div>
</template>

<script>
import { h, resolveComponent } from 'vue'

export default {
	name: 'UploadDemo',
	data() {
		return {
			formConfig: [
				{
					type: 'el-upload',
					key: 'files4',
					name: '基础上传',
					requiredType: 'array',
					value: [
						{
							name: 'food.jpeg',
							url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
						},
						{
							name: 'food2.jpeg',
							url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
						},
					],
					componentProps: {
						multiple: true,
						'show-file-list': true,
						httpRequest: ({ file, onSuccess, onError }) => {
							const formData = new FormData()
							formData.append('file', file)
							console.log('开始上传文件:', file.name)
							// 模拟
							const response = {
								code: 200,
								message: '上传成功',
								data: {
									url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
								},
							}
							const fileInfo = {
								name: file.name,
								url: response.data.url,
								raw: file.raw,
								size: file.size,
								status: 'success',
							}
							console.log(
								'模拟上传成功，准备调用 onSuccess:',
								response,
								fileInfo,
							)
							onSuccess(response, fileInfo, [])
							// 使用 fetch 或其他请求方法上传文件
							// fetch(this.uploadAction, {
							// 	method: 'POST',
							// 	body: formData,
							// })
							// 	.then((response) => response.json())
							// 	.then((data) => {
							// 		if (data.success) {
							// 			// 这里可以获取到返回的文件信息 比如文件名 文件大小 文件类型 文件路径 文件id 等等 ，可以在这里进行管理
							// 			// this.fileList.push({ name: file.name, url: data.url })
							// 			// fly-el-form 重写了 onSuccess 事件 调用onSuccess会自动将 fileList 的值赋值给 formValues 中的对应key
							// 			onSuccess(data, file, fileList)
							// 		} else {
							// 			onError(new Error('Upload failed'))
							// 		}
							// 	})
							// 	.catch((error) => {
							// 		onError(error)
							// 	})
						},
					},
					componentEvents: {
						'on-success': (res, file) => {
							console.log('上传成功:', file.name)
						},
						'on-error': (err, file) => {
							console.log('上传失败:', file.name)
						},
					},
					uploadSlots: {
						tip: (h) =>
							h(
								'div',
								{ class: 'el-upload__tip' },
								'只能上传 jpg/png 文件，且不超过 500kb',
							),
					},
				},
			],
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
.upload-demo {
	padding: 20px;
}
</style>
```

:::

## 表单复现

常见的表单复现

:::demo

```vue
<template>
	<div class="upload-demo">
		<fly-el-form ref="form" :form="formConfig" @submit="handleSubmit" />
		<div>
			<el-button @click="handleReset">复现数据</el-button>
		</div>
	</div>
</template>

<script>
import { h, resolveComponent } from 'vue'
const uploadFile = (formData, rootPath, options) => {
	return new Promise((resolve, reject) => {
		console.log('上传文件', formData, rootPath, options)
		resolve({ code: 200, message: '上传成功' })
	})
}
export default {
	name: 'UploadDemo',
	data() {
		return {
			formConfig: [
				{
					type: 'el-input',
					key: 'name',
					name: '姓名',
					required: true,
				},
				{
					type: 'el-upload',
					key: 'files',
					name: '基础上传',
					required: true,
					requiredType: 'array',
					componentProps: {
						action:
							'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
						multiple: true,
						'show-file-list': true,
					},
					componentEvents: {
						'on-success': (res, file) => {
							console.log('上传成功:', file.name)
						},
					},
					uploadSlots: {
						tip: (h) =>
							h(
								'div',
								{ class: 'el-upload__tip' },
								'只能上传 jpg/png 文件，且不超过 500kb',
							),
					},
				},
				{
					type: 'el-upload',
					key: 'relatedFile',
					name: '其他相关文件',
					required: false,
					componentProps: {
						multiple: true,
						'show-file-list': true,
						httpRequest: async (params) => {
							try {
								const rootPath = 'wuliao'
								const formData = new FormData()
								formData.append('uploadfile', params.file)
								formData.append('rootPath', rootPath)
								const res = await uploadFile(formData, rootPath, {
									headers: {
										repeatSubmit: false, // 禁用防重复提交检查
									},
								})
								return res
							} catch (error) {
								ElMessage.error('上传失败')
								params.onError(error)
							}
						},
						componentEvents: {
							'on-success': (res, file) => {
								console.log('上传成功:', file)
							},
						},
						uploadSlots: {
							tip: (h) =>
								h(
									'div',
									{ class: 'el-upload__tip' },
									'只能上传 jpg/png 文件，且不超过 5000kb',
								),
						},
						colProps: {
							md: 24,
							lg: 24,
							sm: 24,
							xs: 24,
						},
					},
				},
			],
		}
	},
	methods: {
		handleSubmit(formData) {
			console.log('表单数据：', formData)
		},
		handleReset() {
			this.$refs.form.setFormValues({
				name: '张三',
				files: [
					{
						name: 'food.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
					},
				],
				relatedFile: [
					{
						name: 'food.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
					},
				],
			})
		},
	},
}
</script>

<style>
.upload-demo {
	padding: 20px;
}
</style>
```

:::
