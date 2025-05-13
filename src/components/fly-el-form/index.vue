<script lang="ts">
  import './styles.scss'
  import { requireTypes, hasOwnPropertySafely } from './formParser'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import type FlyFormTypes from './types.d.ts'
  import {
    defineComponent,
    ref,
    h,
    watch,
    nextTick,
    resolveComponent,
  } from 'vue'

  const FlyElForm = defineComponent({
    name: 'FlyElForm',
    props: {
      // 模式 默认form表单模式 search为搜索条模式
      model: {
        type: String,
        default: 'form',
      },
      // 是否启用单步错误提示 如果有多个未通过的表单项，只会依次提示第一个未通过的表单项
      singleStepErrorTip: {
        type: Boolean,
        default: false,
      },
      // 行内换行模式
      inlineBlock: {
        type: Boolean,
        default: false,
      },
      /**
       * 表单数据
       */
      form: {
        type: Object,
        require: true,
      },
      /**
       * 表单状态
       */
      status: {
        type: String,
        default: 'create',
      },
      /**
       * 表单配置
       */
      formProps: {
        type: Object,
        default: () => {
          return {}
        },
      },
      /**
       * 表单事件
       */
      formEvents: {
        type: Object,
        default: () => {
          return {}
        },
      },
      /**表单项配置 */
      formItemProps: {
        type: Object,
        default: () => {
          return {}
        },
      },
      /**表单row配置 */
      formRowProps: {
        type: Object,
        default: () => {
          return {
            gutter: 10,
          }
        },
      },
      /**表单col配置 */
      formColProps: {
        type: Object,
        default: () => {
          return {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 6,
          }
        },
      },
      // 是否展示表单底部
      showFooter: {
        type: Boolean,
        default: true,
      },
      footerRowProps: {
        type: Object,
        default: () => {
          return {}
        },
      },
      // 表单操作按钮
      action: {
        type: Array,
        default: () => {
          return ['submit', 'reset']
        },
      },
      // 表单操作按钮配置
      actionProps: {
        type: Object,
        default: () => {
          return {}
        },
      },
      // 严格模式只接受内置的表单项
      strict: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, context) {
      const isFirstInit = ref(true)
      const formContent = ref({})
      const requests = ref<{ [key: string]: () => Promise<any> }>({})
      const rules: Record<string, any> = ref({})
      const sourceData: Record<string, any> = ref({})
      const formValues = ref<Record<string, any>>({})
      const formInitValues = ref<Record<string, any>>({})
      const formKeyAndName: Record<string, any> = ref({})
      const FlyFormRef = ref<FormInstance | null>(null)
			const needOverWriteForm = ref<Record<string, any>>({})
			const needReturnSourceKeys = ref<string[]>([])
			const updateTimeout = ref<NodeJS.Timeout | null>(null)
			const overWrite = () => {
				if (needOverWriteForm.value) {
					Object.keys(needOverWriteForm.value).forEach((key) => {
						if (hasOwnPropertySafely(formValues.value, key)) {
							formValues.value[key] = needOverWriteForm.value[key]
						}
					})
					needOverWriteForm.value = {}
				}
			}
			const generatorRluesAndRequests = async (form: FlyFormTypes.Form) => {
				// 如果没有数据直接返回
				// 递归处理form数据
				const res = collectFormContent(form)
				// 优先 rules生成
				formContent.value = res.formContent
				rules.value = res.rules
				requests.value = res.requests
				// 第一次渲染dom时 form表单初始值
				if (isFirstInit.value) {
					// 请求生成
					const requests = Object.keys(res.requests).map((key: string) => {
						return res.requests[key as keyof typeof res.requests]()
					})
					// form表单初始值 用于重置表单 每次生成新的初始值避免修改form之后重置表单会将用户主动设置的值清空
					formInitValues.value = Object.assign({}, res.formData)
					// 执行请求 完成数据源拉取
					if (requests && requests.length > 0) {
						await Promise.allSettled(requests).catch((err) => {
							console.warn(err)
						})
					}
					// form表单生成
					formValues.value = Object.assign({}, res.formData)
					if (needOverWriteForm.value) {
						// @ts-ignore
						overWrite(needOverWriteForm.value)
						needOverWriteForm.value = {}
					}
					nextTick(() => {
						isFirstInit.value = false
					})
				}
				// form表单初始值 用于重置表单 每次生成新的初始值避免修改form之后重置表单会将用户主动设置的值清空
			}
			const collectFormContent = (
				data: FlyFormTypes.FormItem[] = [],
			): FlyFormTypes.CollectedFormContent => {
				const res: FlyFormTypes.CollectedFormContent = {
					formContent: [],
					formData: {},
					rules: {},
					requests: {},
				}
			// 对深度不确定的data数组进行校验要求data下的item必须有key并且key必须为string并且key不能重复

				const inputTips = ['el-input', 'el-input-number']

				data.forEach((item: FlyFormTypes.FormItem) => {
					// 如果设置了key自动设置不同类型默认值
					if (
						!hasOwnPropertySafely(item, 'type') &&
						!hasOwnPropertySafely(item, 'hidden')
					) {
						throw new Error(`form item type is required.`)
					}
					if (hasOwnPropertySafely(item, 'key')) {

						if (hasOwnPropertySafely(formKeyAndName.value, item.key)) {
							throw new Error(
								`form item key "${item.key}" is duplicated. Please use another key.`,
							)
						} else {
							formKeyAndName.value[item.key] = item.name
						}
						if (item.type === 'el-input-number') {
							res.formData[item.key] = hasOwnPropertySafely(item, 'value')
								? item.value
								: null
						} else if (item.type === 'el-checkbox-group') {
							res.formData[item.key] = hasOwnPropertySafely(item, 'value')
								? item.value
								: []
						} else {

							if (
								(hasOwnPropertySafely(item, 'type') &&
									item.type !== 'el-row' &&
									item.type !== 'title')
							) {
								res.formData[item.key] = hasOwnPropertySafely(item, 'value')
									? item.value
									: undefined
							}
						}
					}

					// 如果设置了rules自动设置rules
					if (hasOwnPropertySafely(item, 'rules') && item.rules!.length > 0) {
						res.rules[item.key] = item.rules
					}

					if (item.required) {
						const requiredType = hasOwnPropertySafely(item, 'requiredType')
							? item.requiredType
							: requireTypes[item.type] || 'string'

						const tips = {
							required: true,
							message: `${inputTips.includes(item.type) ? '请填写' : '请选择'}${item.name
								}`,
							trigger: 'change',
							type: requiredType,
						}

						if (
							hasOwnPropertySafely(res.rules, item.key) &&
							res.rules[item.key]!.length > 0
						) {
							res.rules[item.key] = [tips, ...res.rules[item.key]!]
						} else {
							res.rules[item.key] = [tips]
						}
					}

					if (
						hasOwnPropertySafely(item, 'source') &&
						hasOwnPropertySafely(item.source, 'requestFunction')
					) {
						res.requests[item.key] = generatorRequestFunction(item)
					}
					// 如果设置了source自动设置传入静态数据源
					else if (
						hasOwnPropertySafely(item, 'source') &&
						hasOwnPropertySafely(item.source, 'data') &&
						item.source
					) {
						sourceData.value[item.key] = item.source.data
						if (item.source.returnSource) {
							needReturnSourceKeys.value.push(item.key)
						}
					} else {
						!hasOwnPropertySafely(sourceData.value, item.key) &&
							(sourceData.value[item.key] = [])
					}

					// 如果没有placeholder自动生成
					if (!item.placeholder) {
						item.placeholder =
							(inputTips.includes(item.type) ? '请填写' : '请选择') + item.name
					}

					// 剪除source属性，初始化之后不再允许通过修改source属性来修改数据源，因为source属性是用来生成请求的且只能生成一次，如需调整指定数据源，可以通过修改source.data属性来
					const mItem: FlyFormTypes.FormItem = { ...item }
					if (hasOwnPropertySafely(mItem, 'source')) {
						delete mItem.source
					}

					if (
						item.type === 'el-row' &&
						hasOwnPropertySafely(item, 'children') &&
						item.children!.length > 0
					) {
						const cRes = collectFormContent(item.children!)
						res.rules = { ...res.rules, ...cRes.rules }
						res.formData = { ...res.formData, ...cRes.formData }
						res.requests = { ...res.requests, ...cRes.requests }
						mItem.children = cRes.formContent
					}

					res.formContent.push(mItem)
				})

				return res
			}
			const generatorRequestFunction = (item: FlyFormTypes.FormItem) => {
				const source: any = item.source
				return async function () {
					try {
						const {
							requestFunction,
							params,
							handle,
							effectKeys,
							effectKeysHandle,
						} = source

						let requestParams = params || {}
						if (effectKeys && effectKeys.length > 0) {
							// 从this.formValues中取值
							const effectKeysFormValues: any = {}
							for (let i = 0; i < effectKeys.length; i++) {
								effectKeysFormValues[effectKeys[i]] = formValues.value[effectKeys[i]]
							}

							// 合并参数
							requestParams = { ...requestParams, ...effectKeysFormValues }

							// 如果有自定义处理函数，则使用处理后的结果
							if (effectKeysHandle && typeof effectKeysHandle === 'function') {
								requestParams = effectKeysHandle({
									params: requestParams,
									formValues: formValues.value,
									sourceData: sourceData.value,
									effectKeys: effectKeys
								})
							}
						}

						const res = await requestFunction(requestParams)

						// 将请求到的数据赋值给sourceData
						sourceData.value[item.key] = handle
							? handle(
								res,
								requestParams,
								formValues.value || formInitValues.value,
							)
							: res
						return res
					} catch (err) {
						// 返回一个错误对象
						console.error(err)
						return { error: err }
					}
				}
			}

			// 执行初始化
			generatorRluesAndRequests(props.form as any)
			// 监听表单数据变化
			// @ts-ignore
			watch(
				// @ts-ignore
				props.form,
				async (newVal, oldVal: FlyFormTypes.Form) => {
					// @ts-ignore
					await generatorRluesAndRequests(newVal)
				},
				{
					deep: true,
				},
			)

			return {
				isFirstInit,
				formContent,
				requests,
				rules,
				sourceData,
				formInitValues,
				formKeyAndName,
				formValues,
				FlyFormRef,
				needOverWriteForm,
				overWrite,
				needReturnSourceKeys,
				updateTimeout,
			}
		},

		methods: {
			async submit() {
				// @ts-ignore
				const formRef: FormInstance = this.$refs.FlyFormRef
				await formRef.validate((valid: any, errors: any) => {
					let returnData: {
						valid: boolean;
						formValues: Record<string, any>;
						sourceData?: Record<string, any>;
					} = {
						valid,
						formValues: this.formValues,
					}
					// 如果存在额外的数据收集，则将额外的数据收集添加到返回数据中
					console.log(this.needReturnSourceKeys)
					if (this.needReturnSourceKeys && this.needReturnSourceKeys.length > 0) {
						let templateSourceData: Record<string, any> = {}
						this.needReturnSourceKeys.forEach((key: string) => {
							templateSourceData[key] = this.sourceData[key]
						})
						returnData.sourceData = templateSourceData
					}
					this.$emit('submit', returnData)

					if (!valid && this.$props.model === 'search') {
						const errorMsg: any[] = []
						const errorNames: any[] = []

						Object.keys(errors).forEach((key) => {
							const item = errors[key][0]
							errorMsg.push(item.message)
							errorNames.push(this.formKeyAndName[key])
						})

						// 只依次提示第一个错误
						if (this.$props.singleStepErrorTip) {
							ElMessage.error(errorMsg[0])
						} else {
							ElMessage.error(
								`请完善${errorNames.length > 0 ? errorNames.join('、') : '查询条件'
								}`,
							)
						}
					}
				})
			},
			/**
			 * 获取组件实例
			 * @param key 生成component的key 同时会填入ref 通过this.$refs[key]调用
			 */
			getFormRef(key: string) {
				try {
					// @ts-ignore
					const formRef: FormInstance = this.$refs.FlyFormRef
					return formRef
				} catch (error) {
					console.error(error)
				}
			},
			getComponentRefByKey(key: string) {
				if (key && typeof key === 'string') {
					try {
						return this.$refs[key]
					} catch (error) {
						console.error(error)
					}
				} else {
					console.error('请传入正确的key')
					return false
				}
			},
			reset() {
				// @ts-ignore
				const formRef: FormInstance = this.$refs.FlyFormRef
				formRef.resetFields()
				this.$emit('reset')
			},
			// overWrite(data: any) {
			//   const $this = this
			//   Object.keys(data).forEach((key) => {
			//     if (hasOwnPropertySafely($this.formValues, key)) {
			//       $this.formValues[key] = data[key]
			//     }
			//   })
			// },
			setFormValues(data: any) {
				// @ts-ignore
				const formRef: FormInstance = this.$refs.FlyFormRef
				if (!data) return console.error('setFormValues error: 请传入正确的数据')

				// 使用 nextTick 等待组件完全渲染
				nextTick(async () => {
					try {
						if (formRef) {
							// 先重置表单
							await formRef.resetFields()
							// 更新表单值
							if (!this.isFirstInit) {
								Object.keys(data).forEach((key) => {
									if (hasOwnPropertySafely(this.formValues, key)) {
										this.formValues[key] = data[key]
									}
								})
							} else {
								// 如果表单实例不存在,保存数据等待初始化完成后设置
								this.needOverWriteForm = data
							}
						}
					} catch (err) {
						console.error('setFormValues error:', err)
					}
				})
			},
			/**
			 * 更新数据源
			 * @param keys
			 */
			async updateSource(updateArray: any) {
				if (!updateArray) return console.error('请传入正确的更新数据')
				let keys: string[] = []
				if (Array.isArray(updateArray)) {
					for (let i = 0; i < updateArray.length; i++) {
						let item = updateArray[i]
						if (hasOwnPropertySafely(item, 'key')) {
							if (hasOwnPropertySafely(item, 'value')) {
								this.sourceData[item.key] = item.value
							} else {
								keys.push(item.key)
							}
						} else {
							console.error('请传入正确的更新数据,错误的数据:', item)
						}
					}
					if (keys.length > 0) {
						await this.updateRequestSource(keys)
					} else {
						this.$forceUpdate()
					}
				} else {
					console.error('请传入正确的更新数据')
				}
			},
			/**
			 * 更新数据源
			 * @param keys
			 */
			async updateRequestSource(keys?: string | string[]) {
				if (!keys) return
				let updateRequests: Promise<any>[] = []
				if (Array.isArray(keys)) {
					for (let i = 0; i < keys.length; i++) {
						updateRequests.push(this.requests[keys[i]]())
					}
				} else {
					updateRequests = [this.requests[keys]()]
				}
				if (updateRequests.length === 0) {
					return console.warn('请传入正确的keys')
				}
				await Promise.allSettled(updateRequests).catch((err) => {
					console.warn(err)
				})
				this.$forceUpdate()
			},
			/**
			 * 设置表单值
			 */
			setKeyValue(key: string, value: any) {
				if (hasOwnPropertySafely(this.formValues, key)) {
					this.formValues[key] = value
				} else {
					console.error('表单中不存在' + key + '属性')
				}
			},
			getFormValues() {
				return this.formValues
			},
			clearValidate(data?: any) {
				// @ts-ignore
				const formRef: FormInstance = this.$refs.FlyFormRef
				if (data) {
					window.requestAnimationFrame(() => {
						formRef.clearValidate(data)
					})
				} else {
					this.$nextTick(() => {
						window.requestAnimationFrame(() => {
							formRef.clearValidate()
						})
					})
				}
			},
		},
		render(props: any) {

			const generatorFooterButton = () => {
				const btns: FlyFormTypes.VNode = {
					reset: h(
						resolveComponent('el-button'),
						{
							type: 'default',
							onClick: () => {
								this.reset()
							},
						},
						{
							default: () => '重置', // 改为函数形式插槽
						},
					),
					submit: h(
						resolveComponent('el-button'),
						{
							type: 'primary',
							onClick: () => {
								this.submit()
							},
						},
						{
							default: () =>
								props.model === 'search'
									? '搜索'
									: props.status === 'create'
										? '保存'
										: '修改',
						},
					),
				}

				if (props.action) {
					return props.action.map((btn: string) => {
						// 如果设置了 actionProps
						if (hasOwnPropertySafely(props.actionProps, btn)) {
							return h(
								resolveComponent('el-button'),
								{
									type: 'default',
									...props.actionProps[btn].componentProps,
									onClick: () => {
										if (['submit', 'reset'].includes(btn)) {
											// 执行方法（如 reset 或 submit）
											// @ts-ignore
											this[btn]()
										}
									},
									...props.actionProps[btn].componentEvents,
								},
								{
									default: () => props.actionProps[btn].text || '', // 确保插槽是函数形式
								},
							)
						} else {
							return btns[btn] // 默认按钮内容
						}
					})
				}
			}

			const generatorFooter = () => {
				// 如果设置了showFooter为false，不显示footer
				if (!props.showFooter) return
				return h(
					// @ts-ignore
					resolveComponent('el-row'),
					{
						...props.formRowProps,
						class: 'fly-form-footer',
						justify: 'end',
						...props.footerRowProps,
					},
					{ default: () => generatorFooterButton() },
				)
			}

			const generatorRow = (item: FlyFormTypes.FormItem) => {
				const itemNodes: any = []
				if (item.children && item.children.length > 0) {
					item.children.forEach((it: FlyFormTypes.FormItem) => {
						if (
							(hasOwnPropertySafely(it, 'visitable') &&
								it.visitable &&
								it.visitable(props.status, this.formValues)) ||
							(!hasOwnPropertySafely(it, 'visitable') &&
								hasOwnPropertySafely(it, 'type'))
						) {
							const formit = generatorCol(it)
							itemNodes.push(formit)
						}
					})
					itemNodes
				}
				return h(
					// @ts-ignore
					resolveComponent('el-row'),
					{
						...props.formRowProps,
						...item.componentProps,
						class: `fly-form-row ${item.class ? item.class : ''}`,
						style: {
							...item.style,
						},
					},
					{ default: () => itemNodes },
				)
			}
			const generatorCol: any = (item: FlyFormTypes.FormItem) => {
				const colProps = item.colProps ? item.colProps : {}
				// 判断hidden是否为true
				// @ts-ignore
				if (hasOwnPropertySafely(item, 'hidden') && item.hidden) {
					return null
				}
				const layout = h(
					// @ts-ignore
					resolveComponent('el-col'),
					{
						...props.formColProps,
						...colProps,
						key: item.key,
					},
					{ default: () => generatorFormItem(item) },
				)
				return layout
			}
			const generatorTitle = (item: FlyFormTypes.FormItem) => {
				const props = item.componentProps ? item.componentProps : {}

				return h(
					resolveComponent('el-row'),
					{
						...props,
					},
					[
						h(
							'h3',
							{
								class: `fly-form-title ${item.class ? item.class : ''}`,
								style: {
									...item.style,
								},
							},
							{
								default: () => (item.slot ? item.slot : item.name),
							},
						),
					],
				)
			}
			const generatorForm = (data: any): any[] => {
				if (!data) return []
				const res: any[] = []
				for (let i = 0; i < data.length; i++) {
					const item = data[i]
					if (['el-row', 'Title'].includes(item.type)) {
						switch (item.type) {
							case 'el-row':
								res.push(generatorRow(item))
								break
							case 'Title':
								res.push(generatorTitle(item))
								break
							case 'title':
								res.push(generatorTitle(item))
								break
							default:
								break
						}
					} else {
						if (
							(hasOwnPropertySafely(item, 'visitable') &&
								item.visitable(props.status, this.formValues)) ||
							!hasOwnPropertySafely(item, 'visitable')
						) {
							const formItem =
								props.inlineBlock || props.model == 'search'
									? generatorInlineBlock(item)
									: generatorBlock(item)
							res.push(formItem)
						}
					}
				}
				return res
			}
			const generatorInlineBlock = (item: FlyFormTypes.FormItem) => {
				if (!hasOwnPropertySafely(item, 'hidden')) {
					return generatorFormItem(item)
				}
			}
			const generatorBlock = (item: FlyFormTypes.FormItem) => {
				if (!hasOwnPropertySafely(item, 'hidden')) {
					return h(
						// @ts-ignore
						resolveComponent('el-row'),
						{
							class: `fly-form-row`,
						},
						{ default: () => generatorFormItem(item) },
					)
				}
			}
			const generatorFormItem = (item: FlyFormTypes.FormItem) => {
				const slotRender = item.tips
					? {
						label: () => generatorTipsLabel(item),
						default: () => generatorItem(item),
					}
					: { default: () => generatorItem(item) }

				return h(
					// @ts-ignore
					resolveComponent('el-form-item'),
					{
						key: item.key,
						prop: item.key,
						label: item.name,
						class: `fly-form-item ${item.class ? item.class : ''}`,
						...item.formItemProps,
					},
					slotRender,
				)
			}
			const generatorItem = (item: FlyFormTypes.FormItem) => {
				switch (item.type) {
					case 'el-select':
					case 'el-select-v2':
						return generatorSelect(item)
					case 'el-radio-group':
						return generatorRadioGroup(item)
					case 'el-checkbox-group':
						return generatorCheckboxGroup(item)
					case 'el-upload':
						return generatorUpload(item)
					default:
						return generatorComponents(item)
				}
			}
			const generatorComponents = (item: FlyFormTypes.FormItem) => {
				if (
					(props.strict && hasOwnPropertySafely(requireTypes, item.type)) ||
					!props.strict
				) {
					if (item.slot) {
						return h(
							// @ts-ignore
							resolveComponent(item.type),
							{
								...generatorDefaultProps(item),
								...generatorSourceData(item),
								...item.componentProps,
								attrs: { placeholder: item.placeholder },
								...generatorDefaultEvents(item),
								...item.componentEvents,
							},
							{
								default: () => item.slot(h), // 确保 slot 是函数形式
							},
						)
					} else {
						return h(resolveComponent(item.type), {
							...generatorDefaultProps(item),
							...generatorSourceData(item),
							...item.componentProps,
							attrs: { placeholder: item.placeholder },
							...generatorDefaultEvents(item),
							...item.componentEvents,
						})
					}
				} else {
					return h(
						'span',
						{
							style: {
								color: 'red',
							},
						},

						`Unaccepted component types '${item.type}'`,
					)
				}
			}
			/**
			 * 生成默认的数据源 例如Casader\el-transfer
			 */
			const generatorSourceData = (item: FlyFormTypes.FormItem) => {
				const res: Record<string, any> = {}
				const types = ['AutoComplete', 'el-transfer']
				if (
					types.includes(item.type) &&
					hasOwnPropertySafely(this.sourceData, item.key)
				) {
					res['data'] = this.sourceData[item.key]
				} else if (
					item.type == 'el-cascader' &&
					hasOwnPropertySafely(this.sourceData, item.key)
				) {
					res['options'] = this.sourceData[item.key]
				} else {
					res['data'] = []
				}
				return res
			}
			const generatorRadioGroup = (item: FlyFormTypes.FormItem) => {
				const self = this
				return h(
					// @ts-ignore
					resolveComponent('el-radio-group'),
					{
						modelValue: this.formValues[item.key],
						'onUpdate:modelValue': (val: any) => {
							// 更新值
							this.formValues[item.key] = val
						},
						...item.componentProps,
						...item.componentEvents,
					},
					{ default: () => generatorRadio(item, this.sourceData[item.key]) },
				)
			}
			const generatorRadio = (
				propItem: FlyFormTypes.FormItem,
				data: any[],
			): any[] => {
				const radios = data && data.length > 0 ? data : propItem.options || []
				const res: any[] = []
				const { optionProps } = propItem
				for (let i = 0; i < radios.length; i++) {
					const item: Record<string, any> = radios[i]
					const option = h(
						// @ts-ignore
						resolveComponent('el-radio'),
						{
							value:
								(propItem.showValue && item[propItem.showValue]) || item.value,
							...optionProps,
						},

						{ default: () => item[propItem.showName || 'label'] },
					)
					res.push(option)
				}
				return res
			}
			const generatorCheckboxGroup = (item: FlyFormTypes.FormItem) => {
				const self = this
				return h(
					// @ts-ignore
					resolveComponent('el-checkbox-group'),
					{
						modelValue: this.formValues[item.key],
						'onUpdate:modelValue': (val: any) => {
							// 更新值
							this.formValues[item.key] = val
						},
						...item.componentProps,
						...item.componentEvents,
					},
					{
						default: () => generatorCheckbox(item, this.sourceData[item.key]),
					},
				)
			}
			const generatorCheckbox = (
				propItem: FlyFormTypes.FormItem,
				data: any[],
			): any[] => {
				const checkboxs =
					data && data.length > 0 ? data : propItem.options || []
				const res: any[] = []
				const { optionProps } = propItem
				for (let i = 0; i < checkboxs.length; i++) {
					const item = checkboxs[i]
					const option = h(
						// @ts-ignore
						resolveComponent('el-checkbox'),
						{
							value:
								(propItem.showValue && item[propItem.showValue]) || item.value,
							...optionProps,
							key:
								(propItem.showValue && item[propItem.showValue]) || item.value,
						},
						{
							default: () => item[propItem.showName || 'label'],
						},
					)
					res.push(option)
				}

				return res
			}

			const generatorSelect = (item: FlyFormTypes.FormItem) => {
				// @ts-ignore
				const formRef = this
				// 优先使用 options，其次使用 sourceData
				const sourceData = item.options || this.sourceData[item.key] || []

				let defaultEvent = {
					'onUpdate:modelValue': (val: any) => {
						this.formValues[item.key] = val
					},
				}

				if (item.effectKeys && item.effectKeys.length > 0) {
					defaultEvent = {
						'onUpdate:modelValue': (val: any) => {
							this.formValues[item.key] = val
							// 使用 nextTick 和防抖来避免立即更新
							nextTick(() => {
								if (!this.updateTimeout) {
									this.updateTimeout = setTimeout(() => {
										formRef.updateRequestSource(item.effectKeys)
										this.updateTimeout = null
									}, 100)
								}
							})
						},
					}
				}

				const selectProps: Record<string, any> = {
					modelValue: this.formValues[item.key],
					placeholder: item.placeholder,
					...defaultEvent,
					...item.componentProps,
					...item.componentEvents,
				}

				// 如果启用了 returnObject，添加 value-key 属性
				if (item.custom?.returnObject) {
					// @ts-ignore
					selectProps['value-key'] = item.showValue || 'value'
				}

				// 如果是 el-select-v2，添加 options 属性
				if (item.type === 'el-select-v2') {
					selectProps['options'] = Array.isArray(sourceData) ? sourceData : []
				}

				// 处理 select-v2 的 option 插槽
				const slots: Record<string, any> = {}
				if (item.type === 'el-select-v2' && item.optionSlot) {
					slots.default = (props: any) => {
						return item.optionSlot!(props, h)
					}
				}
				let defaultProps: Record<string, any> = {
					default: () => null
				}

				if (item.type === 'el-select-v2') {
					defaultProps.default = (optionItem: any) => item.optionSlot ? item.optionSlot!(optionItem, h) : null
				} else if (item.type === 'el-select') {
					defaultProps.default = () =>
						item.custom?.group
							? generatorOptionsGroup(item, sourceData)
							: generatorOptions(item, Array.isArray(sourceData) ? sourceData : [])
				}

				return h(
					resolveComponent(item.type),
					selectProps,
					defaultProps
				)
			}
			const generatorOptionsGroup = (
				propItem: FlyFormTypes.FormItem,
				data: any = {},
			): any[] => {
				const res: any[] = []
				const ElOpGroupComponents = resolveComponent('el-option-group')
				for (const key in data) {
					const optionGroup = h(
						// @ts-ignore
						ElOpGroupComponents,
						{
							label: key,
						},

						{ default: () => generatorOptions(propItem, data[key]) },
					)
					res.push(optionGroup)
				}
				return res
			}
			const generatorOptions = (
				propItem: FlyFormTypes.FormItem,
				data: any[] = [],
			): any[] => {
				if (!Array.isArray(data) && !propItem.custom?.group) {
					console.warn(`Select options data for key "${propItem.key}" is not an array:`, data)
					return []
				}

				return data.map((item) => {
					const value = propItem.custom?.returnObject ? item : item[propItem.showValue || 'value']
					const label = item[propItem.showName || 'label']

					if (value === undefined) {
						console.warn(`Option value is undefined for key "${propItem.key}":`, item)
					}

					const optionProps = {
						value,
						key: item[propItem.showValue || 'value'],
						label: item[propItem.showName || 'label'],
						disabled: item.disabled,
						...propItem.optionProps,
					}


					const slots = propItem.optionSlot && typeof propItem.optionSlot === 'function'
						? { default: () => propItem.optionSlot!(item, h) }
						: { default: () => item[propItem.showName || 'label'] }

					return h(
						resolveComponent('el-option'),
						optionProps,
						slots
					)

				})
			}
			const generatorDefaultProps = (item: FlyFormTypes.FormItem) => {
				return {
					ref: item.key,
					modelValue: this.formValues[item.key],
					'onUpdate:modelValue': (val: any) => {
						// 更新值
						this.formValues[item.key] = val
					},
					placeholder: item.placeholder,
				}
			}
			const generatorTipsLabel = (item: FlyFormTypes.FormItem) => {
				return h(
					'span',
					{
						class: 'fly-form-item-tips',
					},
					[
						item.name,
						h(
							// @ts-ignore
							resolveComponent('el-popover'),
							{
								placement: 'top-start',
								title: '提示',
								width: 200,
								trigger: 'hover',
								...item.tipLabelProps,
								content: item.tips,
							},
							{
								reference: () =>
									h(
										// @ts-ignore
										resolveComponent('el-icon'),
										{
											class: 'fly-form-item-tips-icon',
										}, // @ts-ignore
										{ default: () => h(resolveComponent('QuestionFilled')) },
									),
							},
						),
					],
				)
			}
			const generatorDefaultEvents = (item: FlyFormTypes.FormItem) => {
				let defaultEvent = {
					'onUpdate:modelValue': (val: any) => {
						this.formValues[item.key] = val
					},
				}
				if (item.effectKeys && item.effectKeys.length > 0) {
					defaultEvent = {
						'onUpdate:modelValue': (val: any) => {
							this.formValues[item.key] = val
							this.updateRequestSource(item.effectKeys)
						},
					}
				}
				// 日期组件与其他组件的事件不同
				if (['el-date-picker'].includes(item.type)) {
					let event = {
						'on-change': (val: any) => {
							this.formValues[item.key] = val
						},
					}
					if (item.effectKeys && item.effectKeys.length > 0) {
						event = {
							'on-change': (val: any) => {
								this.formValues[item.key] = val
								this.updateRequestSource(item.effectKeys)
							},
						}
					}
					return event
				} else {
					return defaultEvent
				}
			}
			const generatorUpload = (item: FlyFormTypes.FormItem) => {
				const slots: Record<string, any> = {}

				// 处理所有可能的插槽
				if (item.uploadSlots) {
					if (item.uploadSlots.default) {
						slots.default = () => item.uploadSlots!.default!(h)
					}
					if (item.uploadSlots.trigger) {
						slots.trigger = () => item.uploadSlots!.trigger!(h)
					}
					if (item.uploadSlots.tip) {
						slots.tip = () => item.uploadSlots!.tip!(h)
					}
					if (item.uploadSlots.file) {
						slots.file = (props: any) => item.uploadSlots!.file!(props, h)
					}
					if (item.uploadSlots.fileList) {
						slots.fileList = (props: any) => item.uploadSlots!.fileList!(props, h)
					}
				}

				// 如果没有设置默认插槽，提供一个默认的上传按钮
				if (!slots.default && !slots.trigger) {
					slots.default = () => h(
						resolveComponent('el-button'),
						{ type: 'primary' },
						{ default: () => '点击上传' }
					)
				}

				// 确保 file-list 是正确格式的数组
				const formatFileList = (list: any) => {
					if (!list) return []
					if (!Array.isArray(list)) return []
					return list.map(file => {
						if (typeof file === 'string') {
							return {
								name: file,
								url: file,
								uid: Date.now() + Math.random()
							}
						}
						return file
					})
				}

				const currentFileList = ref(formatFileList(this.formValues[item.key]))

				return h(
					resolveComponent('el-upload'),
					{
						'file-list': currentFileList.value,
						'onUpdate:file-list': (val: any) => {
							currentFileList.value = val
							this.formValues[item.key] = val
						},
						...item.componentProps,
						...item.componentEvents,
						'on-success': (response: any, file: any, fileList: any) => {
							if (Array.isArray(fileList)) {
								currentFileList.value = fileList
								this.formValues[item.key] = fileList
							} else {
								if (!Array.isArray(currentFileList.value)) {
									currentFileList.value = []
								}
								currentFileList.value.push(file)
								this.formValues[item.key] = currentFileList.value
							}
							item.componentEvents?.['on-success']?.(response, file, fileList)
						},
					},
					slots
				)
			}
			const itemNodes = generatorForm(this.formContent)

			const $formProps = props.formProps || {}
			if (props.model == 'search') {
				$formProps.inline = true
			}
			const FormNode = h(
				// @ts-ignore
				resolveComponent('ElForm'),
				{
					ref: 'FlyFormRef',
					model: this.formValues,
					rules: this.rules,
					...$formProps,
					// 隐藏标签时默认标签位置为顶部
					labelPosition: $formProps.hideLabel
						? 'top'
						: $formProps.labelPosition,
					...props.formEvents,
				},
				{
					default: () => [
						...itemNodes,
						props.model == 'form' ? generatorFooter() : generatorFooterButton(),
					],
				},
			)
			return h(
				'div',
				{
					class: `fly-form ${props.formProps && props.formProps.hideLabel
						? 'fly-form-hide-label'
						: ''
						} ${(props.formProps && props.formProps.class) || ''} ${props.model == 'search' ? 'fly-search' : ''
						}`,
				},

				FormNode,
			)
		},
	}) as any

export default FlyElForm
</script>


