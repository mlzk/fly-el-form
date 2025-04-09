# Select 分组

本文档展示如何在 fly-el-form 中使用 Select 分组功能。


## 基础分组多选示例

最基本的 Select 分组使用方式：

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
          custom: { group: true, returnObject: true },
          source: {
            data: {
              '热门城市': [
                { name: '北京', id: 'beijing' },
                { name: '上海', id: 'shanghai' },
                { name: '广州', id: 'guangzhou' }
              ],
              '华东地区': [
                { name: '杭州', id: 'hangzhou' },
                { name: '南京', id: 'nanjing' },
                { name: '苏州', id: 'suzhou' }
              ],
              '华南地区': [
                { name: '深圳', id: 'shenzhen' },
                { name: '厦门', id: 'xiamen' },
                { name: '珠海', id: 'zhuhai' }
              ]
            }
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

## 基础分组示例

最基本的 Select 分组使用方式：

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
          componentProps: {
            clearable: true,
            placeholder: '请选择'
          },
          custom: { group: true },
          source: {
            data: {
              '热门城市': [
                { name: '北京', id: 'beijing' },
                { name: '上海', id: 'shanghai' },
                { name: '广州', id: 'guangzhou' }
              ],
              '华东地区': [
                { name: '杭州', id: 'hangzhou' },
                { name: '南京', id: 'nanjing' },
                { name: '苏州', id: 'suzhou' }
              ],
              '华南地区': [
                { name: '深圳', id: 'shenzhen' },
                { name: '厦门', id: 'xiamen' },
                { name: '珠海', id: 'zhuhai' }
              ]
            }
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
          required: true,
          componentProps: {
            clearable: true,
            placeholder: '请选择部门'
          },
          custom: { group: true },
          source: {
            data: {
              '技术部': [
                { name: '前端组', id: 'frontend', count: 15 },
                { name: '后端组', id: 'backend', count: 20 },
                { name: '测试组', id: 'test', count: 10 }
              ],
              '产品部': [
                { name: '产品设计组', id: 'design', count: 8 },
                { name: '用户研究组', id: 'research', count: 5 }
              ],
              '运营部': [
                { name: '市场组', id: 'market', count: 12 },
                { name: '内容组', id: 'content', count: 7 }
              ]
            }
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

## 动态更新数据源

展示如何动态更新分组数据：

:::demo
```vue
<template>
  <div class="select-group-demo">
    <div class="operation-bar">
      <el-button @click="updateSource" type="primary">更新数据源</el-button>
    </div>
    <fly-el-form
      ref="form"
      :form="formConfig"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectGroupDynamicDemo',
  data() {
    return {
      formConfig: [
        {
          name: '产品类别',
          type: 'el-select',
          key: 'product',
          required: true,
          componentProps: {
            clearable: true,
            placeholder: '请选择产品'
          },
          custom: { group: true },
          source: {
            data: {
              '电子产品': [
                { name: '手机', id: 'phone' },
                { name: '电脑', id: 'computer' }
              ],
              '家居用品': [
                { name: '沙发', id: 'sofa' },
                { name: '桌子', id: 'table' }
              ]
            }
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
    },
    updateSource() {
      // 更新第一个选择器的数据源
      this.formConfig[0].source.data = {
        '新品上架': [
          { name: '智能手表', id: 'smartwatch' },
          { name: '耳机', id: 'headphone' }
        ],
        '促销商品': [
          { name: '床垫', id: 'mattress' },
          { name: '椅子', id: 'chair' }
        ]
      }
      // 通知组件更新
      this.$nextTick(() => {
        this.$refs.form.updateSources('product')
      })
    }
  }
}
</script>

<style>
.select-group-demo {
  padding: 20px;
}
.operation-bar {
  margin-bottom: 20px;
}
</style>
```
:::

## 注意事项

1. 要启用分组功能，需要设置 `custom: { group: true }`
2. 分组数据源的格式必须是一个对象，其中键为分组名称，值为该分组的选项数组
3. 每个选项必须包含 `showName` 和 `showValue` 指定的字段
4. 动态更新数据源时，需要调用表单的 `updateSources` 方法
5. 可以通过 `optionSlot` 自定义选项的显示内容，支持复杂的布局和样式 