import axios from "axios"

const getRSSUrl = (adress) => {
    return axios.get('https://allorigins.hexlet.app/get', { params: { url: adress, disableCache: true }, timeout: 15000} )
    .then((response) => {
        const data = response.data
        const error = new Error('Failed to download RSS')
        error.name = 'DownloadError'
        if (data != null && typeof data === 'object' && data.status != null && typeof data.status === 'object') {
            if (data.status.error != null) {
                throw error
            }
            else if (data.status.http_code >= 200 && data.status.http_code <= 299 && typeof data.status.http_code === 'number') {
                if (typeof data.contents === 'string') {
                    return data.contents
                }
                else {
                    throw error
                }
            }
            else {
                throw error
            }
        }
        else {
            throw error
        }
    })
        
}

export default getRSSUrl