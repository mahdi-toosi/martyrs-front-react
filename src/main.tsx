import React from 'react'
import ReactDOM from 'react-dom/client'
import { RepositoriesContext, repositories } from '@/repositories'
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
			<RepositoriesContext.Provider value={repositories}>
				<App />
			</RepositoriesContext.Provider>
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
