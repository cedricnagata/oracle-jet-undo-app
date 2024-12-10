// Import Core Pack components
import "oj-c/form-layout";
import "oj-c/input-text";
import "oj-c/text-area";
import "oj-c/button";
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";

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

  // Function to delete a form element
  const deleteElement = (id: string) => {
    setFormElements(formElements.filter((element) => element.id !== id));
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
        ></oj-c-button>
      </div>

      {/* Form Layout to organize the fields */}
      <oj-c-form-layout direction="column">
        {formElements.map((element) => (
          <div key={element.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Render appropriate form element */}
            {element.type === "input" && (
              <oj-c-input-text
                label-hint={`Field ${element.id}`}
                placeholder={`Enter value for ${element.id}`}
              ></oj-c-input-text>
            )}
            {element.type === "textarea" && (
              <oj-c-text-area
                label-hint={`Field ${element.id}`}
                placeholder={`Enter value for ${element.id}`}
              ></oj-c-text-area>
            )}
            {/* Delete button */}
            <oj-c-button
              onojAction={() => deleteElement(element.id)}
              label="Delete"
              chroming="outlined"
            ></oj-c-button>
          </div>
        ))}
      </oj-c-form-layout>
    </div>
  );
};

// Export the FormBuilder component
export default FormBuilder;