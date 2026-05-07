const units = {
  length: [
    {
      name: "millimeter",
      abbreviation: "mm",
      value: 0.001,
    },
    {
      name: "centimeter",
      abbreviation: "cm",
      value: 0.01,
    },
    {
      name: "meter",
      abbreviation: "m",
      value: 1,
    },
    {
      name: "kilometer",
      abbreviation: "km",
      value: 1000,
    },
    {
      name: "inch",
      abbreviation: "in",
      value: 0.0254,
    },
    {
      name: "foot",
      abbreviation: "ft",
      value: 0.3048,
    },
    {
      name: "yard",
      abbreviation: "yd",
      value: 0.9144,
    },
    {
      name: "mile",
      abbreviation: "mi",
      value: 1609.344,
    },
  ],

  weight: [
    {
      name: "milligram",
      abbreviation: "mg",
      value: 0.001,
    },
    {
      name: "gram",
      abbreviation: "g",
      value: 1,
    },
    {
      name: "kilogram",
      abbreviation: "kg",
      value: 1000,
    },
    {
      name: "ounce",
      abbreviation: "oz",
      value: 28.3495,
    },
    {
      name: "pound",
      abbreviation: "lb",
      value: 453.592,
    },
  ],

  temperature: [
    {
      name: "celsius",
      abbreviation: "°C",
      value: 1,
    },
    {
      name: "fahrenheit",
      abbreviation: "°F",
      value: 1,
    },
    {
      name: "kelvin",
      abbreviation: "K",
      value: 1,
    },
  ],
};

let unitToConvertFrom = document.getElementById("unit-to-convert-from");
let unitToConvertTo = document.getElementById("unit-to-convert-to");

let lengthValueError = document.getElementById("length-value-error");
let unitToConvertFromValueError = document.getElementById(
  "unit-to-convert-from-value-error",
);
let unitToConvertToValueError = document.getElementById(
  "unit-to-convert-to-value-error",
);

let unitName = 0;

let fieldsErrors = [];

cleanErrorFields = () => {
  let pElements = document.querySelectorAll(".form .form-input p");

  for (let i = 0; i < pElements.length; i++) {
    let id = pElements[i].getAttribute("id");

    let pElement = document.getElementById(id);

    if (pElement.textContent) {
      pElement.innerHTML = "";
      pElement.style.display = "none";
    }
  }
};

validateFields = () => {
  let pElements = document.querySelectorAll(".form .form-input p");
  let error = false;

  for (let i = 0; i < pElements.length; i++) {
    let id = pElements[i].getAttribute("id");

    // Inputs to validate
    let tagName = pElements[i].previousElementSibling.tagName;
    let inputId = pElements[i].previousElementSibling.id;

    let pElement = document.getElementById(id);
    let input = document.getElementById(inputId).value;

    let message = "";

    if (tagName === "INPUT") {
      if (input === "") {
        message = "The value is required";

        pElement.innerText = message;
        pElement.style.display = "block";
        pElement.style.color = "red";

        error = true;
      } else if (isNaN(Number(input))) {
        message = "The value must be a number";

        pElement.innerText = message;
        pElement.style.display = "block";
        pElement.style.color = "red";

        error = true;
      }

      if (error === false) cleanErrorFields();
    }

    if (tagName === "SELECT") {
      if (input === "" || input === undefined) {
        message = "The value is required";

        pElement.innerText = message;
        pElement.style.display = "block";
        pElement.style.color = "red";

        error = true;
      }

      if (error === false) cleanErrorFields();
    }

    if (tagName === "SELECT") {
      let nextInputId = pElements[i + 1]?.previousElementSibling?.id;
      let nextInput = document.getElementById(nextInputId)?.value;

      if (nextInput && nextInput == input) {
        message = "The values of selects must be different";

        pElement.innerText = message;
        pElement.style.display = "block";
        pElement.style.color = "red";

        error = true;
      }
        if (error === false) cleanErrorFields();
    }
  }

  return error;
};

const unit = document.getElementById("unit");

addOptionsToSelects = (unitsSelected, unitToConvertFrom, unitToConvertTo) => {
  for (let i = 0; i < unitsSelected.length; i++) {
    let name = unitsSelected[i].name;
    let nameToTitle =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    unitToConvertFrom.innerHTML +=
      "<option value=" + name + ">" + nameToTitle + "</option>";
    unitToConvertTo.innerHTML +=
      "<option value=" + name + ">" + nameToTitle + "</option>";
  }
};

removeChildOptionsFromSelect = (
  unitLength,
  unitToConvertFrom,
  unitToConvertTo,
) => {
  if (unitLength > 1) {
    for (let i = unitLength - 1; i > 0; i--) {
      unitToConvertFrom.removeChild(unitToConvertFrom.children[i]);
      unitToConvertTo.removeChild(unitToConvertTo.children[i]);
    }
  }
};

setUnit = (event, unitType) => {
  let activeElement = unit.getElementsByClassName("active")[0];
  activeElement.classList.remove("active");

  event.target.classList.add("active");

  unitName = unitType;

  unitsSelected = units[unitType];

  removeChildOptionsFromSelect(
    unitToConvertFrom.children.length,
    unitToConvertFrom,
    unitToConvertTo,
  );
  addOptionsToSelects(unitsSelected, unitToConvertFrom, unitToConvertTo);
};

document.addEventListener("DOMContentLoaded", () => {
  let activeElement = unit
    .getElementsByClassName("active")[0]
    .textContent.toLowerCase()
    .trim();

  unitType = activeElement;

  unitsSelected = units[activeElement];
  addOptionsToSelects(unitsSelected, unitToConvertFrom, unitToConvertTo);
});

const form = document.getElementById("unit-converter-form");

let resultCalcLbl = document.getElementById("result-calc-lbl");
let convertResult = document.getElementById("converted-result");

let btnReset = document.getElementById("reset");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  let lengthToConvert = Number(formData.get("length-to-convert"));
  let unitToConvertFrom = unitsSelected.find(
    (u) => u.name === formData.get("unit-to-convert-from"),
  );
  let unitToConvertTo = unitsSelected.find(
    (u) => u.name === formData.get("unit-to-convert-to"),
  );

  const isInvalidForm = validateFields();

  if (isInvalidForm) return;
  else cleanErrorFields();

  let result = 0;

  if (unitName === "temperature") {
    if (
      unitToConvertFrom.name === "celsius" &&
      unitToConvertTo.name === "fahrenheit"
    ) {
      result = (lengthToConvert * 9) / 5 + 32;
    } else if (
      unitToConvertFrom.name === "fahrenheit" &&
      unitToConvertTo.name === "celsius"
    ) {
      result = ((lengthToConvert - 32) * 5) / 9;
    } else if (
      unitToConvertFrom.name === "celsius" &&
      unitToConvertTo.name === "kelvin"
    ) {
      result = lengthToConvert + 273.15;
    } else if (
      unitToConvertFrom.name === "kelvin" &&
      unitToConvertTo.name === "celsius"
    ) {
      result = lengthToConvert - 273.15;
    } else if (
      unitToConvertFrom.name === "fahrenheit" &&
      unitToConvertTo.name === "kelvin"
    ) {
      result = ((lengthToConvert - 32) * 5) / 9 + 273.15;
    } else if (
      unitToConvertFrom.name === "kelvin" &&
      unitToConvertTo.name === "fahrenheit"
    ) {
      result = ((lengthToConvert - 273.15) * 9) / 5 + 32;
    }
  } else {
    result =
      (lengthToConvert * unitToConvertFrom.value) / unitToConvertTo.value;
  }

  if (result >= 1000) result = result.toFixed(2);
  else if (result >= 1) result = result.toFixed(4);
  else result = result.toFixed(6);

  convertResult.innerText = `${lengthToConvert} ${unitToConvertFrom.abbreviation} = ${Number(result).toLocaleString()} ${unitToConvertTo.abbreviation}`;

  form.style.display = "none";

  convertResult.style.display = "block";
  resultCalcLbl.style.display = "block";
  btnReset.style.display = "block";
});

btnReset.addEventListener("click", () => {
  form.style.display = "block";

  convertResult.style.display = "none";
  resultCalcLbl.style.display = "none";
  btnReset.style.display = "none";

  document.getElementById("length-to-convert").value = "";
  document.getElementById("unit-to-convert-from").value = "";
  document.getElementById("unit-to-convert-to").value = "";
});
