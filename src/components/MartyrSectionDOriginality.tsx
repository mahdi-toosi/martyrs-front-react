// ? react
import { useState } from 'react'
// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import states from '@/utils/data/states.json'
import citiesJson from '@/utils/data/cities.json'
// ? components
import TextField from '@mui/material/TextField'
import AppAutoComplete from '@/components/AppAutoComplete'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'

export default function MartyrSectionDOriginality() {
	const { hasPermission } = userStore()
	const { updateMartyr, martyr } = martyrsStore()
	const [cities, setCities] = useState([] as typeof citiesJson)
	const [citiesKey, setCitiesKey] = useState(new Date().getTime())

	const setOriginalityState = (state?: typeof states[0]) => {
		updateMartyr('originality_city', undefined)
		updateMartyr('defaultOriginalityCity', undefined)
		setCitiesKey(new Date().getTime())
		if (state) {
			setCities(citiesJson.filter((c) => state.id === c.p_id))
		} else {
			setCities([])
		}
		updateMartyr('originality_state', state?.name)
	}

	return (
		<MartyrSectionWrapper title="اصالت">
			<AppAutoComplete
				options={states}
				label="اصالت استان"
				onChange={setOriginalityState}
				optionLabel={(op) => op.name}
				defaultValue={martyr.defaultOriginalityState}
				disabled={!hasPermission('defaultOriginalityState')}
			/>

			<AppAutoComplete
				key={citiesKey}
				options={cities}
				label="اصالت شهر"
				optionLabel={(op) => op.name}
				defaultValue={martyr.defaultOriginalityCity}
				noOptionsText="ابتدا اصالت استان را انتخاب کنید."
				disabled={!hasPermission('defaultOriginalityCity')}
				onChange={(e) => updateMartyr('originality_city', e)}
			/>

			<TextField
				label="اصالت شهرستان"
				variant="standard"
				defaultValue={martyr.originality_county}
				disabled={!hasPermission('originality_county')}
				onChange={(e) => updateMartyr('originality_county', e)}
			/>

			<TextField
				label="اصالت روستا"
				variant="standard"
				defaultValue={martyr.originality_village}
				disabled={!hasPermission('originality_village')}
				onChange={(e) => updateMartyr('originality_village', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
