// ? react
import { useEffect, useState } from 'react'
// ? utils
import { debounce } from 'lodash'
// ? components
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

type Option = Record<string, any>
interface Props {
	label: string
	options: Option[]
	multiple?: boolean
	disabled?: boolean
	className?: string
	defaultValue?: Option
	noOptionsText?: string
	fetchLoading?: boolean
	disableClearable?: boolean
	onChange: (value?: any) => void
	onSendRequest?: (value: any) => void
	optionLabel: (options: Option) => string
}
export default function AppAutoComplete({
	label,
	options,
	multiple,
	disabled,
	onChange,
	className,
	optionLabel,
	defaultValue,
	fetchLoading,
	onSendRequest,
	disableClearable,
	noOptionsText = 'جستجو نتیجه ای نداشت...',
}: Props) {
	const [query, setQuery] = useState('')
	const [openOptions, setOpenOptions] = useState(false)
	// const [values, setValues] = useState([] as any[])

	const loading = openOptions && fetchLoading

	const onUpdateQuery = debounce((newVal: string) => setQuery(newVal), 500)

	useEffect(() => {
		if (!query.length) return
		if (onSendRequest) onSendRequest(query)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query])

	return (
		<Autocomplete
			size="small"
			loading={loading}
			options={options}
			multiple={multiple}
			disabled={disabled}
			open={openOptions}
			className={className}
			defaultValue={defaultValue}
			getOptionLabel={optionLabel}
			loadingText="در حال جستجو..."
			noOptionsText={noOptionsText}
			isOptionEqualToValue={() => true}
			disableClearable={disableClearable}
			onOpen={() => setOpenOptions(true)}
			onClose={() => setOpenOptions(false)}
			onChange={(event, newVal) => onChange(newVal)}
			onInputChange={(event, newVal) => onUpdateQuery(newVal)}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					variant="standard"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? <CircularProgress color="inherit" size={20} /> : null}
								{params.InputProps.endAdornment}
							</>
						),
					}}
				/>
			)}
		/>
	)
}
