// Import Core Pack components
import "oj-c/form-layout";
import "oj-c/input-text";
import "oj-c/text-area";
import "oj-c/checkbox";
import "oj-c/select-single";
import "oj-c/button";
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import ArrayDataProvider = require("ojs/ojarraydataprovider")

const dropdownOptions = new ArrayDataProvider([
  { value: "Option1", label: "Option 1" },
  { value: "Option2", label: "Option 2" },
  { value: "Option3", label: "Option 3" },
], { keyAttributes: "value" });

// Define the FormBuilder Component
const FormBuilder: FunctionalComponent = () => {
  const [formElements, setFormElements] = useState<Array<{ id: string; type: string }>>([]);

  // Function to add a new text input field
  const addTextInput = () => {
    setFormElements([...formElements, { id: `TextInput-${formElements.length + 1}`, type: "input" }]);
  };

  // Function to add a new text area field
  const addTextArea = () => {
    setFormElements([...formElements, { id: `TextArea-${formElements.length + 1}`, type: "textarea" }]);
  };

  // Function to add a new checkbox field
  const addCheckbox = () => {
    setFormElements([...formElements, { id: `Checkbox-${formElements.length + 1}`, type: "checkbox" }]);
  };

  // Function to add a new dropdown field
  const addDropdown = () => {
    setFormElements([...formElements, { id: `Dropdown-${formElements.length + 1}`, type: "dropdown" }]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dynamic Form Builder</h1>

      {/* Buttons to add form elements */}
      <div style={{ marginBottom: "20px" }}>
        <oj-c-button
          onojAction={addTextInput}
          label="Add Text Input"
          style="margin-right: 10px;"
        ></oj-c-button>
        <oj-c-button
          onojAction={addTextArea}
          label="Add Text Area"
          style="margin-right: 10px;"
        ></oj-c-button>
        <oj-c-button
          onojAction={addCheckbox}
          label="Add Checkbox"
          style="margin-right: 10px;"
        ></oj-c-button>
        <oj-c-button
          onojAction={addDropdown}
          label="Add Dropdown"
        ></oj-c-button>
      </div>

      {/* Form Layout to organize the fields */}
      <oj-c-form-layout direction="column">
        {formElements.map((element) => {
          if (element.type === "input") {
            return (
              <oj-c-input-text
                key={element.id}
                label-hint={`Field ${element.id}`}
                placeholder={`Enter value for ${element.id}`}
              ></oj-c-input-text>
            );
          } else if (element.type === "textarea") {
            return (
              <oj-c-text-area
                key={element.id}
                label-hint={`Field ${element.id}`}
                placeholder={`Enter value for ${element.id}`}
              ></oj-c-text-area>
            );
          } else if (element.type === "checkbox") {
            return (
              <oj-c-checkbox
                key={element.id}
                label-hint={`Option ${element.id}`}
              ></oj-c-checkbox>
            );
          } else if (element.type === "dropdown") {
            return (
              <oj-c-select-single
                key={element.id}
                label-hint={`Select ${element.id}`}
                placeholder="Choose an option"
                value=""
                data={dropdownOptions}
              ></oj-c-select-single>
            );
          }
          return null;
        })}
      </oj-c-form-layout>
    </div>
  );
};

// Export the FormBuilder component
export default FormBuilder;