// ? utils
import userStore from '@/stores/user'
import martyrsStore, { genderSwitchOptions } from '@/stores/martyrs'
// ? components
import TextField from '@mui/material/TextField'
import AppDatepicker from '@/components/AppDatepicker'
import AppSwitchButton from '@/components/AppSwitchButton'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'

export default function MartyrSectionBIdInfo() {
	const { hasPermission } = userStore()
	const { updateMartyr, martyr } = martyrsStore()

	return (
		<MartyrSectionWrapper title="اطلاعات شناسنامه ای">
			<TextField
				label="نام"
				variant="standard"
				defaultValue={martyr.name}
				disabled={!hasPermission('name')}
				onChange={(e) => updateMartyr('name', e)}
			/>

			<TextField
				label="نام خانوادگی"
				variant="standard"
				defaultValue={martyr.lastName}
				disabled={!hasPermission('lastName')}
				onChange={(e) => updateMartyr('lastName', e)}
			/>

			<TextField
				label="شهرت، لقب"
				variant="standard"
				defaultValue={martyr.title}
				disabled={!hasPermission('title')}
				onChange={(e) => updateMartyr('title', e)}
			/>

			<TextField
				label="نام پدر"
				variant="standard"
				defaultValue={martyr.fatherName}
				disabled={!hasPermission('fatherName')}
				onChange={(e) => updateMartyr('fatherName', e)}
			/>

			<TextField
				label="نام مادر"
				variant="standard"
				defaultValue={martyr.motherName}
				disabled={!hasPermission('motherName')}
				onChange={(e) => updateMartyr('motherName', e)}
			/>

			<AppDatepicker
				defaultValue={martyr.BD_Date}
				label="تاریخ تولد"
				disabled={!hasPermission('BD_Date')}
				onChange={(e) => updateMartyr('BD_Date', e)}
			/>

			<AppSwitchButton
				label="جنسیت"
				options={genderSwitchOptions}
				defaultValue={martyr.gender}
				disabled={!hasPermission('gender')}
				onChange={(e) => updateMartyr('gender', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
