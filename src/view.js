import { subscribe, snapshot } from "valtio/vanilla"

const initView = (state, i18nInstance) => {
  const form = document.getElementById('form')
  const adressInput = document.getElementById('rss-url')
  const button = document.getElementById('add-button')
  const errorKey = document.getElementById('Error')

  let previousFormState = state.formState

  const renderForm = (currentState) => {
    if (currentState.errorKey === null) {
        errorKey.textContent = ''
    }
    else {
        errorKey.textContent = i18nInstance.t(currentState.errorKey)
    }

    if (currentState.formState === 'validating') {
        button.disabled = true
    }
    else {
        button.disabled = false
    }
    if (currentState.formState === 'error') {
        adressInput.classList.remove('border-gray-300', 'focus:border-blue-600', 'focus:ring-blue-600')
        adressInput.classList.add('border-red-600', 'focus:border-red-600', 'focus:ring-red-600')
    }
    else {
        adressInput.classList.remove('border-red-600', 'focus:border-red-600', 'focus:ring-red-600')
        adressInput.classList.add('border-gray-300', 'focus:border-blue-600', 'focus:ring-blue-600')
    }

    if (currentState.formState === 'success' && previousFormState !== 'success') {
        form.reset()
        adressInput.focus()
    }
    previousFormState = currentState.formState
  }

  subscribe(state, () => {
    renderForm(snapshot(state));
  });

renderForm(snapshot(state))
}

export default initView