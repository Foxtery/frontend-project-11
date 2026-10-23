import getRSSUrl from "./api.js"
import parserRss from "./parser.js"

const updateInterval = 5000

const getNewPosts = (incomingPosts, savedPosts) => {
    const savedLinks = savedPosts.map((post) => post.link)
    const seenLinks = new Set(savedLinks)
    return incomingPosts.filter((post) => {
        if (seenLinks.has(post.link)) {
            return false
        }
        else {
            seenLinks.add(post.link)
            return true
        }
    })
}

const updateFeed = (feed, state, createId) => {
    return getRSSUrl(feed.url)
    .then(parserRss)
    .then(parsedData => {
        const savedPosts = state.posts.filter((post) => post.feedId === feed.id)
        const newPosts = getNewPosts(parsedData.posts, savedPosts)
        if (newPosts.length === 0) {
            return
        }
        else {
            const postsToAdd = newPosts.map((post) => {
                return {
                    id: createId(),
                    feedId: feed.id,
                    title: post.title,
                    link: post.link,
                    description: post.description,
                }
            })
            state.posts.unshift(...postsToAdd)
        }
    })
}

const startFeedUpdates = (feed, state, createId) => {
    const check = () => {
        return updateFeed(feed, state, createId)
        .catch((error) => {
            console.error(error)
        })
        .finally(() => {
    setTimeout(check, updateInterval)
        })
    }
    setTimeout(check, updateInterval)
}

export default startFeedUpdates
