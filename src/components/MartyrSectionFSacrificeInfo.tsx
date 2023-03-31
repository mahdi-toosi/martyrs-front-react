// ? react
import { useState } from 'react'
// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import AppDropdown from './AppDropDown'
import TextField from '@mui/material/TextField'
import AppDatePicker from '@/components/AppDatePicker'
import AppAutoComplete from '@/components/AppAutoComplete'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'
// ? types
import type { TaxonomyRelation } from '@/repositories/taxonomies/types'

const dispatchers = [
	{ label: 'سپاه', value: 'سپاه' },
	{ label: 'ارتش', value: 'ارتش' },
	{ label: 'نیروی انظامی', value: 'نیروی انظامی' },
]

export default function MartyrSectionFSacrificeInfo() {
	const { hasPermission } = userStore()
	const { taxonomies } = useRepositories()
	const { updateMartyr, initMartyr } = martyrsStore()

	const [operations, setOperations] = useState([] as TaxonomyRelation[])
	const [loading, setLoading] = useState(false)

	const searchInOperations = async (name: string) => {
		setOperations([])

		setLoading(true)
		const result = await taxonomies.get({
			'name[$like]': `%${name}%`,
			type: 'operation',
		})
		setLoading(false)
		if (!result) return
		const options = result.data.map((operation) => ({ taxonomy: operation }))
		setOperations(options as TaxonomyRelation[])
	}

	return (
		<MartyrSectionWrapper title="اطلاعات ایثارگری">
			<AppDropdown
				options={dispatchers}
				label="سازمان اعزام کننده"
				defaultValue={initMartyr.dispatcher}
				disabled={!hasPermission('dispatcher')}
				onChange={(e) => updateMartyr('dispatcher', e)}
			/>

			<TextField
				variant="standard"
				label="یگان اعزام کننده"
				defaultValue={initMartyr.sendingUnit}
				disabled={!hasPermission('sendingUnit')}
				onChange={(e) => updateMartyr('sendingUnit', e)}
			/>

			<TextField
				label="گردان"
				variant="standard"
				defaultValue={initMartyr.unit}
				disabled={!hasPermission('unit')}
				onChange={(e) => updateMartyr('unit', e)}
			/>

			<TextField
				label="درجه"
				variant="standard"
				defaultValue={initMartyr.degree}
				disabled={!hasPermission('degree')}
				onChange={(e) => updateMartyr('degree', e)}
			/>

			<TextField
				label="وضعیت در سازمان"
				variant="standard"
				defaultValue={initMartyr.situationInUnit}
				disabled={!hasPermission('situationInUnit')}
				onChange={(e) => updateMartyr('children_num', e)}
			/>

			<AppDatePicker
				label="تاریخ اولین اعزام"
				defaultValue={initMartyr.DateOfFirstDispatch}
				disabled={!hasPermission('DateOfFirstDispatch')}
				onChange={(e) => updateMartyr('DateOfFirstDispatch', e)}
			/>

			<TextField
				label="سن در اولین اعزام"
				variant="standard"
				defaultValue={initMartyr.ageInFirstDispatch}
				disabled={!hasPermission('ageInFirstDispatch')}
				onChange={(e) => updateMartyr('ageInFirstDispatch', e)}
			/>

			<TextField
				label="تعداد اعزام ها"
				variant="standard"
				defaultValue={initMartyr.NumberOfDispatches}
				disabled={!hasPermission('NumberOfDispatches')}
				onChange={(e) => updateMartyr('NumberOfDispatches', e)}
			/>

			<TextField
				label="جمع حضور در جبهه به ماه"
				variant="standard"
				defaultValue={initMartyr.totalOfStayingInFront}
				disabled={!hasPermission('totalOfStayingInFront')}
				onChange={(e) => updateMartyr('totalOfStayingInFront', e)}
			/>

			<TextField
				label="آخرین مسئولیت"
				variant="standard"
				defaultValue={initMartyr.last_Resp}
				disabled={!hasPermission('last_Resp')}
				onChange={(e) => updateMartyr('last_Resp', e)}
			/>

			<AppAutoComplete
				multiple
				options={operations}
				className="w-full"
				fetchLoading={loading}
				label="عملیات های حضور داشته"
				onSendRequest={searchInOperations}
				defaultValue={initMartyr.defaultOperations}
				optionLabel={(op) => op.taxonomy?.name}
				disabled={!hasPermission('defaultOperations')}
				onChange={(e) => updateMartyr('operations', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
