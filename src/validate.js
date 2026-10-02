import { string, setLocale } from 'yup'

setLocale({
    mixed: {
        required: 'errors.required',
        notOneOf: 'errors.duplicate'
    },
    string: {
        url: 'errors.invalidUrl'
    }
})

const validateUrl = (url, listOfUrls) => {
    const trimmedUrl = url.trim()
    const urlSchema = string()
    .required()
    .url()
    .notOneOf(listOfUrls)
    return urlSchema.validate(trimmedUrl)
}

export default validateUrl