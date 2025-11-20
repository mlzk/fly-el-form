// src/index.ts
import FlyElForm from './components/fly-el-form/index.vue'
export { useFormValues } from './composables/useFormValues'
// 默认导出组件
export default FlyElForm

// 添加 install 方法用于 Vue.use()
FlyElForm.install = (app) => {
	app.component(FlyElForm.name, FlyElForm)
}
