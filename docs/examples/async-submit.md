# asyncSubmit 同步获取 表单校验结果和表单数据

`submit` 方法触发form 提交事件，之后组件通过事件抛出结果，`asyncSubmit` 方法返回校验结果和表单数据

```js
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
```

:::demo

```vue
<template>
  <div class="select-group-demo">
    <fly-el-form
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
      formConfig: [
        {
          name: 'text',
          type: 'el-input',
          key: 'text',
          required: true,
        }
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