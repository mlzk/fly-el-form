import { inject } from 'vue'

export const FormValuesSymbol = Symbol('formValues')

export function useFormValues() {
    const formValues = inject(FormValuesSymbol)
    if (!formValues) {
        throw new Error('useFormValues must be used within FlyElForm')
    }
    return formValues
}
