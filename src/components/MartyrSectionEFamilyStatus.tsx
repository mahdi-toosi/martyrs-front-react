// ? utils
import userStore from '@/stores/user'
import martyrsStore, { educationDegrees, marriedOptions } from '@/stores/martyrs'
// ? components
import AppDropdown from './AppDropDown'
import TextField from '@mui/material/TextField'
import AppDatepicker from '@/components/AppDatepicker'
import AppSwitchButton from '@/components/AppSwitchButton'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'

export default function MartyrSectionEFamilyStatus() {
	const { hasPermission } = userStore()
	const { updateMartyr, martyr } = martyrsStore()

	return (
		<MartyrSectionWrapper title="وضعیت خانوادگی">
			<AppDropdown
				label="تحصیلات"
				options={educationDegrees}
				defaultValue={martyr.education}
				disabled={!hasPermission('education')}
				onChange={(e) => updateMartyr('education', e)}
			/>

			<TextField
				label="شغل"
				variant="standard"
				defaultValue={martyr.job}
				disabled={!hasPermission('job')}
				onChange={(e) => updateMartyr('job', e)}
			/>

			<TextField
				label="دین"
				variant="standard"
				defaultValue={martyr.religion}
				disabled={!hasPermission('religion')}
				onChange={(e) => updateMartyr('religion', e)}
			/>

			<TextField
				label="مذهب"
				variant="standard"
				defaultValue={martyr.sect}
				disabled={!hasPermission('sect')}
				onChange={(e) => updateMartyr('religion', e)}
			/>

			<AppSwitchButton
				label="وضعیت تأهل"
				options={marriedOptions}
				defaultValue={martyr.married}
				disabled={!hasPermission('married')}
				onChange={(e) => updateMartyr('married', e)}
			/>

			<AppDatepicker
				label="تاریخ ازدواج"
				defaultValue={martyr.M_Date}
				disabled={!hasPermission('M_Date')}
				onChange={(e) => updateMartyr('M_Date', e)}
			/>

			<TextField
				label="تعداد فرزند"
				variant="standard"
				defaultValue={martyr.children_num}
				disabled={!hasPermission('children_num')}
				onChange={(e) => updateMartyr('children_num', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
