import tw from 'twin.macro'

export default function NotFound() {
	return (
		<NotFoundEl dir="ltr">
			<H1>404</H1>
			<Span>|</Span>
			<H2>Page Not Found</H2>
		</NotFoundEl>
	)
}

// ? styles
const NotFoundEl = tw.div`flex gap-3 justify-center items-center h-screen`
const H1 = tw.h1`text-2xl`
const H2 = tw.h2`text-xl`
const Span = tw.span`text-gray-600`
