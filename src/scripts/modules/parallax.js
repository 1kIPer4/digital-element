export default class Parallax {
    constructor(parallaxBox, options) {
        //Скорость анимации
        this.defaultSpeed = 0.05

        //Объявление координат
        this.positionX = 0
        this.positionY = 0
        this.coordXprocent = 0
        this.coordYprocent = 0

        //Элементы
        this.parallaxBox = document.querySelector(parallaxBox)
        this.options = options

        this.addParallaxListener()
    }

    ParallaxListener = (e) => {
        const
            parallaxWidth = this.parallaxBox.offsetWidth,
            parallaxHeight = this.parallaxBox.offsetHeight,

            //Координаты от середины
            coordX = e.pageX - parallaxWidth / 2,
            coordY = e.pageY - parallaxHeight / 2

        //Получаем проценты
        this.coordXprocent = coordX / parallaxWidth * 100
        this.coordYprocent = coordY / parallaxHeight * 100

        //Сдвиг
        const distX = this.coordXprocent - this.positionX
        const distY = this.coordYprocent - this.positionY

        this.options.forEach(option => {
            const
                speed = option.speed ? Number(option.speed) : this.defaultSpeed,
                invertX = option.invertX ? -1 : 1,
                invertY = option.invertY ? -1 : 1,
                coefficientX = Number(option.coefficientX ? option.coefficientX : option.coefficientY),
                coefficientY = Number(option.coefficientY ? option.coefficientY : coefficientX),
                parallaxItem = document.querySelector(option.item)

            //Новая позиция элемента
            this.positionX = this.positionX + (distX * speed)
            this.positionY = this.positionY + (distY * speed)

            parallaxItem.style.cssText = `transform: translate(${invertX * this.positionX / coefficientX}%, ${invertY * this.positionY / coefficientY}%)`
        })
    }

    addParallaxListener = () => {
        this.parallaxBox.addEventListener('mousemove', (e) => {
            this.ParallaxListener(e)
        })
    }
}