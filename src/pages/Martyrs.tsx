// ? components
import Typography from '@mui/material/Typography'
import MartyrsTable from '@/components/MartyrsTable'
import DefaultLayout from '@/components/DefaultLayout'

export default function Martyrs() {
	return (
		<DefaultLayout>
			<Typography variant="h5" className="text-center mb-5">
				شهدا
			</Typography>

			<MartyrsTable />
		</DefaultLayout>
	)
}
