import FlyElForm from './components/fly-el-form/index.vue'
// 导出组件
FlyElForm.install = (Vue) => {
	Vue.component(FlyElForm.name, FlyElForm)
}
export default FlyElForm
