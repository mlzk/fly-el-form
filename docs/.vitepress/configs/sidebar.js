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
					text: '选项组',
					link: '/examples/select-group',
				},
				{
					text: '额外数据收集',
					link: '/examples/extra-data',
				},
			],
		},
	]
}
