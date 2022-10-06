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

export default function MartyrSectionHBurialPlace() {
	const { hasPermission } = userStore()
	const { updateMartyr, martyr } = martyrsStore()
	const [cities, setCities] = useState([] as typeof citiesJson)
	const [citiesKey, setCitiesKey] = useState(new Date().getTime())

	const setState = (state?: typeof states[0]) => {
		updateMartyr('burial_city', undefined)
		updateMartyr('defaultBurialCity', undefined)
		setCitiesKey(new Date().getTime())
		if (state) {
			setCities(citiesJson.filter((c) => state.id === c.p_id))
		} else {
			setCities([])
		}
		updateMartyr('burial_state', state?.name)
	}

	return (
		<MartyrSectionWrapper title="محل تدفین">
			<AppAutoComplete
				options={states}
				onChange={setState}
				label="استان محل تدفین"
				optionLabel={(op) => op.name}
				defaultValue={martyr.defaultBurialState}
				disabled={!hasPermission('defaultBurialState')}
			/>

			<AppAutoComplete
				key={citiesKey}
				label="شهر محل تدفین"
				options={cities}
				optionLabel={(op) => op.name}
				defaultValue={martyr.defaultBurialCity}
				disabled={!hasPermission('defaultBurialCity')}
				noOptionsText="ابتدا استان محل تدفین را انتخاب کنید."
				onChange={(e) => updateMartyr('burial_city', e)}
			/>

			<TextField
				variant="standard"
				label="شهرستان محل تدفین"
				defaultValue={martyr.burial_county}
				disabled={!hasPermission('burial_county')}
				onChange={(e) => updateMartyr('burial_county', e)}
			/>

			<TextField
				variant="standard"
				label="روستای محل تدفین"
				defaultValue={martyr.burial_village}
				disabled={!hasPermission('burial_village')}
				onChange={(e) => updateMartyr('burial_village', e)}
			/>

			<TextField
				label="محل تدفین"
				variant="standard"
				defaultValue={martyr.burial_loc}
				disabled={!hasPermission('burial_loc')}
				onChange={(e) => updateMartyr('burial_loc', e)}
			/>

			<TextField
				label="قطعه"
				variant="standard"
				defaultValue={martyr.burial_piece}
				disabled={!hasPermission('burial_piece')}
				onChange={(e) => updateMartyr('burial_piece', e)}
			/>

			<TextField
				label="بلوک"
				variant="standard"
				defaultValue={martyr.burial_block}
				disabled={!hasPermission('burial_block')}
				onChange={(e) => updateMartyr('burial_block', e)}
			/>

			<TextField
				label="شماره"
				variant="standard"
				defaultValue={martyr.burial_num}
				disabled={!hasPermission('burial_num')}
				onChange={(e) => updateMartyr('burial_num', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
