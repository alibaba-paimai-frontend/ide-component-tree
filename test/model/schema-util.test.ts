import {
  schemaConverter,
  ESchemaOrigin
  // getAllIds
} from '../../src/ComponentTree/schema/util';
import { strMapToObj } from '../../src/lib/util';
describe('[SchemaUtil] schemaConverter - 根据 schema 进行 V2 转换', () => {
  test('单层级创建，自动创建 id', () => {
    var inputSchema = {
      children: [
        {
          component: 'b',
          props: { className: 'main-item' },
          children: ['司法拍卖']
        }
      ],
      props: {},
      component: 'div'
    };
    const schema = schemaConverter(inputSchema, ESchemaOrigin.GOURD_V2);
    // console.log('555', schema);
    expect(schema.id).not.toBe('');
  });
});
