## 自定义选项内容

使用 `optionSlot` 自定义选项的显示内容：

:::demo
```vue
<template>
  <div class="select-group-demo">
    <fly-el-form
      ref="form"
      :form="formConfig"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { h } from 'vue'

export default {
  name: 'SelectGroupCustomDemo',
  data() {
    return {
      formConfig: [
        {
          name: '部门选择',
          type: 'el-select',
          key: 'department',
          source: {
            data: [
              { name: '前端组', id: 'frontend', count: 15 },
              { name: '后端组', id: 'backend', count: 20 },
              { name: '测试组', id: 'test', count: 10 }
            ]
          },
          showName: 'name',
          showValue: 'id',
          optionSlot: (item, h) => {
            return h('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 10px'
              }
            }, [
              h('span', item.name),
              h('span', {
                style: {
                  color: '#909399',
                  fontSize: '12px'
                }
              }, `(${item.count}人)`)
            ])
          }
        }
      ]
    }
  },
  methods: {
    handleSubmit(formData) {
      console.log('表单数据：', formData)
    }
  }
}
</script>

<style>
.select-group-demo {
  padding: 20px;
}
</style>
```
:::
