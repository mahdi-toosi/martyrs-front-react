// ? react
import { ReactNode, useEffect } from 'react'
// ? utils
import tw from 'twin.macro'
// ? components
import TheHeader from '@/components/TheHeader'

export default function DefaultLayout({ children }: { children: ReactNode }) {
	useEffect(() => {
		document.body.style.backgroundColor = '#f3f3f3'
		return () => {
			document.body.style.backgroundColor = ''
		}
	}, [])

	return (
		<>
			<TheHeader />
			<PageWrapper>{children}</PageWrapper>
		</>
	)
}

// ? styles
const PageWrapper = tw.section`relative px-2.5 md:px-10 my-10`
