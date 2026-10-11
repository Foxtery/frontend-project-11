import { subscribe, snapshot } from 'valtio/vanilla'

const initView = (state, i18nInstance) => {
  const form = document.getElementById('form')
  const adressInput = document.getElementById('rss-url')
  const button = document.getElementById('add-button')
  const feedbackElement = document.getElementById('Error')
  const feedsHeading = document.getElementById('feeds-heading')
  const feedsList = document.getElementById('feeds-list')
  const postsHeading = document.getElementById('posts-heading')
  const postsList = document.getElementById('posts-list')

  let previousFormState = state.formState

  feedsHeading.textContent = i18nInstance.t('headings.feeds')
  postsHeading.textContent = i18nInstance.t('headings.posts')

  const renderForm = (currentState) => {
    const isBusy = currentState.formState === 'validating'
      || currentState.formState === 'loading'

    button.disabled = isBusy
    adressInput.disabled = isBusy

    if (currentState.formState === 'loading') {
      feedbackElement.textContent = i18nInstance.t('messages.loading')
    } else if (currentState.formState === 'success') {
      feedbackElement.textContent = i18nInstance.t('messages.success')
    } else if (currentState.formState === 'error') {
      feedbackElement.textContent = i18nInstance.t(currentState.errorKey)
    } else {
      feedbackElement.textContent = ''
    }

    if (currentState.formState === 'error') {
      adressInput.classList.remove(
        'border-gray-300',
        'focus:border-blue-600',
        'focus:ring-blue-600',
      )
      adressInput.classList.add(
        'border-red-600',
        'focus:border-red-600',
        'focus:ring-red-600',
      )
    } else {
      adressInput.classList.remove(
        'border-red-600',
        'focus:border-red-600',
        'focus:ring-red-600',
      )
      adressInput.classList.add(
        'border-gray-300',
        'focus:border-blue-600',
        'focus:ring-blue-600',
      )
    }

    if (
      currentState.formState === 'success'
      && previousFormState !== 'success'
    ) {
      form.reset()
      adressInput.focus()
    }

    previousFormState = currentState.formState
  }

  const renderFeeds = (feeds) => {
    feedsList.replaceChildren()
    feeds.forEach((feed) => {
        const listElement = document.createElement('li')
        const titleElement = document.createElement('h3')
        const descriptionElement = document.createElement('p')
        titleElement.textContent = feed.title
        descriptionElement.textContent = feed.description
        listElement.append(titleElement)
        listElement.append(descriptionElement)
        feedsList.append(listElement)
    })
  }

  const renderPosts = (posts) => {
    postsList.replaceChildren()
    posts.forEach((post) => {
      const postElement = document.createElement('li')
      const linkElement = document.createElement('a')
      linkElement.textContent = post.title
      linkElement.href = post.link
      postElement.append(linkElement)
      postsList.append(postElement)
    })
   }

   const render = (currentState) => {
    const feeds = currentState.feeds
    const posts = currentState.posts
    renderForm(currentState)
    renderFeeds(feeds)
    renderPosts(posts)
   }

  subscribe(state, () => {
    render(snapshot(state))
  })

  render(snapshot(state))
}

export default initView