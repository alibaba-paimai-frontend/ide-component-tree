import { Schema } from '../../src/model/schema';
import { strMapToObj } from '../../src/lib/util';
describe('[Schema] schema 模型  - 创建模型', () => {
  test('默认创建的对象', () => {
    const schema = Schema.create();
    expect(schema.id).toBe('');
    expect(schema.name).toBe('');
    expect(schema.attrs).toBe('{}');
    expect(schema.parentId).toBe('');
    expect(strMapToObj(schema.functions)).toEqual({});
    expect(schema.children).toEqual([]);
  });
});

// describe('[Schema] Volatile 属性 - functionList 属性', () => {
//   test('获取函数列表', () => {
//     const schema = Schema.create({});

//   });
// });
