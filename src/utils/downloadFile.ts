const fileTypes = {
	zip: 'application/zip',
	pdf: 'application/pdf',
	excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export default function downloadFile(
	fileName: string,
	file: ArrayBuffer | Blob,
	fileType: keyof typeof fileTypes
) {
	const blobFile = new Blob([file], { type: fileTypes[fileType] })

	const url = URL.createObjectURL(blobFile)

	if (fileType === 'pdf') {
		window.open(url)
		return
	}

	const link = document.createElement('a')
	link.href = url
	link.download = fileName
	document.body.appendChild(link)

	link.click()
	URL.revokeObjectURL(url)
	document.body.removeChild(link)
}
