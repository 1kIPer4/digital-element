import Modals from '@modules/modals'
import forms from '@modules/forms'
import Parallax from '@modules/parallax'

window.addEventListener('DOMContentLoaded', () => {
    "use strict"

    //Прокрутка стр, изменение шапки (и chip)
    const
        header = document.querySelector('#header'),
        chip = document.querySelector('.chip')

    function checkHeader(thisWindow) {
        let coords = thisWindow.scrollY

        if (coords > 20) {
            header.classList.add('header-move');
            chip.classList.add('chip-move');
        } else {
            header.classList.remove('header-move');
            chip.classList.remove('chip-move');
        }
    }

    checkHeader(window);

    window.addEventListener('scroll', function () {
        checkHeader(this);
    });

    //Menu
    const
        burger = document.querySelector('.burger'),
        menu = document.querySelector('.menu');

    if (burger) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('menu-open');
        });
    }

    //Якори
    const anchors = document.querySelectorAll('a.anchor[href*="#"]');
    for (let anchor of anchors) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            let blockID = this.getAttribute('href');
            document.querySelector('' + blockID).scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    window.onload = function () {
        //Parallax
        if (window.screen.width > 1023) {
            const
                illustration = new Parallax('.main', [
                {
                    item: '.bean-back',
                    coefficientX: 50,
                    invertX: true, invertY: true
                },
                {
                    item: '.bean-front',
                    coefficientX: 40
                },
                {
                    item: '.man',
                    coefficientX: 10
                },
                {
                    item: '.platform',
                    coefficientX: 10,
                    invertX: true
                },
                {
                    item: '.women',
                    coefficientX: 10,
                    invertX: true, invertY:true},
                {
                    item: '.illustration .icon-red',
                    coefficientX: 1, coefficientY: .9,
                    invertX: true, invertY: true
                },
                {
                    item: '.illustration .icon-blue',
                    coefficientX: .9, coefficientY: .8,
                    invertX: true, invertY: true
                },
                {
                    item: '.illustration .icon-green',
                    coefficientX: .9, coefficientY: .9,
                    invertX: true, invertY: true
                },
                {
                    item: '.illustration .icon-yellow',
                    coefficientX: 1, coefficientY: .8,
                    invertX: true,  invertY: true
                }
            ]),
                iconServices = new Parallax('.services', [
                {
                    item: '.services .icon-red',
                    coefficientX: 4, coefficientY: 3,
                },
                {
                    item: '.services .icon-blue',
                    coefficientX: 4, coefficientY: 3,
                    invertX: true
                },
                {
                    item: '.services .icon-green',
                    coefficientX: 4, coefficientY: 3
                },
                {
                    item: '.services .icon-yellow',
                    coefficientX: 4, coefficientY: 3,
                    invertX: true
                }
            ])
        }
    }

    Modals.initModals()
    forms()
})