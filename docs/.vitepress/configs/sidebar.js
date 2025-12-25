export default {
	'/guide/': getComponentsSidebar(),
	'/examples/': getExamplesSidebar(),
}

function getComponentsSidebar() {
	return [
		{
			text: '指南',
			items: [
				{
					text: '表单模式',
					link: '/guide/mode',
				},
				{
					text: '布局排版',
					link: '/guide/layout',
				},
				{
					text: '字段校验',
					link: '/guide/rules',
				},
				{
					text: '组件数据源',
					link: '/guide/source',
				},

				{
					text: '表单操作',
					link: '/guide/action',
				},
				{
					text: '字段控制',
					link: '/guide/linkage',
				},
				{
					text: '表单事件',
					link: '/guide/event',
				},
				{
					text: '表单方法',
					link: '/guide/methods',
				},
			],
		},
	]
}

function getGuideSidebar() {
	return [
		{
			text: '指南',
			items: [
				{
					text: '文档1',
					link: '/guide/',
				},
				{
					text: '文档2',
					link: '/guide/button',
				},
				{
					text: '文档3',
					link: '/guide/modal',
				},
			],
		},
	]
}

function getExamplesSidebar() {
	return [
		{
			text: '示例',
			items: [
				{
					text: '上传',
					link: '/examples/upload',
				},
				{
					text: '选择器',
					link: '/examples/select',
				},
				{
					text: '选择器-v2',
					link: '/examples/select-v2',
				},
				{
					text: '额外数据收集',
					link: '/examples/extra-data',
				},
				{
					text: '表单结构更新',
					link: '/examples/update-mechanism',
				},
				{
					text: 'form子组件 ref 获取',
					link: '/examples/custom-component',
				},
				{
					text: 'asyncSubmit',
					link: '/examples/async-submit',
				},
			],
		},
	]
}
