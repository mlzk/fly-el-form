# 参数说明

## Props

| 参数               | 说明                                                                                                                                                                       | 类型    | 默认值     | 可选值            |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :--------- | :---------------- |
| model              | 表单模式                                                                                                                                                                   | string  | 'form'     | 'form' / 'search' |
| singleStepErrorTip | 是否启用单步错误提示 该属性用于定义是否启用单步错误提示。如果设置为 true，则只会依次提示第一个未通过的表单项。如果设置为 false，则会依次提示所有未通过的表单项。           | boolean | false      | -                 |
| inlineBlock        | 该属性用于定义行内换行模式。如果设置为 true，则表单控件会在同一行中显示，并根据内容自动换行。如果设置为 false，则表单控件会分行显示。                                      | boolean | false      | -                 |
| form               | 该属性用于定义表单数据。该属性必须是一个数组，数组的每个元素为一个对象，每个对象都表示一个表单项。                                                                         | Array   | -          | -                 |
| status             | 该属性用于定义表单的状态。可以为 'create' 添加状态，'edit' 编辑状态或 'view' 查看状态。默认为 'create' 添加状态。  影响按钮的文案                                                              | string  | 'add'      | 'create' / 'edit'    |
| formProps          | 该属性用于定义 element-plus form 表单的全量配置                                                                                                                               | Object  | {}         | -                 |
| formEvents         | 该属性用于定义表单的 element-plus form 表单的全量事件。可以设置表单提交、重置等事件的回调函数。默认为一个空对象。                                                             | Object  | {}         | -                 |
| formItemProps      | 该属性用于定义表单项的配置。可以设置表单项的布局、宽度、高度、对齐方式、标签等。默认为一个空对象。                                                                         | Object  | {}         | -                 |
| showFooter         | 该属性用于定义是否展示表单底部。如果设置为 true，则会在表单底部显示一个操作按钮区域，用于提交、重置、取消等操作。如果设置为 false，则不会显示表单底部。                    | boolean | true       | -                 |
| footerRowProps     | 该属性用于定义表单底部的 Row 行配置。可以设置行的对齐方式、宽度、高度等。默认为一个空对象。                                                                                | Object  | {}         | -                 |
| action             | 表单操作按钮配置选项 该属性用于定义表单操作按钮。可以包含 'submit' 提交按钮，'reset' 重置按钮以及其他自定义按钮。默认只包含一个 'submit' 提交按钮。 顺序敏感可调整按钮顺序 | Array   | ['submit'] | -                 |
| actionProps        | 该属性用于定义表单操作按钮的配置。可以设置按钮的类型、大小、图标、文字等。默认为一个空对象。                                                                               | Object  | {}         | -                 |

## Form

| 参数名称         | 类型    | 是否必选 | 说明                                                                                                                                                                               |
| :--------------- | :------ | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | string  | true     | 显示在表单的 label 名称                                                                                                                                                            |
| placeholder      | string  |          | 占位提示符 一般会根据 name 和类型自动生成                                                                                                                                          |
| type             | string  | true     | 表单的类型，如 'Select'、'Input' 等                                                                                                                                                |
| key              | string  | true     | 表单提交时的键名，对应表单数据对象的属性名                                                                                                                                         |
| value            | any     |          | 表单的默认值                                                                                                                                                                       |
| rules            | array   |          | 表单的校验规则                                                                                                                                                                     |
| required         | boolean |          | 表单是否必填 rules 的快捷设置                                                                                                                                                      |
| effectKeys       | array   |          | 组件值发生变化之后影响的字段数据源例如 on-change 之后触发effectKeys中联动组件key的数据源刷新(如果在componentsEvents自定义on-change事件该配置无效请手动使用ref方法调用updateSource) |
| componentsProps  | object  |          | 表单组件的 props 配置，如 'filterable'、'clearable' 等                                                                                                                             |
| componentsEvents | object  |          | 表单组件的事件，如 'on-change'、'on-input' 等                                                                                                                                      |
| source           | object  |          | 表单项的数据源，包含 API 接口、接口参数、处理函数                                                                                                                                  |
| showName         | object  |          | 显示在选项中的名称的键名                                                                                                                                                           |
| showValue        | object  |          | 选项值的键名                                                                                                                                                                       |
| colProps         | object  |          | 在 type=='Row'作为根节点时有效，用于设置表单项外层的 props                                                                                                                         |
| class            | string  |          | 用于设置表单项外层 form-item 的 class 【Title/Row 设置的都是本身元素】                                                                                                             |
| style            | string  |          | 用于设置表单项外层 form-item 的 style 【Title/Row 设置的都是本身元素】                                                                                                             |

## Type 

理论上末级组件都可以作为表单项（通过 props 设置的均可，slot 配置的暂不支持）Title 为特殊组件，用于分组；

| 参数名称       | 类型   | 是否必选 | 说明                 |
| :------------- | :----- | :------- | :------------------- |
| Input          | string | true     | 输入框               |
| Select         | string | true     | 选择器               |
| DatePicker     | string | true     | 日期选择器           |
| TimePicker     | string | true     | 时间选择器           |
| InputNumber    | string | true     | 数字输入框           |
| Switch         | string | true     | 开关                 |
| Checkbox       | string | true     | 多选框               |
| CheckkboxGroup | string | true     | 多选框组             |
| Radio          | string | true     | 单选框               |
| RadioGroup     | string | true     | 单选框组             |
| Cascader       | string | true     | 级联选择器           |
| Rate           | string | true     | 评分                 |
| Row            | string | true     | 行                   |
| Title          | string | true     | 自定义 Title，类似行 |

> ! Title/Upload 额外有 slot 选项

## Rules

| 参数名称  | 类型     | 是否必选 | 说明                                                                           |
| :-------- | :------- | :------- | :----------------------------------------------------------------------------- |
| required  | boolean  |          | 是否必填                                                                       |
| message   | string   |          | 校验未通过时的提示信息                                                         |
| trigger   | string   |          | 触发校验的时机，可选值为 'blur'、'change'、'input'、'submit'、'manual'         |
| pattern   | RegExp   |          | 正则表达式校验规则                                                             |
| validator | function |          | 自定义校验规则，接收两个参数，第一个参数为表单项的值，第二个参数为表单项的配置 |

参考：

```js

              [{
              message: '装完时间不能大于卸完时间',
                trigger: 'change',
                validator: this.validateShiftLoadAndDumpTime
              },
              ....,
              {
                required: true,
                message: '请输入正整数',
                trigger: ['change'],
                pattern: /^[1-9]\d*$/
              }]

```

## Source

| 参数名称         | 类型           | 是否必选 | 说明                                                                                          |
| :--------------- | :------------- | :------- | :-------------------------------------------------------------------------------------------- |
| requestFunction  | async function |          | 获取数据的异步函数                                                                            |
| params           | object         |          | 数据源的 API 接口静态参数                                                                     |
| handle           | function       |          | 数据源的处理函数，第一个参数为接口返回的数据,第二个参数为请求参数，第三个参数是 form          |
| effectKeys       | array          |          | form 中设置为请求参数的 key 集合，作为接口的请求参数参与请求                                                        |
| effectKeysHandle | function       |          | effectKeys 参数值的处理函数返回值作为请求方法的参数                                           |
| data             | array          |          | 手动设置的数据源的数据（配合 showName/showValue）requestFunction 的优先级高于 data 设置的数据 |

### Data

| 参数名称 | 类型   | 是否必选 | 说明                    |
| :------- | :----- | :------- | :---------------------- |
| label    | string |          | 显示在表单的 label 名称 |
| value    | any    |          | 对应值                  |

参考：

```js
//默认使用label和value也可以通过设置showValue和showName修改keyName
;[
	({
		label: '是',
		value: true,
	},
	{
		label: '否',
		value: false,
	}),
]
```

## ActionProps

| 参数名称         | 类型   | 是否必选 | 说明                                                |
| :--------------- | :----- | :------- | :-------------------------------------------------- |
| componentsProps  | object |          | 按钮组件的 props 配置，如 'type'、'size'、'icon' 等 |
| componentsEvents | object |          | 按钮组件的事件，如 'on-click' 等                    |
| text             | string |          | 按钮的文字                                          |

示例：

```js
// 重写默认的搜索重置按钮
   actionProps: {
        submit: {
          componentsProps: {
            type: 'primary',
            icon: 'md-search',
          },
          text: '查询'
        },
        reset: {
         componentsProps: {
            type: 'default',
            icon: 'md-refresh',
          },
          text: '重置'
        },
      },

//配合aciton 增加新的按钮
action: ['submit', 'reset', 'add'],
actionProps: {

  add: {
    componentsProps: {
      type: 'primary',
      icon: 'md-add',
    },
    compoentsEvents: {
      'on-click': () => {
        this.$router.push({
          path: '/add',
        })
      },
    },
    text: '新增'
  },
},
```

## FormProps

element-plus form 的全量配置
参考链接：https://element-plus.org/zh-CN/component/form.html

## FormItemProps

element-plus form-item 的全量配置
参考链接：https://element-plus.org/zh-CN/component/form.html

## FooterRowProps

element-plus row 的全量配置
参考链接：https://element-plus.org/zh-CN/component/layout.html

## Events

| 事件名称 | 说明         | 回调参数 |
| :------- | :----------- | :------- |
| submit   | 表单提交事件 | formData |
| reset    | 表单重置事件 |          |

### FormData 参数

| 参数名称   | 说明         | 类型    |
| :--------- | :----------- | :------ |
| valid      | 是否通过校验 | boolean |
| formvalues | 表单对象     | object  |

## Method

| 方法名称         | 说明                     | 参数         | 返回值                                                                     |
| :--------------- | :----------------------- | :----------- | :------------------------------------------------------------------------- |
| submit           | 触发校验                 |              |                                                                            |
| reset            | 重置表单校验摒并清空表单 |              |                                                                            |
| setFormValues    | 设置表单值（表单复现）   | form         |                                                                            |
| setKeyValue      | 设置表单某个key的数据    | (key, value) |                                                                            |
| getFormValues    | 获取表单数据             |              |                                                                            |
| updateSource | 更新数据源              | [{key:String,value:[]}]        |                                                                            |
| updateRequestSource | 更新配置接口的数据源               | [key] ｜ key     |                                                                            |
| getFormRef          | 获取表单实例             |         |返回 form 组件的 ref 实例 |
| getComponentRefByKey          | 获取表单组件实例             | key          |返回该 key 值的  ref 实例  |
