declare namespace FlyFormTypes {
  interface FormItem {
		name: string
		placeholder?: string
		type: string
		key: string
		value?: any
		rules?: any[]
		required?: boolean
		requiredType?: string
		tips?: string
		tipLabelProps?: Record<string, any>
		formItemProps: Record<string, any>
		visitable?: Function
		props?: Record<string, any>
		componentProps?: Record<string, any>
		componentEvents?: Record<string, any>
		options?: any[]
		optionSlot?: (item: any, h: any) => any
		optionProps?: Record<string, any>
		effectKeys?: any[]
		source?: {
			api: string
			params?: Record<string, any>
			handler?: (...args: any[]) => any
			data?: any[]
			[key: string]: any
		}
		custom?: {
			group?: boolean
			[key: string]: any
		}
		uploadSlots?: {
			default?: (h: any) => any
			trigger?: (h: any) => any
			tip?: (h: any) => any
			file?: (file: any, h: any) => any
			fileList?: (fileList: any[], h: any) => any
		}
		showName?: string
		showValue?: string
		colProps?: Record<string, any>
		class?: string
		style?: any
		slot?: any
		children?: FormItem[]
	}

  type RequestFunc = () => Promise<any>
	interface Source {
		api: string
		params?: Record<string, any>
		handle?: (...args: any[]) => any
		[key: string]: any
	}
	interface CollectedFormContent {
		formContent: FormItem[]
		formData: Record<string, any>
		rules: Record<string, any>
		requests: Record<string, RequestFunc>
	}
	type Form = FormItem[]

  interface Props {
		model: string
		singleStepErrorTip: boolean
		enableSpin?: boolean
		inlineBlock: boolean
		form: Form
		status: string
		formProps: Record<string, any>
		formEvents: Record<string, any>
		formItemProps: Record<string, any>
		showFooter: boolean
		footerRowProps: Record<string, any>
		action: any[]
		actionProps: Record<string, any>
		strict: boolean
	}
	interface requireTypes {
		[key: string]: string
	}
	interface FuncTree {
		[key: string]: () => any
	}
	interface VNode {
		[key: string]: any
	}
  class FormParser {
		private props: FlyFormTypes.Props
		private context: any
		private funcTree: FlyFormTypes.FuncTree
		constructor(props: FlyFormTypes.Props, context: any)
		hasOwnPropertySafely(obj: any, key: string): boolean
		generatorFooter(props: FlyFormTypes.Props): any
		generatorFooterButton(props: FlyFormTypes.Props): any
	}
}

export = FlyFormTypes
