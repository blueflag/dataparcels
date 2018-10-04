// @flow
import {Map, List} from 'immutable';
import Parcel from '../Parcel';

test('ParcelTypes should correctly identify primitive values', () => {
    var data = {
        value: 123
    };
    expect(new Parcel(data).isParent()).toBe(false);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceipT");
});

test('ParcelTypes should correctly identify date', () => {
    var data = {
        value: new Date()
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceiPT");
});

test('ParcelTypes should correctly identify object values', () => {
    var data = {
        value: {
            a: "A"
        }
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceiPT");
});

test('ParcelTypes should correctly identify class instance values', () => {
    class Thing {
        foo = "123"
    }
    var data = {
        value: new Thing()
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceiPT");
});

test('ParcelTypes should correctly identify Immutable.js Map values', () => {
    var data = {
        value: Map({
            a: "A"
        })
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceiPT");
});


test('ParcelTypes should correctly identify array values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(true);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceIPT");
});

test('ParcelTypes should correctly identify Immutable.js List values', () => {
    var data = {
        value: List([1,2,3])
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(true);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
    expect(new Parcel(data)._parcelTypes.toTypeCode()).toBe("ceIPT");
});

test('ParcelTypes should correctly identify child values', () => {
    var data = {
        value: {
            a: "A"
        }
    };
    expect(new Parcel(data).get("a").isParent()).toBe(false);
    expect(new Parcel(data).get("a").isIndexed()).toBe(false);
    expect(new Parcel(data).get("a").isChild()).toBe(true);
    expect(new Parcel(data).get("a").isElement()).toBe(false);
    expect(new Parcel(data).get("a").isTopLevel()).toBe(false);
    expect(new Parcel(data).get("a")._parcelTypes.toTypeCode()).toBe("Ceipt");
});

test('ParcelTypes should correctly identify element values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(new Parcel(data).get(0).isParent()).toBe(false);
    expect(new Parcel(data).get(0).isIndexed()).toBe(false);
    expect(new Parcel(data).get(0).isChild()).toBe(true);
    expect(new Parcel(data).get(0).isElement()).toBe(true);
    expect(new Parcel(data).get(0).isTopLevel()).toBe(false);
    expect(new Parcel(data).get(0)._parcelTypes.toTypeCode()).toBe("CEipt");
});

test('ParcelTypes should correctly identify top level values after modifiers', () => {
    var data = {
        value: [1,2,3]
    };
    expect(new Parcel(data).modifyValue(ii => ii).isTopLevel()).toBe(true);
});

// method creators

test('Correct methods are created for primitive values', () => {
    var data = {
        value: 123
    };
    expect(() => new Parcel(data).value).not.toThrow();
    expect(() => new Parcel(data).has('a')).toThrowError(`.has() is not a function`);
    expect(() => new Parcel(data).pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
    expect(() => new Parcel(data).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for object values', () => {
    var data = {
        value: {a: 123}
    };
    expect(() => new Parcel(data).value).not.toThrow();
    expect(() => new Parcel(data).has('a')).not.toThrow();
    expect(() => new Parcel(data).pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
    expect(() => new Parcel(data).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for array values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(() => new Parcel(data).value).not.toThrow();
    expect(() => new Parcel(data).has('a')).not.toThrow();
    expect(() => new Parcel(data).pop()).not.toThrow();
    expect(() => new Parcel(data).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
    expect(() => new Parcel(data).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for object child values', () => {
    var data = {
        value: {a: 123}
    };
    expect(() => new Parcel(data).get("a").value).not.toThrow();
    expect(() => new Parcel(data).get("a").has('a')).toThrowError(`.has() is not a function`);
    expect(() => new Parcel(data).get("a").pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).get("a").delete()).not.toThrow();
    expect(() => new Parcel(data).get("a").swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for array element values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(() => new Parcel(data).get(0).value).not.toThrow();
    expect(() => new Parcel(data).get(0).has('a')).toThrowError(`.has() is not a function`);
    expect(() => new Parcel(data).get(0).pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).get(0).delete()).not.toThrow();
    expect(() => new Parcel(data).get(0).swapNext()).not.toThrow();
});

