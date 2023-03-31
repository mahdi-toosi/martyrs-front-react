// ? react
import { FormEvent, useEffect, useState } from 'react'
// ? utils
import tw, { styled } from 'twin.macro'
import userStore from '@/stores/user'
import { useRepositories } from '@/repositories'
import { genderSwitchOptions, educationDegrees } from '@/stores/martyrs'
// ? components
import TextField from '@mui/material/TextField'
import AppDialog from '@/components/AppDialog'
import LoadingButton from '@mui/lab/LoadingButton'
import AppDropdown from '@/components/AppDropDown'
import AppDatePicker from '@/components/AppDatePicker'
import AppSwitchButton from '@/components/AppSwitchButton'
// ? types
import type { Relative } from '@/repositories/relatives/types'

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
	const { hasPermission } = userStore()
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
					disabled={!hasPermission('name', 'relatives')}
					onChange={(e) => handleChange('name', e.target.value)}
				/>

				<TextField
					label="نسبت"
					variant="standard"
					defaultValue={relative.relation}
					disabled={!hasPermission('relation', 'relatives')}
					onChange={(e) => handleChange('relation', e.target.value)}
				/>

				<TextField
					label="شماره تلفن"
					variant="standard"
					defaultValue={relative.phone}
					disabled={!hasPermission('phone', 'relatives')}
					onChange={(e) => handleChange('phone', e.target.value)}
				/>

				<TextField
					label="شماره تلفن همراه"
					variant="standard"
					defaultValue={relative.mobile}
					disabled={!hasPermission('mobile', 'relatives')}
					onChange={(e) => handleChange('mobile', e.target.value)}
				/>

				<TextField
					label="شغل"
					variant="standard"
					defaultValue={relative.job}
					disabled={!hasPermission('job', 'relatives')}
					onChange={(e) => handleChange('job', e.target.value)}
				/>

				<TextField
					variant="standard"
					label="وضعیت ایثارگری"
					defaultValue={relative.StatusOfSacrifice}
					disabled={!hasPermission('StatusOfSacrifice', 'relatives')}
					onChange={(e) => handleChange('StatusOfSacrifice', e.target.value)}
				/>

				<AppDropdown
					label="تحصیلات"
					options={educationDegrees}
					defaultValue={relative.education}
					onChange={(e) => handleChange('education', e)}
					disabled={!hasPermission('education', 'relatives')}
				/>

				<AppDatePicker
					label="تاریخ تولد"
					defaultValue={relative.BD_Date}
					onChange={(e) => handleChange('BD_Date', e)}
					disabled={!hasPermission('BD_Date', 'relatives')}
				/>

				<AppSwitchButton
					label="جنسیت"
					defaultValue={relative.gender}
					options={genderSwitchOptions}
					disabled={!hasPermission('gender', 'relatives')}
					onChange={(e) => handleChange('gender', e)}
				/>

				<AppSwitchButton
					label="وضعیت حیات"
					options={AliveOptions}
					defaultValue={relative.alive}
					disabled={!hasPermission('alive', 'relatives')}
					onChange={(e) => handleChange('alive', e)}
				/>

				<TextField
					multiline
					label="آدرس"
					maxRows={4}
					variant="standard"
					className="w-full"
					defaultValue={relative.address}
					disabled={!hasPermission('address', 'relatives')}
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
