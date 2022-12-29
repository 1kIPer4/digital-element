import {getStyle} from "@actions/index"

export default class Modals {
    constructor() {
        Modals.initModals()
    }

    static modalLinks = document.querySelectorAll('.modal-link')
    static closeModal = document.querySelectorAll('.close-modal')
    static body = document.querySelector('body')
    static lockPadding = document.querySelectorAll('.lock-padding')

    static unlock = true

    static timeout = this.closeModal.length > 0 ? getStyle('.modal__body', 'transition-duration') : 0

    static modalOpen = (modal) => {
        if (modal && this.unlock) {
            const modalActive = document.querySelector('.modal-open')
            if (modalActive)
                this.modalClose(modalActive, false)
            else
                this.bodyLock()
            modal.classList.add('modal-open');
            modal.addEventListener('click', (e) => {
                if (!e.target.closest('.modal__body')) {
                    this.modalClose(e.target.closest('.modal'))
                }
            })
        }
    }

    static modalClose = (modalActive, doUnlock = true) => {
        if (this.unlock) {
            modalActive.classList.remove('modal-open')
            if (doUnlock) {
                this.bodyUnlock()
            }
        }
    }

    static bodyLock = () => {
        const lockPaddingValue = window.innerWidth - this.body.offsetWidth + 'px'

        if (this.lockPadding.length > 0) {
            this.lockPadding.forEach(el => {
                el.style.paddingRight = lockPaddingValue
            })
        }
        this.body.style.paddingRight = lockPaddingValue
        this.body.classList.add('lock')

        this.unlock = false
        setTimeout(() => {
            this.unlock = true
        }, this.timeout)
    }

    static bodyUnlock = () => {
        setTimeout(() => {
            if (this.lockPadding.length > 0) {
                this.lockPadding.forEach(el => {
                    el.style.paddingRight = '0px'
                })
            }
            this.body.style.paddingRight = '0px'
            this.body.classList.remove('lock')
        }, this.timeout)

        this.unlock = false
        setTimeout(() => {
            this.unlock = true
        }, this.timeout)
    }

    static initModals = () => {
        if (this.modalLinks.length > 0) {
            this.modalLinks.forEach(modalLink => {
                const
                    modalName = modalLink.getAttribute('href').replace('#', ''),
                    modal = document.getElementById(modalName)
                modalLink.addEventListener('click', e => {

                    this.modalOpen(modal)
                    e.preventDefault()
                })
            })
        }

        if (this.closeModal.length > 0) {
            this.closeModal.forEach(closeEl => {
                closeEl.addEventListener('click', e => {
                    this.modalClose(closeEl.closest('.modal'))
                    e.preventDefault()
                })
            })
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modalActive = document.querySelector('.modal-open')
                this.modalClose(modalActive)
            }
        })
    }
}