import { object, string } from 'yup'

const mobileRegex = /^(\+98|0)?9\d{9}$/g

export default object().shape({
	mobile: string()
		.matches(mobileRegex, 'نام کاربری معتبر نیست')
		.required('نام کاربری را وارد کنید'),
	password: string().min(6, 'رمز عبور کوتاه است.').required('رمز عبور را وارد کنید'),
})
