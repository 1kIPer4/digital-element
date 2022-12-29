const getStyle = (object, style) => {
    let value = window.getComputedStyle(document.querySelector(object)).getPropertyValue(style)
    if (style === 'transition-duration')
        value = Number(value.substring(0, 3)) * 1000
    return value
}

export {getStyle}