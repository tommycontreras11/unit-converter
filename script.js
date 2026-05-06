const units = {
  length: [
    {
      name: "millimeter",
      value: 0.001,
    },
    {
      name: "centimeter",
      value: 0.01,
    },
    {
      name: "meter",
      value: 1,
    },
    {
      name: "kilometer",
      value: 1000,
    },
    {
      name: "inch",
      value: 0.0254,
    },
    {
      name: "foot",
      value: 0.3048,
    },
    {
      name: "yard",
      value: 0.9144,
    },
    {
      name: "mile",
      value: 1609.344,
    },
  ],
  weight: [
    {
      name: "milligram",
      value: 0.001,
    },
    {
      name: "gram",
      value: 1,
    },
    {
      name: "kilogram",
      value: 1000,
    },
    {
      name: "ounce",
      value: 28.3495,
    },
    {
      name: "pound",
      value: 453.592,
    },
  ],
  temperature: [
    {
      name: "celsius",
      value: 1,
    },
    {
      name: "fahrenheit",
      value: 1,
    },
    {
      name: "kelvin",
      value: 1,
    },
  ],
};

let unitToConvertFrom = document.getElementById("unit-to-convert-from");
let unitToConvertTo = document.getElementById("unit-to-convert-to");

let error = document.getElementById("error");

let unitName = 0

cleanError = () => {
  if (error.textContent) {
    error.innerText = "";
  }
};

setError = (message) => {
  cleanError();
  error.style.display = "block";
  error.style.color = "red";
  error.innerText = message;
};

const unit = document.getElementById("unit");

addOptionsToSelects = (unitsSelected, unitToConvertFrom, unitToConvertTo) => {
  for (let i = 0; i < unitsSelected.length; i++) {
    let name = unitsSelected[i].name;

    unitToConvertFrom.innerHTML +=
      "<option value=" + name + ">" + name + "</option>";
    unitToConvertTo.innerHTML +=
      "<option value=" + name + ">" + name + "</option>";
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

  unitName = unitType

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

  unitType = activeElement

  unitsSelected = units[activeElement];
  addOptionsToSelects(unitsSelected, unitToConvertFrom, unitToConvertTo);
});

const form = document.getElementById("unit-converter-form");
let convertResult = document.getElementById("converted-result");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const lengthToConvert = Number(formData.get("length-to-convert"));
  const unitToConvertFrom = unitsSelected.find(
    (u) => u.name === formData.get("unit-to-convert-from"),
  );
  const unitToConvertTo = unitsSelected.find(
    (u) => u.name === formData.get("unit-to-convert-to"),
  );

  if (unitToConvertFrom.name === unitToConvertTo.name) {
    setError("The units to be converted must be different.");
  } else {
    cleanError();
  }

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

  convertResult.innerText = Number(result).toLocaleString();
});
