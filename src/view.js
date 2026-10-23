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
  const modal = document.getElementById('post-preview')
  const modalTitle = document.getElementById('modal-title')
  const modalBody = modal.querySelector('[data-test="modal-body"]')
  const readFullLink = document.getElementById('modal-read-full')
  const closeButton = document.getElementById('modal-close')

  let previousFormState = state.formState
  let previousSelectedPostId = null

  feedsHeading.textContent = i18nInstance.t('headings.feeds')
  postsHeading.textContent = i18nInstance.t('headings.posts')
  readFullLink.textContent = i18nInstance.t('actions.readFull')
  closeButton.textContent = i18nInstance.t('actions.close')

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

  const renderPosts = (posts, seenPostIds) => {
    postsList.replaceChildren()
    posts.forEach((post) => {
      const isSeen = seenPostIds.includes(post.id)
      const postElement = document.createElement('li')
      postElement.className = 'flex items-start justify-between gap-4'

      const linkElement = document.createElement('a')
      linkElement.textContent = post.title
      linkElement.href = post.link
      linkElement.dataset.id = post.id
      linkElement.dataset.seen = String(isSeen)
      linkElement.className = 'min-w-0 break-words text-blue-700 hover:underline'
      linkElement.classList.add(isSeen ? 'font-normal' : 'font-bold')

      const previewButton = document.createElement('button')
      previewButton.type = 'button'
      previewButton.textContent = i18nInstance.t('actions.preview')
      previewButton.dataset.id = post.id
      previewButton.dataset.action = 'preview'
      previewButton.className = 'shrink-0 rounded-lg border border-blue-600 px-3 py-1 text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

      postElement.append(linkElement, previewButton)
      postsList.append(postElement)
    })
  }

  const renderModal = (currentState) => {
    const selectedPost = currentState.posts.find((post) => post.id === currentState.ui.selectedPostId)

    if (!selectedPost) {
      if (modal.open) {
        modal.close()
      }
      if (previousSelectedPostId !== null) {
        const previewButton = postsList.querySelector(`button[data-id="${previousSelectedPostId}"]`)
        previewButton?.focus()
      }
      previousSelectedPostId = null
      return
    }

    modalTitle.textContent = selectedPost.title
    modalBody.textContent = selectedPost.description
    readFullLink.href = selectedPost.link

    if (!modal.open) {
      modal.showModal()
    }
    previousSelectedPostId = selectedPost.id
  }

  const render = (currentState) => {
    const feeds = currentState.feeds
    const posts = currentState.posts
    renderForm(currentState)
    renderFeeds(feeds)
    renderPosts(posts, currentState.ui.seenPostIds)
    renderModal(currentState)
  }

  subscribe(state, () => {
    render(snapshot(state))
  })

  render(snapshot(state))
}

export default initView
