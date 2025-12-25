# 通过 v-model 绑定表单数据



:::demo

```vue
<template>
  <div class="select-group-demo">
		<el-form-item label="父组件的 text" prop="text">
			<el-input v-model="formData.text" />
		</el-form-item>
		<el-form-item label="父组件的 text2" prop="text2">
			<el-input v-model="formData.text2" />
		</el-form-item>
    <fly-el-form
		v-model="formData"
      ref="form"
      :form="formConfig"
      @submit="handleSubmit"
    />
		<el-button @click="asyncSubmit">异步提交</el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  name: 'SelectGroupDemo',
  data() {
    return {
			formData: {
				text: '1',
				// text2：不需要管理则不需要绑定 v-model
				// text2: '2',
			},
      formConfig: [ 
        {
          name: 'text',
          type: 'el-input',
          key: 'text',
          required: true,
        },
				{
					name: '未绑定 v-model 的 text2',
					type: 'el-input',
					key: 'text2',
					required: true,
				},
      ]
    }
  },
  methods: {
    handleSubmit(formData) {
      console.log('表单数据：', formData)
    },
		async asyncSubmit() {
      const { valid, formValues,errors } = await this.$refs.form.asyncSubmit()
			console.log('校验结果：', valid)
			console.log('表单数据：', formValues)
			console.log('错误信息：', errors)
      ElMessage({
        message: valid ? '校验通过' : '校验失败',
        type: valid ? 'success' : 'error',
      })
    }
  }
  }
</script>
```	

:::