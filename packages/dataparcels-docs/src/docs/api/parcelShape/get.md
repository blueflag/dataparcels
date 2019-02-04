import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
get(key: string|number): ParcelShape // only on ParentParcels
get(key: string|number, notSetValue: any): ParcelShape // only on ParentParcels
```

Returns a ParcelShape containing the value associated with the provided key / index.
If the key / index doesn't exist, a ParcelShape with a value of `notSetValue` will be returned.
If `notSetValue` is not provided then a ParcelShape with a value of 
 `undefined` will be returned.
 
```js
let value = {
    abc: 123,
    def: 456
};
let parcelShape = new ParcelShape(value);
parcelShape.get('abc').value; // returns 123
parcelShape.get('xyz').value; // returns undefined
parcelShape.get('xyz', 789).value; // returns 789
```

#### get() with indexed values

<IndexedKeys />

```js
let value = ['abc', 'def', 'ghi'];
let parcelShape = new ParcelShape(value);
parcelShape.get(0).value; // returns 'abc'
parcelShape.get(-1).value; // returns 'ghi'
parcelShape.get('#a').value; // returns 'abc'
```