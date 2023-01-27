import React from 'react'
import { OptionsObject, useSnackbar, WithSnackbarProps } from 'notistack'

let useSnackbarRef: WithSnackbarProps
// eslint-disable-next-line react/function-component-definition
export const SnackbarConfigurator: React.FC = () => {
	useSnackbarRef = useSnackbar()
	return null
}

export default (msg: string, options: OptionsObject = { variant: 'error' }) => {
	useSnackbarRef.enqueueSnackbar(msg, options)
}
