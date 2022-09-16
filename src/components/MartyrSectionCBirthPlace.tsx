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

export default function MartyrSectionCBirthPlace() {
	const { user } = userStore()
	const { updateMartyr, martyr } = martyrsStore()
	const [cities, setCities] = useState([] as typeof citiesJson)
	const [citiesKey, setCitiesKey] = useState(new Date().getTime())

	const setState = (state?: typeof states[0]) => {
		updateMartyr('city', undefined)
		updateMartyr('defaultCity', undefined)
		setCitiesKey(new Date().getTime())
		if (state) {
			setCities(citiesJson.filter((c) => state.id === c.p_id))
		} else {
			setCities([])
		}
		updateMartyr('state', state?.name)
	}

	return (
		<MartyrSectionWrapper title="محل تولد">
			<AppAutoComplete
				options={states}
				onChange={setState}
				label="استان محل تولد"
				optionLabel={(op) => op.name}
				defaultValue={martyr.defaultState}
			/>

			<AppAutoComplete
				key={citiesKey}
				label="شهر محل تولد"
				options={cities}
				optionLabel={(op) => op.name}
				defaultValue={martyr.defaultCity}
				noOptionsText="ابتدا استان را انتخاب کنید."
				onChange={(e) => updateMartyr('city', e)}
			/>

			<TextField
				label="شهرستان محل تولد"
				variant="standard"
				defaultValue={martyr.county}
				onChange={(e) => updateMartyr('county', e)}
			/>

			<TextField
				label="روستای محل تولد"
				variant="standard"
				defaultValue={martyr.village}
				onChange={(e) => updateMartyr('village', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles