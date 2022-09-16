import { ReactNode } from 'react'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
	direction: 'rtl',
	palette: { primary: { main: '#c5a711' } },
	typography: {
		fontFamily: [
			'iranSans',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
	components: {
		MuiButton: { defaultProps: { variant: 'outlined' } },
		MuiInput: { defaultProps: {} },
	},
})

interface Props {
	children: ReactNode | ReactNode[]
}

// Create rtl cache
const cacheRtl = createCache({
	key: 'muirtl',
	stylisPlugins: [prefixer, rtlPlugin],
})

export default function MUITheme({ children }: Props) {
	return (
		<CacheProvider value={cacheRtl}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</CacheProvider>
	)
}
