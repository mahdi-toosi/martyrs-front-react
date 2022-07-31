import React from 'react'
import ReactDOM from 'react-dom/client'
// ? components
import App from '@/App'
// ? styles
import MUITheme from './assets/styles/MUITheme'
import '@/assets/styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MUITheme>
			<App />
		</MUITheme>
	</React.StrictMode>
)
