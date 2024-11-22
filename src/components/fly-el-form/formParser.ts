import type FlyFormTypes from './types.d.ts'
export const requireTypes: FlyFormTypes.requireTypes = {
	'el-input': 'string',
	'el-input-number': 'number',
	'el-radio': 'boolean',
	'el-radio-group': 'string',
	'el-checkbox': 'boolean',
	'el-checkbox-group': 'array',
	'el-switch': 'boolean',
	'el-select': 'string', // 默认
	'el-time-select': 'string',
	'el-date-picker': 'date', // 默认
	'el-cascader': 'array',
	'el-rate': 'number',
	'el-slider': 'number',
	'el-color-picker': 'string',
}
export const hasOwnPropertySafely = (obj: any, key: string) => {
	if (!obj || !key) return false
	return Object.prototype.hasOwnProperty.call(obj, key)
}
