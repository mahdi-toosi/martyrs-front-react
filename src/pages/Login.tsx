// ? react
import { history as router } from '@/router'
//  ? components
import Input from '@mui/material/Input'
import { LoadingButton } from '@mui/lab'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography/Typography'
// ? utils
import tw from 'twin.macro'
import { useFormik } from 'formik'
import userStore from '@/stores/user'
import { useRepositories } from '@/repositories'
import loginFormValidations from '@/validations/loginForm'
// ? assets
import logo from '@/assets/images/logo.png'
// ? types
import type { LoginPayload } from '@/repositories/auth/types'

interface LoginFrom extends LoginPayload {
	showPassword: boolean
}

export default function Login() {
	const { setUser } = userStore()
	const { auth } = useRepositories()

	const login = async (values: LoginFrom) => {
		const result = await auth.login(values)
		if (!result) return

		setUser(result.user)
		sessionStorage.setItem('token', result.accessToken)
		router.push('/')
	}

	const {
		errors,
		touched,
		setValues,
		isSubmitting,
		handleSubmit,
		handleChange,
		handleBlur,
		values: loginForm,
	} = useFormik<LoginFrom>({
		initialValues: {
			mobile: '',
			password: '',
			strategy: 'local',
			showPassword: false,
		},
		validationSchema: loginFormValidations,
		onSubmit: login,
	})

	const handleClickShowPassword = () => {
		setValues({
			...loginForm,
			showPassword: !loginForm.showPassword,
		})
	}

	return (
		<PageWrapper>
			<FormWrapper>
				<img src={logo} alt="logo" />

				<Typography variant="subtitle1" className="text-white text-center">
					سامانه جامع اطلاعات و اسناد <br />
					شهدای دیار سربداران
				</Typography>

				<Form
					onSubmit={(e) => {
						e.preventDefault()
						handleSubmit()
					}}
				>
					<TextField
						label="نام کاربری"
						className="w-full"
						name="mobile"
						error={Boolean(errors.mobile && touched.mobile)}
						helperText={touched.mobile && errors?.mobile}
						onBlur={handleBlur}
						variant="standard"
						onChange={handleChange}
					/>

					<FormControl variant="standard">
						<InputLabel htmlFor="pass" error={Boolean(errors.password && touched.password)}>
							رمز عبور
						</InputLabel>
						<Input
							id="pass"
							name="password"
							error={Boolean(errors.password && touched.password)}
							type={loginForm.showPassword ? 'text' : 'password'}
							value={loginForm.password}
							onBlur={handleBlur}
							onChange={handleChange}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
									>
										{loginForm.showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						{errors?.password && touched.password && (
							<Typography
								variant="caption"
								color="red"
								marginBottom="0px"
								gutterBottom
								component="p"
							>
								{errors?.password}
							</Typography>
						)}
					</FormControl>

					<LoadingButton
						loading={isSubmitting}
						variant="contained"
						type="submit"
						className="w-full mt-4"
					>
						ورود
					</LoadingButton>
				</Form>
			</FormWrapper>
		</PageWrapper>
	)
}

// ? styles
const PageWrapper = tw.div`flex justify-center items-center min-h-screen bg-gray-500`
const FormWrapper = tw.section`flex flex-col items-center gap-4`
const Form = tw.form`flex flex-col gap-4 items-center`
