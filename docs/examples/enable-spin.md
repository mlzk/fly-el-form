# enableSpin 加载旋转动画示例

当 `model="form"` 且启用 `enable-spin` 时，若表单配置中存在 `source.requestFunction` 数据源请求，组件会在初始化请求期间展示 loading spin 遮罩。

:::demo
```vue
<template>
  <div class="enable-spin-demo">
    <fly-el-form
      ref="form"
      v-model="formData"
      model="form"
      :form="formConfig"
      enable-spin
      :form-props="formProps"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'EnableSpinDemo',
  data() {
    return {
      formData: {
        remoteSelect: '',
      },
      formProps: {
        labelPosition: 'top',
      },
      formConfig: [
        {
          name: '远程下拉（触发初始化请求）',
          type: 'el-select',
          key: 'remoteSelect',
          required: true,
          requiredType: 'string',
          componentProps: {
            clearable: true,
            placeholder: '请选择',
            style: { width: '100%' },
          },
          source: {
            requestFunction: async () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve([
                    { label: '北京', value: 'beijing' },
                    { label: '上海', value: 'shanghai' },
                  ])
                }, 1200)
              })
            },
          },
        },
      ],
    }
  },
  methods: {
    handleSubmit(formData) {
      console.log('submit:', formData)
    },
  },
}
</script>
```
:::

