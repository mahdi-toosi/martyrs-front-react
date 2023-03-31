// ? react
import { ChangeEvent, useEffect, useRef, useState } from 'react'
// ? utils
import tw, { styled } from 'twin.macro'
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
// ? components
import TextField from '@mui/material/TextField'
import PortraitIcon from '@mui/icons-material/Portrait'

export default function MartyrSectionA() {
	const { hasPermission } = userStore()
	const { updateMartyr, martyr } = martyrsStore()

	const imageInput = useRef<null | HTMLInputElement>(null)
	const [selectedImage, setSelectedImage] = useState<undefined | Blob>()
	const [preview, setPreview] = useState<undefined | string>()

	const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedImage(undefined)
			return
		}
		setSelectedImage(e.target.files[0])
		updateMartyr('newAvatar', e.target.files[0])
	}

	useEffect(() => {
		if (!selectedImage) {
			setPreview(undefined)
			return
		}

		const objectUrl = URL.createObjectURL(selectedImage)
		setPreview(objectUrl)

		// eslint-disable-next-line consistent-return
		return () => URL.revokeObjectURL(objectUrl)
	}, [selectedImage])

	return (
		<section className="flex items-center gap-5">
			<ImageSection>
				{selectedImage || martyr.image ? (
					// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
					<img
						src={preview || `${import.meta.env.VITE_BASE_URL}${martyr.image}`}
						onClick={() => imageInput.current?.click()}
						alt="martyr pic"
					/>
				) : (
					hasPermission('image') && (
						<PortraitIcon className="__avatar_svg" onClick={() => imageInput.current?.click()} />
					)
				)}

				<input
					type="file"
					ref={imageInput}
					onChange={onSelectImage}
					accept="image/png,image/jpg,image/jpeg"
				/>
			</ImageSection>

			<ElementsWrapper>
				<TextField
					label="کد شهید"
					variant="standard"
					className="w-72"
					defaultValue={martyr.code}
					disabled={!hasPermission('code')}
					onChange={(e) => updateMartyr('code', e)}
				/>

				<TextField
					label="کد ملی"
					variant="standard"
					className="w-72"
					defaultValue={martyr.N_Code}
					disabled={!hasPermission('N_Code')}
					onChange={(e) => updateMartyr('N_Code', e)}
				/>

				<TextField
					label="کد ایثارگری"
					variant="standard"
					className="w-72"
					defaultValue={martyr.Sacrifice_Code}
					disabled={!hasPermission('Sacrifice_Code')}
					onChange={(e) => updateMartyr('N_Code', e)}
				/>

				<TextField
					label="شماره شناسنامه"
					variant="standard"
					className="w-72"
					defaultValue={martyr.BC_Code}
					disabled={!hasPermission('BC_Code')}
					onChange={(e) => updateMartyr('N_Code', e)}
				/>
			</ElementsWrapper>
		</section>
	)
}

// ? styles
const ElementsWrapper = tw.div`grid grid-cols-2 gap-x-6 gap-y-8`
const ImageSection = styled.div`
	input[type='file'] {
		display: none;
	}

	img {
		border-radius: 5px;
		cursor: pointer;
		margin: 0 auto;
		width: 6rem;
	}

	.__avatar_svg {
		width: 6rem;
		height: 6rem;
		cursor: pointer;
	}
`
