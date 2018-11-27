import * as React from 'react';
import ComponentTree from './ComponentTree';
import { ISchemaObject, createSchemaModel } from '../model/schema-util';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}
var base = (id:any) => {
  return {
    name: 'Row',
    id: id,
    props: {
      isZebra: true
    }
  };
};
var schema1 = {
  name: 'Row',
  id: 'Row_1',
  props: {
    isZebra: true
  },
  children: [
    {
      name: 'Col',
      id: 'Col_1',
      children: [base('Row_2'), base('Row_3')]
    }
  ]
};
const schema = createSchemaModel(schema1);
const json = (schema as any).toJSON();

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
      <ComponentTree treeJSON={json} selectedId={'444'} />
    </div>
  );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}
