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

let fields = [
  {
    id: "length-to-convert",
    errorId: "length-value-error",
    type: "number",
    required: true,
  },
  {
    id: "unit-to-convert-from",
    errorId: "unit-to-convert-from-value-error",
    type: "select",
    required: true,
    validateAgainstOtherField: {
      id: "unit-to-convert-to",
    },
  },
  {
    id: "unit-to-convert-to",
    errorId: "unit-to-convert-to-value-error",
    type: "select",
    required: true,
    validateAgainstOtherField: {
      id: "unit-to-convert-from",
    },
  },
];

function getErrorElement(field) {
  return document.getElementById(field.errorId);
}

validateField = (field, form) => {
  const element = form.elements[field.id];
  const value = element.value.trim();

  if (field.required && value === "") {
    return "This field is required.";
  }

  if (field.type === "number" && value !== "") {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return "Invalid number.";
    }
  }

  if (field.type === "select" && value === "") {
    return "Please select an option.";
  }

  if (field.validateAgainstOtherField && value !== "") {
    const otherField = form.elements[field.validateAgainstOtherField.id];
    const otherValue = otherField.value.trim();

    if (otherValue !== "" && otherValue === value) {
      return "The values of selects must be different.";
    }
  }

  return "";
}

function validateFields(form, fields) {
  let hasErrors = false;

  for (const field of fields) {
    const errorElement = getErrorElement(field);
    const error = validateField(field, form);

    errorElement.textContent = error;
    errorElement.style.display = error ? "block" : "none";
    errorElement.style.color = error ? "red" : "black";

    if (error) {
      hasErrors = true;
    }
  }

  return hasErrors;
}

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

  const isInvalidForm = validateFields(form, fields);

  if (isInvalidForm) return;

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
