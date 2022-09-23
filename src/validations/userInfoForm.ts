import { object, string } from 'yup'

const mobileRegex = /^(\+98|0)?9\d{9}$/g

export default object().shape({
	name: string().min(2, 'نام معتبر نیست').required('نام را وارد کنید'),
	mobile: string()
		.matches(mobileRegex, 'نام کاربری معتبر نیست')
		.required('نام کاربری را وارد کنید'),
	password: string().min(6, 'رمز عبور کوتاه است.'),
})
