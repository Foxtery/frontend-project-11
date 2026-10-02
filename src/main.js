import './style.css'
import { proxy } from 'valtio/vanilla'
import validateUrl from './validate.js'
import initView from './view.js'
import initI18n from './i18n.js'

const startApp = (i18nInstance) => {
    const state = proxy({
        acceptedUrls: [],
        formState: 'idle',
        errorKey: null
    })

    initView(state, i18nInstance)

    const form = document.getElementById('form')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        if (state.formState === 'validating') {
            return
        }

        const formData = new FormData(form)
        const url = formData.get('url')
        state.formState = 'validating'
        state.errorKey = null

        validateUrl(url, state.acceptedUrls)
        .then((value) => {
            state.acceptedUrls.push(value)
            state.formState = 'success'
        })
        .catch((error) => {
            state.formState = 'error'
            state.errorKey = error.message
        })
    })
}

initI18n().then(startApp).catch((error) => console.error(error))
