import React from 'react'
import ReactDOM from 'react-dom/client'
// ? components
import App from '@/App'
import { SnackbarProvider } from 'notistack'
import { SnackbarConfigurator } from '@/utils/toast'
// ? styles
import MUITheme from './assets/styles/MUITheme'
import '@/assets/styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MUITheme>
			<App />
		</MUITheme>

		<SnackbarProvider
			maxSnack={3}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
		>
			<SnackbarConfigurator />
		</SnackbarProvider>
	</React.StrictMode>
)
