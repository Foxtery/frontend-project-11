import errors from "./locales/ru.js"
import i18next from "i18next"

const initI18n = () => {
    const i18nInstance = i18next.createInstance()
    return i18nInstance.init({
        lng: 'ru',
        fallbackLng: 'ru',
        resources: {
            ru: {
                translation: {
                    errors: errors
                }
            }
        }
    })
    .then(() => { return i18nInstance})
}

export default initI18n