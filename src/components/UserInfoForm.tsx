// ? react
import { useState } from 'react'
import { history as router } from '@/router'
// ? utils
import { useFormik } from 'formik'
import tw, { styled } from 'twin.macro'
import userStore from '@/stores/user'
import { jalaliDate } from '@/utils/day'
import { useRepositories } from '@/repositories'
import userInfoFormValidations from '@/validations/userInfoForm'
// ? components
import Input from '@mui/material/Input'
import { LoadingButton } from '@mui/lab'
import TextField from '@mui/material/TextField'
import UserAccessibility from './UserAccessibility'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
// ? types
import type { User } from '@/repositories/users/types'
import { useParams } from 'react-router-dom'

export default function UserInfoForm() {
	const { id } = useParams()
	const { users } = useRepositories()
	const { user: storedUser, userInfo, setUserInfo } = userStore()

	const [removeLoading, setRemoveLoading] = useState(false)

	const storeUser = async (user: User) => {
		const result = await users.update({ ...user, limitAccess: userInfo.limitAccess })
		if (!result) return

		setUserInfo(result)
	}

	const {
		errors,
		touched,
		setValues,
		isSubmitting,
		handleSubmit,
		handleChange,
		values: userForm,
	} = useFormik<User>({
		initialValues: userInfo,
		validationSchema: userInfoFormValidations,
		onSubmit: storeUser,
	})

	const handleClickShowPassword = () => {
		setValues({
			...userForm,
			showPassword: !userForm.showPassword,
		})
	}

	const onDelete = async () => {
		setRemoveLoading(true)
		const result = await users.delete(userInfo.id)
		setRemoveLoading(false)
		if (result) router.push('/users')
	}

	return (
		<Form onSubmit={handleSubmit} autoComplete="off">
			<Typography variant="h5" component="h5">
				اطلاعات کاربر
			</Typography>
			<hr />

			<section className="__elements">
				<TextField
					label="نام و نام خانوادگی"
					variant="standard"
					name="name"
					onChange={handleChange}
					defaultValue={userInfo.name}
					helperText={errors?.name}
					error={Boolean(errors.name)}
				/>

				<TextField
					label="شماره موبایل/نام کاربری"
					variant="standard"
					name="mobile"
					onChange={handleChange}
					defaultValue={userInfo.mobile}
					helperText={errors?.mobile}
					error={Boolean(errors.mobile)}
				/>

				<TextField
					label="نام پایگاه/معرف"
					variant="standard"
					name="base"
					defaultValue={userInfo.base}
					onChange={handleChange}
				/>

				<FormControl variant="standard">
					<InputLabel htmlFor="pass" error={Boolean(errors.password && touched.password)}>
						تغییر رمز عبور
					</InputLabel>
					<Input
						id="pass"
						name="password"
						autoComplete="new-password"
						error={Boolean(errors.password)}
						type={userForm.showPassword ? 'text' : 'password'}
						defaultValue={userForm.password}
						onChange={handleChange}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
								>
									{userForm.showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					{errors?.password && (
						<Typography variant="caption" color="red" marginBottom="0px" gutterBottom component="p">
							{errors?.password}
						</Typography>
					)}
				</FormControl>

				<Typography variant="inherit" component="p">
					اولین ورود به سامانه: {jalaliDate(userForm.first_login, 'dateTime')}
				</Typography>

				<Typography variant="inherit" component="p">
					آخرین ورود به سامانه: {jalaliDate(userForm.present_lastDate, 'dateTime')}
				</Typography>
			</section>

			<section className="__buttons">
				{storedUser?.id !== Number(id) && (
					<LoadingButton
						loading={removeLoading}
						color="error"
						variant="contained"
						type="submit"
						onClick={onDelete}
					>
						حذف کاربر
					</LoadingButton>
				)}

				<UserAccessibility />

				<LoadingButton loading={isSubmitting} variant="contained" type="submit">
					ذخیره
				</LoadingButton>
			</section>
		</Form>
	)
}

const Form = styled.form(() => [
	tw`mt-10 mx-auto`,
	`max-width: 63rem;`,
	{
		hr: tw`mb-5 mt-2`,
		'.__elements': tw`flex flex-wrap gap-4 items-start`,
		'.__elements > div': tw`w-full md:w-60`,
		'.__buttons': tw`flex justify-end gap-4 mt-4`,
	},
])
