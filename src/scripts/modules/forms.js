import Modals from './modals'

const forms = () => {
    const
        allForms = document.forms,
        chip = document.querySelector('.chip'),
        loading = document.querySelector('.loading'),
        chipMessage = chip.querySelector('.chip__message'),
        timeout = 10000

    const message = {
        loading: 'Loading',
        success: 'Your message successfully sent!',
        failure: 'Something went wrong!'
    }

    const postData = async (url, data) => {
        loading.classList.add('loading-show')

        let res = await fetch(url, {
            method: 'POST',
            body: data
        })

        return await res.text()
    }

    const afterSend = (form) => {
        loading.classList.remove('loading-show')
        //clear inputs
        const inputs = form.querySelectorAll('input, textarea')
        inputs.forEach(input => input.value = '')
        //remove disable
        elemDisabled(form, false)
        //show chip
        chip.classList.add('chip-show')
        //hide chip
        setTimeout( () =>{
            chip.classList.remove('chip-show')
            chipMessage.textContent = '';
        }, timeout)
    }

    const checkFields = (fields) => {
        let isSuccess = true
        fields.forEach(field => {
            const input = field.querySelector('.field__input')
            field.classList.remove('field-error')
            if (input.value.trim() == '') {
                isSuccess = false
                field.classList.add('field-error')
                input.setAttribute('placeholder', 'Enter field "'+field.querySelector('.field__label').textContent+'"')
            }
        })
        return isSuccess
    }

    const elemDisabled = (form, value) => {
        for (let elem of form.elements) {
            if (!elem.classList.contains('close'))
                elem.disabled = value
        }
    }

    const formSubmit = (e, form) => {
        e.preventDefault()

        const fields = form.querySelectorAll('.modal__item')

        if (checkFields(fields)) {
            elemDisabled(form, true)

            const formData = new FormData(form)

            postData('some_url', formData)
                .then(() => {chipMessage.textContent = message.success})
                .catch(() => chipMessage.textContent = message.failure)
                .finally(() => {
                    Modals.modalClose(form.closest('.modal'))
                    afterSend(form)
                })
        }
    }

    for (const form of allForms) {
        form.addEventListener('submit', (e) => {
            formSubmit(e, form)
        })
    }
}

export default forms