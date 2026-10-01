import './style.css'
import { proxy } from 'valtio/vanilla'
import validateUrl from './validate.js'
import initView from './view.js'

const state = proxy({
    acceptedUrls: [],
    formState: 'idle',
    errorMessage: ''
})

initView(state)

const form = document.getElementById('form')
form.addEventListener('submit', function (event) {
    event.preventDefault()
    if (state.formState === 'validating') {
        return
    }

    const formData = new FormData(form)
    const url = formData.get('url')
    state.formState = 'validating'
    state.errorMessage = ''

    validateUrl(url, state.acceptedUrls)
    .then((value) => {
        state.acceptedUrls.push(value)
        state.formState = 'success'
    })
    .catch((error) => {
        state.formState = 'error'
        state.errorMessage = error.message
    })
})
