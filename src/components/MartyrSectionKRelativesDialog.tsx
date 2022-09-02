// ? react
import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// ? utils
import tw, { styled } from 'twin.macro'
import { useRepositories } from '@/repositories'
import { genderSwitchOptions, educationDegrees } from '@/stores/martyrs'
// ? components
import TextField from '@mui/material/TextField'
import AppDialog from '@/components/AppDialog'
import LoadingButton from '@mui/lab/LoadingButton'
import AppSwitchButton from '@/components/AppSwitchButton'
// ? types
import type { Relative } from '@/repositories/relatives/types'
import AppDropdown from './AppDropDown'
import AppDatepicker from './AppDatepicker'

const AliveOptions = [
	{ label: 'زنده', value: true },
	{ label: 'فوت شده', value: false },
]

interface Props {
	show: boolean
	relative: Relative
	onStore: () => void
	onClose: () => void
}
export default function MartyrSectionKRelativesDialog({
	show,
	onStore,
	onClose,
	relative: relativeProp,
}: Props) {
	const { id } = useParams()
	const { relatives: relativesRepo } = useRepositories()

	const [visible, setVisible] = useState(false)
	const [relative, setRelative] = useState({} as Relative)
	const [storeLoading, setStoreLoading] = useState(false)

	const handleChange = (key: keyof Relative, value: any) => {
		setRelative({ ...relative, [key]: value })
	}

	const handleClose = (store = false) => {
		setVisible(false)
		onClose()
		if (store) onStore()
	}

	const storeRelative = async (event: FormEvent) => {
		event.preventDefault()
		// setStoreLoading(true)
		const payload = { ...relative }
		console.log(payload)

		let result
		if (relative.id) result = await relativesRepo.update(payload)
		else result = await relativesRepo.create(payload)
		setStoreLoading(false)

		if (result) handleClose(true)
	}

	useEffect(() => {
		if (!show) return
		setRelative({ ...relativeProp })
		setVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [show])

	return (
		<AppDialog
			visible={visible}
			onClose={handleClose}
			header={relative.id ? 'بروزرسانی وابسته' : 'ثبت وابسته'}
		>
			<Form onSubmit={storeRelative}>
				<TextField
					label="نام و نام خانوادگی"
					variant="standard"
					defaultValue={relative.name}
					onChange={(e) => handleChange('name', e.target.value)}
				/>

				<TextField
					label="نسبت"
					variant="standard"
					defaultValue={relative.relation}
					onChange={(e) => handleChange('relation', e.target.value)}
				/>

				<TextField
					label="شماره تلفن"
					variant="standard"
					defaultValue={relative.phone}
					onChange={(e) => handleChange('phone', e.target.value)}
				/>

				<TextField
					label="شماره تلفن همراه"
					variant="standard"
					defaultValue={relative.mobile}
					onChange={(e) => handleChange('mobile', e.target.value)}
				/>

				<TextField
					label="شغل"
					variant="standard"
					defaultValue={relative.job}
					onChange={(e) => handleChange('job', e.target.value)}
				/>

				<TextField
					label="وضعیت ایثارگری"
					variant="standard"
					defaultValue={relative.StatusOfSacrifice}
					onChange={(e) => handleChange('StatusOfSacrifice', e.target.value)}
				/>

				<AppDropdown
					label="تحصیلات"
					options={educationDegrees}
					defaultValue={relative.education}
					onChange={(e) => handleChange('education', e)}
				/>

				<AppDatepicker
					defaultValue={relative.BD_Date}
					label="تاریخ تولد"
					onChange={(e) => handleChange('BD_Date', e)}
				/>

				<AppSwitchButton
					label="جنسیت"
					options={genderSwitchOptions}
					defaultValue={relative.gender}
					onChange={(e) => handleChange('gender', e)}
				/>

				<AppSwitchButton
					label="وضعیت حیات"
					options={AliveOptions}
					defaultValue={relative.alive}
					onChange={(e) => handleChange('alive', e)}
				/>

				<TextField
					multiline
					label="آدرس"
					maxRows={4}
					variant="standard"
					className="w-full"
					defaultValue={relative.address}
					onChange={(e) => handleChange('address', e.target.value)}
				/>

				<div className="w-full flex justify-end">
					<LoadingButton size="small" variant="contained" type="submit" loading={storeLoading}>
						{relative.id ? 'بروزرسانی' : 'ثبت'}
					</LoadingButton>
				</div>
			</Form>
		</AppDialog>
	)
}

const Form = styled.form(() => [
	'min-width:20rem;',
	tw`flex flex-wrap items-center justify-center gap-8`,
	{ '&>div': tw`w-60` },
])
