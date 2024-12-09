/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import { useState } from "preact/hooks";
import "ojs/ojformlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import { ojFormLayout } from "ojs/ojformlayout";
import { ojInputText } from "ojs/ojinputtext";
import { ojButton } from "ojs/ojbutton";

// Define our form element types
type FormElementType = 'text' | 'textarea' | 'checkbox' | 'select';

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  required: boolean;
}

export function FormBuilder() {
  // State for form elements
  const [formElements, setFormElements] = useState<FormElement[]>([]);

  return (
    <div class="oj-sm-padding-2x">
      <h1 class="oj-typography-heading-lg">Form Builder</h1>
      <oj-form-layout id="formLayout" label-edge="start" max-columns="1">
        {/* Add Element Button will go here */}
        <oj-button id="addElement" onClick={() => {}}>
          Add Form Element
        </oj-button>
        
        {/* Form elements will be rendered here */}
        {formElements.map((element) => (
          <div key={element.id}>
            {/* Element content will go here */}
          </div>
        ))}
      </oj-form-layout>
    </div>
  );
}