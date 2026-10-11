import './style.css'
import { proxy } from 'valtio/vanilla'
import validateUrl from './validate.js'
import initView from './view.js'
import initI18n from './i18n.js'
import getRSSUrl from './api.js'
import parserRss from './parser.js'
import axios from 'axios'

const startApp = (i18nInstance) => {
    const state = proxy({
        formState: 'idle',
        errorKey: null,
        feeds: [],
        posts: [],
    })

    initView(state, i18nInstance)

    const form = document.getElementById('form')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        if (state.formState === 'validating' || state.formState === 'loading') {
            return
        }

        const formData = new FormData(form)
        const url = formData.get('url')
        state.formState = 'validating'
        state.errorKey = null

        const acceptedUrls = state.feeds.map((item) => item.url)

        let validatedUrl

        validateUrl(url, acceptedUrls)
        .then((value) => {
            validatedUrl = value
            state.formState = 'loading'
            return getRSSUrl(validatedUrl)
        })
        .then(parserRss)
        .then(parsedData => {
            const feedId = crypto.randomUUID()
            const feed = {id: feedId, url: validatedUrl, title: parsedData.feed.title, description: parsedData.feed.description}
            const posts = parsedData.posts.map((post) => {
                return {id: crypto.randomUUID(), feedId: feedId, title: post.title, link: post.link }
            })
            state.feeds.push(feed)
            state.posts.push(...posts)
            state.formState = 'success'
        })
        .catch((error) => {
            state.formState = 'error'
            if (error.name === 'ValidationError') {
                state.errorKey = error.message
            }
            else if (error.name === 'ParseError') {
                state.errorKey = 'errors.invalidRss'
            }
            else if(error.name === 'DownloadError' || axios.isAxiosError(error)) {
                state.errorKey = 'errors.network'
            }
            else {
                state.errorKey = 'errors.unexpected'
                console.error(error)
            }
        })
        
    })
}

initI18n().then(startApp).catch((error) => console.error(error))
