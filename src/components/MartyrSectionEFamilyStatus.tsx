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
	const { user } = userStore()
	const { updateMartyr, martyr } = martyrsStore()

	return (
		<MartyrSectionWrapper title="وضعیت خانوادگی">
			<AppDropdown
				label="تحصیلات"
				options={educationDegrees}
				defaultValue={martyr.education}
				onChange={(e) => updateMartyr('education', e)}
			/>

			<TextField
				label="شغل"
				variant="standard"
				defaultValue={martyr.job}
				onChange={(e) => updateMartyr('job', e)}
			/>

			<TextField
				label="دین"
				variant="standard"
				defaultValue={martyr.religion}
				onChange={(e) => updateMartyr('religion', e)}
			/>

			<TextField
				label="مذهب"
				variant="standard"
				defaultValue={martyr.sect}
				onChange={(e) => updateMartyr('religion', e)}
			/>

			<AppSwitchButton
				label="وضعیت تأهل"
				options={marriedOptions}
				defaultValue={martyr.married}
				onChange={(e) => updateMartyr('married', e)}
			/>

			<AppDatepicker
				defaultValue={martyr.M_Date}
				label="تاریخ ازدواج"
				onChange={(e) => updateMartyr('M_Date', e)}
			/>

			<TextField
				label="تعداد فرزند"
				variant="standard"
				defaultValue={martyr.children_num}
				onChange={(e) => updateMartyr('children_num', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
