import { ChangeEvent, useState } from 'react'
import ReactQuill from 'react-quill'
import { styled } from 'twin.macro'
import 'react-quill/dist/quill.snow.css'

type Payload = ChangeEvent<{ value: string }>

interface Props {
	defaultValue?: string
	onChange?: (payload: Payload) => void
}
export default function TextEditor({ defaultValue, onChange }: Props) {
	const [value, setValue] = useState(defaultValue || '')

	const handleChange = (value: string) => {
		setValue(value)
		if (onChange) onChange({ target: { value } } as Payload)
	}
	const modules = {
		toolbar: {
			container: [
				['blockquote', 'italic', 'underline', 'bold'], // toggled buttons
				[{ background: [] }, { color: [] }],
				[{ header: [2, 3, false] }],
				['clean'],
			],
		},
	}
	return (
		<QuillWrapper>
			<ReactQuill theme="snow" value={value} modules={modules} onChange={handleChange} />
		</QuillWrapper>
	)
}

// ? styles
const QuillWrapper = styled.div`
	.ql-container {
		border-radius: 0 0 8px 8px;
	}

	.ql-toolbar {
		text-align: center;
		border-radius: 8px 8px 0 0;
		border-bottom: 0 !important;
	}

	.ql-editor {
		direction: rtl;
		line-height: 2;
		font-size: 15px;
		text-align: right;
		min-height: 180px;
		font-family: 'iranSans';
	}

	.ql-picker {
		text-align: left;
	}
`
