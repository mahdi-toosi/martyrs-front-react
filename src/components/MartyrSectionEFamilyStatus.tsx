// ? utils
import userStore from '@/stores/user'
import martyrsStore, { educationDegrees, marriedOptions } from '@/stores/martyrs'
// ? components
import AppDropdown from './AppDropDown'
import TextField from '@mui/material/TextField'
import AppDatePicker from '@/components/AppDatePicker'
import AppSwitchButton from '@/components/AppSwitchButton'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'

export default function MartyrSectionEFamilyStatus() {
	const { hasPermission } = userStore()
	const { updateMartyr, initMartyr } = martyrsStore()

	return (
		<MartyrSectionWrapper title="وضعیت خانوادگی">
			<AppDropdown
				label="تحصیلات"
				options={educationDegrees}
				defaultValue={initMartyr.education}
				disabled={!hasPermission('education')}
				onChange={(e) => updateMartyr('education', e)}
			/>

			<TextField
				label="شغل"
				variant="standard"
				defaultValue={initMartyr.job}
				disabled={!hasPermission('job')}
				onChange={(e) => updateMartyr('job', e)}
			/>

			<TextField
				label="دین"
				variant="standard"
				defaultValue={initMartyr.religion}
				disabled={!hasPermission('religion')}
				onChange={(e) => updateMartyr('religion', e)}
			/>

			<TextField
				label="مذهب"
				variant="standard"
				defaultValue={initMartyr.sect}
				disabled={!hasPermission('sect')}
				onChange={(e) => updateMartyr('religion', e)}
			/>

			<AppSwitchButton
				label="وضعیت تأهل"
				options={marriedOptions}
				defaultValue={initMartyr.married}
				disabled={!hasPermission('married')}
				onChange={(e) => updateMartyr('married', e)}
			/>

			<AppDatePicker
				label="تاریخ ازدواج"
				defaultValue={initMartyr.M_Date}
				disabled={!hasPermission('M_Date')}
				onChange={(e) => updateMartyr('M_Date', e)}
			/>

			<TextField
				label="تعداد فرزند"
				variant="standard"
				defaultValue={initMartyr.children_num}
				disabled={!hasPermission('children_num')}
				onChange={(e) => updateMartyr('children_num', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
