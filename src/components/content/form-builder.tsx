import "oj-c/form-layout";
import "oj-c/input-text";
import "oj-c/text-area";
import "oj-c/checkbox";
import "oj-c/button";
import "oj-c/select-single"
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import ArrayDataProvider = require('ojs/ojarraydataprovider');

// Define the FormBuilder Component
const FormBuilder: FunctionalComponent = () => {
  const [formElements, setFormElements] = useState<Array<{ id: string; type: string; options?: string[] }>>([]);
  const [undoStack, setUndoStack] = useState<Array<Array<{ id: string; type: string; options?: string[] }>>>([]);
  const [redoStack, setRedoStack] = useState<Array<Array<{ id: string; type: string; options?: string[] }>>>([]);

  // Save current form state to undo stack
  const saveState = () => {
    setUndoStack([...undoStack, [...formElements]]);
    setRedoStack([]); // Clear redo stack when new changes happen
  };

  // Function to add a new text input field
  const addTextInput = () => {
    saveState();
    setFormElements([...formElements, { id: `TextInput-${formElements.length + 1}`, type: "input" }]);
  };

  // Function to add a new text area field
  const addTextArea = () => {
    saveState();
    setFormElements([...formElements, { id: `TextArea-${formElements.length + 1}`, type: "textarea" }]);
  };

  // Function to add a new checkbox field with multiple options
  const addCheckbox = () => {
    saveState();
    setFormElements([...formElements, {
      id: `Checkbox-${formElements.length + 1}`,
      type: "checkbox",
      options: ["Option 1", "Option 2", "Option 3"], // Predefined options
    }]);
  };

  const browsers = [
    { value: 'IE', label: 'Internet Explorer' },
    { value: 'FF', label: 'Firefox' },
    { value: 'CH', label: 'Chrome' },
    { value: 'OP', label: 'Opera' },
    { value: 'SA', label: 'Safari' },
  ];

  const browsersDP = new ArrayDataProvider(browsers, {
    keyAttributes: 'value',
  });

  // Function to add a new text area field
  const addSelectSingle = () => {
    saveState();
    setFormElements([...formElements, { id: `SelectSingle-${formElements.length + 1}`, type: "select-single" }]);
  };

  // Function to delete a form element
  const deleteElement = (id: string) => {
    saveState();
    setFormElements(formElements.filter((element) => element.id !== id));
  };

  // Undo last action
  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setRedoStack([formElements, ...redoStack]); // Push current state to redo stack
      setFormElements(lastState); // Restore last state
      setUndoStack(undoStack.slice(0, -1)); // Remove last state from undo stack
    }
  };

  // Redo last undone action
  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack([...undoStack, formElements]); // Push current state to undo stack
      setFormElements(nextState); // Restore next state
      setRedoStack(redoStack.slice(1)); // Remove first state from redo stack
    }
  };

  return (
    <div style={{ padding: "20px"}}>
      <h1>Form Builder</h1>

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
          label="Add Checkbox Group"
          style="margin-right: 10px;"
        ></oj-c-button>
        <oj-c-button
          onojAction={addSelectSingle}
          label="Add Select Dropdown"
          style="margin-right: 10px;"
        ></oj-c-button>
      </div>

      {/* Undo and Redo Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <oj-c-button
          onojAction={undo}
          label="Undo"
          style="margin-right: 10px;"
          disabled={undoStack.length === 0}
        ></oj-c-button>
        <oj-c-button
          onojAction={redo}
          label="Redo"
          style="margin-right: 10px;"
          disabled={redoStack.length === 0}
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
            {element.type === "checkbox" && element.options && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>{`Select options for ${element.id}`}</label>
                {element.options.map((option, index) => (
                  <oj-c-checkbox key={index} label-hint={option}></oj-c-checkbox>
                ))}
              </div>
            )}
            {element.type === "select-single" && (
              <oj-c-select-single
                item-text="label"
                label-hint={`select browser`}
                class="oj-form-control-max-width-md"
                data={browsersDP}
              ></oj-c-select-single>
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