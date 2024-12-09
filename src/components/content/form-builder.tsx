/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import { useState, useCallback } from "preact/hooks";
import "ojs/ojformlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojdialog";
import "ojs/ojradioset";
import "ojs/ojcheckboxset";
import "ojs/ojselectsingle";
import { ojDialog } from "ojs/ojdialog";
import "oj-c/text-area";

// Define our form element types
type FormElementType = 'text' | 'textarea' | 'checkbox' | 'select';

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  value?: string | string[];
  options?: Array<{value: string, label: string}>;
}

// Default options for select and checkbox elements
const DEFAULT_OPTIONS = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
];

export function FormBuilder() {
  // State for form elements
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [selectedType, setSelectedType] = useState<FormElementType>('text');
  const [newElementLabel, setNewElementLabel] = useState('');
  const [editingElement, setEditingElement] = useState<FormElement | null>(null);

  // Open dialog for adding new element
  const openAddDialog = useCallback(() => {
    setEditingElement(null);
    const dialog = document.getElementById('elementDialog') as ojDialog;
    dialog?.open();
  }, []);

  // Open dialog for editing element
  const openEditDialog = useCallback((element: FormElement) => {
    setEditingElement(element);
    setSelectedType(element.type);
    setNewElementLabel(element.label);
    const dialog = document.getElementById('elementDialog') as ojDialog;
    dialog?.open();
  }, []);

  // Close dialog
  const closeDialog = useCallback(() => {
    setNewElementLabel('');
    setSelectedType('text');
    setEditingElement(null);
    const dialog = document.getElementById('elementDialog') as ojDialog;
    dialog?.close();
  }, []);

  // Add or update element
  const saveElement = useCallback(() => {
    const elementData = {
      type: selectedType,
      label: newElementLabel,
      options: ['select', 'checkbox'].includes(selectedType) ? DEFAULT_OPTIONS : undefined,
      value: selectedType === 'checkbox' ? [] : ''
    };

    if (editingElement) {
      // Update existing element
      setFormElements(prevElements =>
        prevElements.map(element =>
          element.id === editingElement.id
            ? { ...element, ...elementData }
            : element
        )
      );
    } else {
      // Add new element
      setFormElements(prevElements => [...prevElements, {
        id: `element-${Date.now()}`,
        ...elementData
      }]);
    }
    closeDialog();
  }, [selectedType, newElementLabel, editingElement, closeDialog]);

  // Delete element
  const deleteElement = useCallback((elementId: string) => {
    setFormElements(prevElements =>
      prevElements.filter(element => element.id !== elementId)
    );
  }, []);

  // Handle value changes
  const handleValueChange = useCallback((elementId: string, newValue: string | string[]) => {
    setFormElements(prevElements => 
      prevElements.map(element => 
        element.id === elementId 
          ? { ...element, value: newValue }
          : element
      )
    );
  }, []);

  // Render different form element types
  const renderFormElement = (element: FormElement) => {
    switch (element.type) {
      case 'text':
        return (
          <oj-input-text 
            label-hint={element.label}
            value={element.value as string}
            onvalueChanged={(e: any) => handleValueChange(element.id, e.detail.value)}
          ></oj-input-text>
        );
      
      case 'textarea':
        return (
          <oj-c-text-area 
            label-hint={element.label}
            value={element.value as string}
            rows={3}
            onvalueChanged={(e: any) => handleValueChange(element.id, e.detail.value)}
          ></oj-c-text-area>
        );
      
      case 'checkbox':
        return (
          <oj-checkboxset 
            label-hint={element.label}
            value={element.value as string[]}
            onvalueChanged={(e: any) => handleValueChange(element.id, e.detail.value)}
          >
            {DEFAULT_OPTIONS.map(option => (
              <oj-option value={option.value}>{option.label}</oj-option>
            ))}
          </oj-checkboxset>
        );
      
      case 'select':
        return (
          <oj-select-single 
            label-hint={element.label}
            value={element.value as string}
            onvalueChanged={(e: any) => handleValueChange(element.id, e.detail.value)}
          >
            {DEFAULT_OPTIONS.map(option => (
              <oj-option value={option.value}>{option.label}</oj-option>
            ))}
          </oj-select-single>
        );
      
      default:
        return null;
    }
  };

  return (
    <div class="oj-sm-padding-2x">
      <h1 class="oj-typography-heading-lg">Form Builder</h1>
      <oj-form-layout id="formLayout" label-edge="start" max-columns="1">
        <oj-button id="addElementBtn" onClick={openAddDialog} display="all">
          Add Form Element
        </oj-button>
        
        {/* Form elements */}
        {formElements.map((element) => (
          <div key={element.id} class="oj-sm-padding-2x-vertical">
            <div class="oj-flex">
              <div class="oj-flex-item">
                {renderFormElement(element)}
              </div>
              <div class="oj-flex-item oj-sm-padding-2x-start" style={{ flexGrow: 0 }}>
                <oj-button 
                  display="icons"
                  onClick={() => openEditDialog(element)}
                  class="oj-button-sm"
                >
                  <span slot="startIcon" class="oj-ux-ico-edit"></span>
                  Edit
                </oj-button>
                <oj-button 
                  display="icons"
                  onClick={() => deleteElement(element.id)}
                  class="oj-button-sm"
                  chroming="danger"
                >
                  <span slot="startIcon" class="oj-ux-ico-delete"></span>
                  Delete
                </oj-button>
              </div>
            </div>
          </div>
        ))}
      </oj-form-layout>

      {/* Add/Edit Element Dialog */}
      <oj-dialog 
        id="elementDialog" 
        dialog-title={editingElement ? "Edit Form Element" : "Add Form Element"}
        modality="modal"
        cancel-behavior="icon"
        drag-affordance="title-bar"
      >
        <div slot="body">
          <oj-form-layout id="dialogForm" label-edge="start">
            <oj-input-text 
              label-hint="Element Label"
              value={newElementLabel}
              onvalueChanged={(e: any) => setNewElementLabel(e.detail.value)}
            ></oj-input-text>
            
            <oj-radioset 
              label-hint="Element Type"
              value={selectedType}
              onvalueChanged={(e: any) => setSelectedType(e.detail.value)}
            >
              <oj-option value="text">Text Input</oj-option>
              <oj-option value="textarea">Text Area</oj-option>
              <oj-option value="checkbox">Checkbox</oj-option>
              <oj-option value="select">Select</oj-option>
            </oj-radioset>
          </oj-form-layout>
        </div>
        <div slot="footer">
          <oj-button onClick={closeDialog}>Cancel</oj-button>
          <oj-button onClick={saveElement} chroming="callToAction">
            {editingElement ? "Update" : "Add"}
          </oj-button>
        </div>
      </oj-dialog>
    </div>
  );
}