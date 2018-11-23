import * as React from 'react';
import ComponentTree from './ComponentTree';
import { ISchemaObject } from '../model/schema-util';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

let child3: ISchemaObject = { id: '333', name: '333', parent: null };
let child2: ISchemaObject = {
  id: '222',
  name: '222',
  children: [child3],
  parent: null
};
let child4: ISchemaObject = { id: '444', name: '444', parent: null };
let treeJSON: ISchemaObject = {
  id: '111',
  name: '111',
  children: [child2, child4],
  parent: null
};
child2.parent = treeJSON;
child3.parent = child2;
child4.parent = treeJSON;

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
      <ComponentTree treeJSON={treeJSON} selectedId={'444'} />
    </div>
  );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}
