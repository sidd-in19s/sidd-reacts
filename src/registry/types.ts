import React from 'react';

export type ComponentCategory =
  | 'text'
  | 'buttons'
  | 'backgrounds'
  | 'cards'
  | 'components'
  | 'animations';

export interface PropControl {
  name: string;
  label: string;
  type: 'slider' | 'select' | 'boolean' | 'text' | 'color';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  description?: string;
}

export interface PropDoc {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface RegistryItem {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  badge?: 'NEW' | 'HOT' | 'POPULAR' | 'CANVAS' | 'SPRING';
  dependencies: string[];
  cliCommand: string;
  propsConfig: PropControl[];
  apiDocs: PropDoc[];
  component: React.ComponentType<any>;
  codeTSX: string;
  codeJSX: string;
  demoUsage: string;
  tailwindConfig?: string;
}

export interface CategoryInfo {
  id: ComponentCategory;
  name: string;
  description: string;
  iconName: string;
}
