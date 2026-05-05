const form = document.getElementById("unit-converter-form")
let convertResult = document.getElementById("convert-result")

const units = new Map()
units.set("millimeter", 0.001)
units.set("centimeter", 0.01)
units.set("meter", 1)
units.set("kilometer", 1000)
units.set("inch", 0.0254)
units.set("foot", 0.3048)
units.set("yard", 0.9144)
units.set("mile", 1609.344)

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = new FormData(form)

    const lengthToConvert = formData.get("length-to-convert")
    const unitToConvertFrom = units.get(formData.get("unit-to-convert-from"))
    const unitToConvertTo = units.get(formData.get("unit-to-convert-to"))

    let result = (lengthToConvert * unitToConvertFrom) / unitToConvertTo

    if(result >= 1000) result = result.toFixed(2)
    else if(result >= 1) result = result.toFixed(4)
    else result = result.toFixed(6)

    convertResult.innerText = Number(result).toLocaleString()
})