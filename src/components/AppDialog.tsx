// ? react
import { ReactNode } from 'react'
// ? utils
import tw from 'twin.macro'
// ? components
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
// ? types
interface Props {
	visible: boolean
	header?: string
	onClose?: () => void
	children: ReactNode | ReactNode[]
}

export default function AppDialog({ children, visible, onClose, header }: Props) {
	return (
		<Dialog onClose={onClose} open={visible}>
			<ContentWrapper>
				{header && (
					<HeaderWrapper>
						<Typography variant="h6" component="h2" className="mr">
							{header}
						</Typography>
					</HeaderWrapper>
				)}

				{children}
			</ContentWrapper>
		</Dialog>
	)
}

// ? styles
const ContentWrapper = tw.div`py-4 px-8`
const HeaderWrapper = tw.div`flex justify-between items-center mb-6`
