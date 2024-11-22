export default {
	'/components/': getComponentsSidebar(),
}

function getComponentsSidebar() {
	return [
		{
			text: '组件',
			items: [
				{
					text: '表单模式',
					link: '/components/mode',
				},
				{
					text: '配置项',
					link: '/components/config',
				},
				{
					text: '布局排版',
					link: '/components/layout',
				},
				{
					text: '字段校验',
					link: '/components/rules',
				},
				{
					text: '组件数据源',
					link: '/components/source',
				},
				{
					text: '表单事件',
					link: '/components/event',
				},
				{
					text: '表单方法',
					link: '/components/methods',
				},
				{
					text: '表单操作按钮',
					link: '/components/action',
				},
				{
					text: '字段联动',
					link: '/components/linkage',
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
