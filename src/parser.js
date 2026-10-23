const parserRss = (xmlString) => {
    const domParser = new DOMParser()
    const xmlDocument = domParser.parseFromString(xmlString, 'application/xml')
    const errorNode = xmlDocument.querySelector("parsererror")
    const error = new Error('Parse Error')
    error.name = 'ParseError'

    if (errorNode) {
        throw error
    }
    
    const root = xmlDocument.documentElement
    if (!root || root.tagName !== 'rss') {
        throw error
    }

    const channel = root.querySelector(':scope > channel')
    if (!channel) {
        throw error
    }

    const titleNode = channel.querySelector(':scope > title')
    const descriptionNode = channel.querySelector(':scope > description')

    if (!titleNode || !descriptionNode) {
        throw error
    }

    const title = titleNode.textContent.trim()
    const description = descriptionNode.textContent.trim()
    const feed = {title, description}

    const itemNodes = channel.querySelectorAll(':scope > item')
    const items = Array.from(itemNodes)
    const posts = items
    .map((item) => {
        const itemTitle = item.querySelector(':scope > title')
        const itemLink = item.querySelector(':scope > link')
        const itemDescription = item.querySelector(':scope > description')

        if (!itemTitle || !itemLink) {
            return null
        }

        const title = itemTitle.textContent.trim()
        const link = itemLink.textContent.trim()
        const description = itemDescription ? itemDescription.textContent.trim() : ''

        if (!title || !link) {
            return null
        }

        return { title, link, description }
    })
    .filter((post) => post !== null)

    return {feed, posts}
}

export default parserRss
