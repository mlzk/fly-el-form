import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'
import FlyElForm from '../../../src/components/fly-el-form/index.vue'
import 'element-plus/dist/index.css'
import { useComponents } from './useComponents'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import labelItem from './components/label-item.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './custom.scss'
export default {
	...DefaultTheme,
	enhanceApp(ctx) {
		DefaultTheme.enhanceApp(ctx)
		useComponents(ctx.app)
		ctx.app.use(ElementPlus, {
			locale: zhCn,
		})
		ctx.app.component('FlyElForm', FlyElForm)
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			ctx.app.component(key, component)
		}
		ctx.app.component('label-item', labelItem)
	},
}
