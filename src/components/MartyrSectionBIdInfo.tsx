// ? utils
import userStore from '@/stores/user'
import martyrsStore, { genderSwitchOptions } from '@/stores/martyrs'
// ? components
import TextField from '@mui/material/TextField'
import AppDatePicker from '@/components/AppDatePicker'
import AppSwitchButton from '@/components/AppSwitchButton'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'

export default function MartyrSectionBIdInfo() {
	const { hasPermission } = userStore()
	const { updateMartyr, initMartyr } = martyrsStore()

	return (
		<MartyrSectionWrapper title="اطلاعات شناسنامه ای">
			<TextField
				label="نام"
				variant="standard"
				defaultValue={initMartyr.name}
				disabled={!hasPermission('name')}
				onChange={(e) => updateMartyr('name', e)}
			/>

			<TextField
				label="نام خانوادگی"
				variant="standard"
				defaultValue={initMartyr.lastName}
				disabled={!hasPermission('lastName')}
				onChange={(e) => updateMartyr('lastName', e)}
			/>

			<TextField
				label="شهرت، لقب"
				variant="standard"
				defaultValue={initMartyr.title}
				disabled={!hasPermission('title')}
				onChange={(e) => updateMartyr('title', e)}
			/>

			<TextField
				label="نام پدر"
				variant="standard"
				defaultValue={initMartyr.fatherName}
				disabled={!hasPermission('fatherName')}
				onChange={(e) => updateMartyr('fatherName', e)}
			/>

			<TextField
				label="نام مادر"
				variant="standard"
				defaultValue={initMartyr.motherName}
				disabled={!hasPermission('motherName')}
				onChange={(e) => updateMartyr('motherName', e)}
			/>

			<AppDatePicker
				defaultValue={initMartyr.BD_Date}
				label="تاریخ تولد"
				disabled={!hasPermission('BD_Date')}
				onChange={(e) => updateMartyr('BD_Date', e)}
			/>

			<AppSwitchButton
				label="جنسیت"
				options={genderSwitchOptions}
				defaultValue={initMartyr.gender}
				disabled={!hasPermission('gender')}
				onChange={(e) => updateMartyr('gender', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
