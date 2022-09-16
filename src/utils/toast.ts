import { useSnackbar, VariantType, WithSnackbarProps } from 'notistack'
import React from 'react'

let useSnackbarRef: WithSnackbarProps
// eslint-disable-next-line react/function-component-definition
export const SnackbarConfigurator: React.FC = () => {
	useSnackbarRef = useSnackbar()
	return null
}

export default (msg: string, variant: VariantType = 'error') => {
	useSnackbarRef.enqueueSnackbar(msg, { variant })
}
