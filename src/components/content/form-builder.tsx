/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { useState, useCallback } from "preact/hooks";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { ojDialog } from "ojs/ojdialog";

// Load components
import "ojs/ojformlayout";
import "ojs/ojbutton";
import "ojs/ojdialog";
import "ojs/ojradioset";
import "oj-c/text-area";
import "oj-c/input-text";
import "oj-c/select-single";
import "oj-c/checkboxset";

type FormElementType = 'text' | 'textarea' | 'select';

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  value: string | string[];
}

const optionsDP = new ArrayDataProvider([
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
], { keyAttributes: 'value' });

export function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [selectedType, setSelectedType] = useState<FormElementType>('text');
  const [newElementLabel, setNewElementLabel] = useState('');
  const [editingElement, setEditingElement] = useState<FormElement | null>(null);

  const openAddDialog = useCallback(() => {
    setEditingElement(null);
    setNewElementLabel('');
    setSelectedType('text');
    (document.getElementById('elementDialog') as ojDialog)?.open();
  }, []);

  const openEditDialog = useCallback((element: FormElement) => {
    setEditingElement(element);
    setSelectedType(element.type);
    setNewElementLabel(element.label);
    (document.getElementById('elementDialog') as ojDialog)?.open();
  }, []);

  const closeDialog = useCallback(() => {
    setEditingElement(null);
    setNewElementLabel('');
    setSelectedType('text');
    (document.getElementById('elementDialog') as ojDialog)?.close();
  }, []);

  const saveElement = useCallback(() => {
    const elementData = {
      type: selectedType,
      label: newElementLabel,
      value: ''
    };

    setFormElements(prevElements => {
      if (editingElement) {
        return prevElements.map(element =>
          element.id === editingElement.id
            ? { ...element, ...elementData }
            : element
        );
      }
      return [...prevElements, {
        id: `element-${Date.now()}`,
        ...elementData
      }];
    });
    
    closeDialog();
  }, [selectedType, newElementLabel, editingElement, closeDialog]);

  const deleteElement = useCallback((elementId: string) => {
    setFormElements(prev => prev.filter(element => element.id !== elementId));
  }, []);

  const handleValueChange = useCallback((elementId: string, value: string | string[]) => {
    setFormElements(prev => 
      prev.map(element => 
        element.id === elementId 
          ? { ...element, value }
          : element
      )
    );
  }, []);

  const renderFormElement = (element: FormElement) => {
    const commonProps = {
      labelHint: element.label,
      value: element.value,
      onvalueChanged: (e: CustomEvent) => handleValueChange(element.id, e.detail.value)
    };

    switch (element.type) {
      case 'text':
        return <oj-c-input-text {...commonProps} />;
      
      case 'textarea':
        return <oj-c-text-area {...commonProps} rows={3} />;
      
      case 'select':
        return <oj-c-select-single {...commonProps} data={optionsDP} />;
      
      default:
        return null;
    }
  };

  return (
    <div class="oj-sm-padding-2x">
      <h1 class="oj-typography-heading-lg">Form Builder</h1>
      
      <oj-form-layout id="formLayout" label-edge="start" max-columns="1">
        <oj-button onClick={openAddDialog}>Add Form Element</oj-button>
        
        {formElements.map((element) => (
          <div key={element.id} class="oj-flex oj-sm-margin-2x-vertical">
            <div class="oj-flex-item">
              {renderFormElement(element)}
            </div>
            <div class="oj-flex-item oj-sm-padding-2x-start" style={{ flexGrow: 0 }}>
              <oj-button 
                display="icons"
                onClick={() => openEditDialog(element)}
                class="oj-button-sm"
              >
                <span slot="startIcon" class="oj-ux-ico-edit" />
                Edit
              </oj-button>
              <oj-button 
                display="icons"
                onClick={() => deleteElement(element.id)}
                class="oj-button-sm"
                chroming="danger"
              >
                <span slot="startIcon" class="oj-ux-ico-delete" />
                Delete
              </oj-button>
            </div>
          </div>
        ))}
      </oj-form-layout>

      <oj-dialog 
        id="elementDialog" 
        dialog-title={`${editingElement ? 'Edit' : 'Add'} Form Element`}
        modality="modal"
        cancel-behavior="icon"
      >
        <div slot="body">
          <oj-form-layout label-edge="start">
            <oj-c-input-text 
              label-hint="Element Label"
              value={newElementLabel}
              onvalueChanged={(e: CustomEvent) => 
                setNewElementLabel(e.detail.value as string)}
            />
            
            <oj-radioset 
              label-hint="Element Type"
              value={selectedType}
              onvalueChanged={(e: CustomEvent) => setSelectedType(e.detail.value)}
            >
              <oj-option value="text">Text Input</oj-option>
              <oj-option value="textarea">Text Area</oj-option>
              <oj-option value="select">Select</oj-option>
            </oj-radioset>
          </oj-form-layout>
        </div>
        <div slot="footer">
          <oj-button onClick={closeDialog}>Cancel</oj-button>
          <oj-button onClick={saveElement} chroming="callToAction">
            {editingElement ? 'Update' : 'Add'}
          </oj-button>
        </div>
      </oj-dialog>
    </div>
  );
}