import axios from "axios"

const getRSSUrl = (adress) => {
    return axios.get('https://allorigins.hexlet.app/get', { params: { url: adress, disableCache: true }, timeout: 15000} )
    .then((response) => {
        const data = response.data
        const error = new Error('Failed to download RSS')
        error.name = 'DownloadError'

        if (data == null || typeof data !== 'object' || typeof data.contents !== 'string') {
            throw error
        }

        if (data.status != null) {
            const status = data.status
            if (
                typeof status !== 'object'
                || status.error != null
                || typeof status.http_code !== 'number'
                || status.http_code < 200
                || status.http_code > 299
            ) {
                throw error
            }
        }

        return data.contents
    })
        
}

export default getRSSUrl
