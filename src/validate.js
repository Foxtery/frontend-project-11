import { string } from 'yup'

const validateUrl = (url, listOfUrls) => {
    const trimmedUrl = url.trim()
    const urlSchema = string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(listOfUrls, 'Данный URL уже добавлен')
    return urlSchema.validate(trimmedUrl)
}

export default validateUrl