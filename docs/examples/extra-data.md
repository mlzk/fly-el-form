# 额外数据收集

在一些场景需要根据select选中的选项获取到更多的数据，一般情况通过设置 `custom.returnObject` 为 true 来返回整个选项选中的数据object，之后可以自行处理获取到的数据。


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
export default {
  name: 'SelectGroupDemo',
  data() {
    return {
      formConfig: [
        {
          name: '分组选择',
          type: 'el-select',
          key: 'groupSelect',
          required: true,
          requiredType: 'array',
          componentProps: {
            clearable: true,
            placeholder: '请选择',
            multiple: true,
            collapseTagsTooltip: true,
            collapseTags: true
          },
          custom: { returnObject: true },
          source: {
            data: [
              { name: '北京', id: 'beijing',extraId: 'beijingId' },
              { name: '上海', id: 'shanghai',extraId: 'shanghaiId' },
              { name: '广州', id: 'guangzhou',extraId: 'guangzhouId' }
            ]
          },
          showName: 'name',
          showValue: 'id'
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
```	

:::
在其他一些需要特殊处理的情况，比如需要根据选中的选项获取到更多的数据，可以通过设置 `source.returnSource` 为 true 触发提交动作之后来返回整个数据源，之后可以自行处理获取到的数据。

:::demo

```vue
<template>
  <div class="select-demo">
    <fly-el-form
      ref="form"
      :form="formConfig"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectGroupDemo',
  data() {
    return {
      formConfig: [
        {
          name: '分组选择',
          type: 'el-select',
          key: 'groupSelect',
          required: true,
          source: {
						returnSource: true,
            data: [
              { name: '北京', id: 'beijing',extraId: 'beijingId' },
              { name: '上海', id: 'shanghai',extraId: 'shanghaiId' },
              { name: '广州', id: 'guangzhou',extraId: 'guangzhouId' }
            ]
          },
          showName: 'name',
          showValue: 'id'
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
```	

:::