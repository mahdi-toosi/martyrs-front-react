// ? react
import { ChangeEvent, useEffect, useState } from 'react'
// ? utils
import tw, { styled } from 'twin.macro'
import userStore from '@/stores/user'
import martyrsFields from '@/utils/data/martyrsFields.json'
import relativesFields from '@/utils/data/relativesFields.json'
import documentsFields from '@/utils/data/documentsFields.json'
// ? components
import Button from '@mui/material/Button'
import AppDialog from '@/components/AppDialog'
import Checkbox from '@mui/material/Checkbox'
// ? types

interface CBoxProps {
	label: string
	limitAccess: string[]
	accessKeyword: string
	onChange: (val: boolean, key: string) => void
}
function CBox({ label, limitAccess, accessKeyword, onChange }: CBoxProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked, accessKeyword)
	}

	return (
		<div>
			<Checkbox checked={!limitAccess.includes(accessKeyword)} onChange={handleChange} />
			<label htmlFor="id">{label}</label>
		</div>
	)
}

const headers = {
	esalat: 'اصالت',
	ettelaatEsargari: 'اطلاعات ایثارگری',
	ettelaatShenasnameii: 'اطلاعات شناسنامه ای',
	mahaleTadfin: 'محل تدفین',
	shahadat: 'شهادت',
	tovzihat: 'توضیحات',
	vaziatKhanevadegi: 'وضعیت خانوادگی',
}

type MartyrsFieldsList = { [key: string]: typeof martyrsFields }
export default function UserAccessibility() {
	const { userInfo, setUserInfo } = userStore()

	const [visible, setVisible] = useState(false)
	const [martyrsFieldsList, setMartyrsFieldsList] = useState<MartyrsFieldsList>({})
	const [allStatus, setAllStatus] = useState({ relatives: false, documents: false, martyrs: false })

	const toggleDialog = () => {
		setVisible((val) => !val)
	}

	const toggleAccess = (value: boolean, key: string) => {
		if (value) {
			setUserInfo({ limitAccess: userInfo.limitAccess.filter((v) => v !== key) })
		} else {
			setUserInfo({ limitAccess: [...userInfo.limitAccess, key] })
		}
	}

	const removeAllTheseFields = (fieldsList: { key: string }[]) => {
		const keyList = fieldsList.map((f) => f.key)
		setUserInfo({ limitAccess: userInfo.limitAccess.filter((v) => !keyList.includes(v)) })
	}

	const addAllTheseFields = (fieldsList: { key: string }[]) => {
		const keyList = fieldsList.map((f) => f.key)
		setUserInfo({ limitAccess: [...new Set(userInfo.limitAccess.concat(keyList))] })
	}

	const toggleAll = (value: boolean, key: 'relatives' | 'documents') => {
		if (key === 'relatives') {
			if (value) removeAllTheseFields(relativesFields)
			else addAllTheseFields(relativesFields)
			setAllStatus((s) => ({ ...s, relatives: value }))
		} else if (key === 'documents') {
			if (value) removeAllTheseFields(documentsFields)
			else addAllTheseFields(documentsFields)
			setAllStatus((s) => ({ ...s, documents: value }))
		}
	}

	const setMartyrsFields = () => {
		const obj = {} as { [key: string]: typeof martyrsFields }

		martyrsFields.forEach((f) => {
			if (!obj[f.category as string]) {
				obj[f.category as string] = []
			}
			obj[f.category as string].push(f)
		})

		setMartyrsFieldsList(obj)
	}

	const isAllOfItSelected = (fieldList: { key: string }[]) => {
		if (!userInfo.limitAccess) return false

		for (const field of fieldList) {
			if (userInfo.limitAccess.includes(field.key)) {
				return false
			}
		}

		return true
	}

	useEffect(() => {
		if (!martyrsFieldsList.ettelaatShenasnameii) setMartyrsFields()

		if (isAllOfItSelected(relativesFields)) setAllStatus((s) => ({ ...s, relatives: true }))
		else setAllStatus((s) => ({ ...s, relatives: false }))

		if (isAllOfItSelected(documentsFields)) setAllStatus((s) => ({ ...s, documents: true }))
		else setAllStatus((s) => ({ ...s, documents: false }))

		if (isAllOfItSelected(martyrsFields)) setAllStatus((s) => ({ ...s, martyrs: true }))
		else setAllStatus((s) => ({ ...s, martyrs: false }))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userInfo.limitAccess])

	return (
		<>
			<Button size="small" variant="contained" onClick={toggleDialog}>
				مدیریت دسترسی ها
			</Button>

			<AppDialog visible={visible} header="مدیریت دسترسی ها" onClose={toggleDialog}>
				<main>
					{Object.keys(martyrsFieldsList).map((k) => (
						<Section key={k}>
							<h3>{headers[k as keyof typeof headers]}</h3>
							<hr />

							{martyrsFieldsList[k].map((f) => (
								<CBox
									key={f.key}
									label={f.val}
									limitAccess={userInfo.limitAccess}
									accessKeyword={f.key}
									onChange={toggleAccess}
								/>
							))}
						</Section>
					))}

					<Section>
						<h3>
							<Checkbox
								checked={allStatus.relatives}
								onChange={(event) => toggleAll(event.target.checked, 'relatives')}
							/>
							وابستگان
						</h3>
						<hr />

						{relativesFields.map((f) => (
							<CBox
								key={f.key}
								label={f.val}
								limitAccess={userInfo.limitAccess}
								accessKeyword={f.key}
								onChange={toggleAccess}
							/>
						))}
					</Section>

					<Section>
						<h3>
							<Checkbox
								checked={allStatus.documents}
								onChange={(event) => toggleAll(event.target.checked, 'documents')}
							/>
							اسناد
						</h3>
						<hr />

						{documentsFields.map((f) => (
							<CBox
								key={f.key}
								label={f.val}
								limitAccess={userInfo.limitAccess}
								accessKeyword={f.key}
								onChange={toggleAccess}
							/>
						))}
					</Section>
				</main>
			</AppDialog>
		</>
	)
}

const Section = styled.section(() => [
	tw`flex flex-wrap items-center mb-5`,
	{ h3: tw`w-full font-bold text-lg`, hr: tw`w-full mt-1 mb-2`, div: tw`w-52` },
])
