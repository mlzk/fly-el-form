## Select V2 示例

### 基础用法

:::demo
```vue
<template>
  <div class="select-v2-demo">
    <fly-el-form
      ref="form"
      :form="formConfig"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectV2BasicDemo',
  data() {
    return {
      formConfig: [
        {
          name: '城市选择',
          type: 'el-select-v2',
          key: 'city',
          source: {
            data: [
              { value: 'beijing', label: '北京' },
              { value: 'shanghai', label: '上海' },
              { value: 'guangzhou', label: '广州' },
              { value: 'shenzhen', label: '深圳' }
            ]
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
.select-v2-demo {
  padding: 20px;
}
</style>
```
:::

### 远程搜索

:::demo
```vue
<template>
  <div class="select-v2-demo">
    <fly-el-form
      ref="form"
      :form="formConfig"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectV2RemoteDemo',
  data() {
    return {
      formConfig: [
        {
          name: '用户搜索',
          type: 'el-select-v2',
          key: 'user',
          componentProps: {
            filterable: true,
            remote: true,
            remoteMethod: this.handleSearch
          },
          source: {
            data: []
          }
        }
      ]
    }
  },
  methods: {
    handleSearch(query) {
      if (query) {
        // 模拟远程搜索
        setTimeout(() => {
          this.formConfig[0].source.data = [
            { value: '1', label: `用户1 - ${query}` },
            { value: '2', label: `用户2 - ${query}` },
            { value: '3', label: `用户3 - ${query}` }
          ]
        }, 200)
      } else {
        this.formConfig[0].source.data = []
      }
    },
    handleSubmit(formData) {
      console.log('表单数据：', formData)
    }
  }
}
</script>

<style>
.select-v2-demo {
  padding: 20px;
}
</style>
```
:::

### 自定义选项内容

:::demo
```vue
<template>
  <div class="select-v2-demo">
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
  name: 'SelectV2CustomDemo',
  data() {
    return {
      formConfig: [
        {
          name: '商品选择',
          type: 'el-select-v2',
          key: 'product',
          source: {
            data: [
              { 
                value: '1', 
                label: 'iPhone 13',
                price: 5999,
                stock: 100,
                image: 'https://example.com/iphone13.jpg'
              },
              { 
                value: '2', 
                label: 'MacBook Pro',
                price: 12999,
                stock: 50,
                image: 'https://example.com/macbook.jpg'
              },
              { 
                value: '3', 
                label: 'AirPods Pro',
                price: 1999,
                stock: 200,
                image: 'https://example.com/airpods.jpg'
              }
            ]
          },
          componentProps: {
            renderOption: (item) => {
              return h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px'
                }
              }, [
                h('img', {
                  src: item.image,
                  style: {
                    width: '40px',
                    height: '40px',
                    marginRight: '12px',
                    borderRadius: '4px'
                  }
                }),
                h('div', {
                  style: {
                    flex: 1
                  }
                }, [
                  h('div', {
                    style: {
                      fontSize: '14px',
                      color: '#303133'
                    }
                  }, item.label),
                  h('div', {
                    style: {
                      fontSize: '12px',
                      color: '#909399',
                      marginTop: '4px'
                    }
                  }, [
                    h('span', `¥${item.price}`),
                    h('span', {
                      style: {
                        marginLeft: '12px'
                      }
                    }, `库存: ${item.stock}`)
                  ])
                ])
              ])
            }
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
.select-v2-demo {
  padding: 20px;
}
</style>
```
:::

### 多选与标签自定义

:::demo
```vue
<template>
  <div class="select-v2-demo">
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
  name: 'SelectV2MultipleDemo',
  data() {
    return {
      formConfig: [
        {
          name: '技能选择',
          type: 'el-select-v2',
          key: 'skills',
          componentProps: {
            multiple: true,
            collapseTags: true,
            collapseTagsTooltip: true,
            renderTag: (item) => {
              return h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f0f2f5',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  margin: '2px'
                }
              }, [
                h('span', {
                  style: {
                    color: '#409eff',
                    marginRight: '4px'
                  }
                }, '✓'),
                h('span', item.label)
              ])
            }
          },
          source: {
            data: [
              { value: 'vue', label: 'Vue.js' },
              { value: 'react', label: 'React' },
              { value: 'angular', label: 'Angular' },
              { value: 'node', label: 'Node.js' },
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' }
            ]
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
.select-v2-demo {
  padding: 20px;
}
</style>
```
:::
