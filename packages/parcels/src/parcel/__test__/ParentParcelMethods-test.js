// @flow
import test from 'ava';
import Parcel from '../Parcel';
import map from 'unmutable/lib/map';

test('ParentParcel.size() should return size of parcel', t => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    t.is(new Parcel(data).size(), 2);
});

test('ParentParcel.has(key) should return a boolean indicating if key exists', t => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    t.true(new Parcel(data).has('a'));
    t.false(new Parcel(data).has('z'));
});


test('ParentParcel.get(key) should return a new child Parcel', t => {
    t.plan(4);

    var data = {
        value: {
            a: 1,
            b: 4
        },
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'child parcel onChange passes correct action');
            t.deepEqual(expectedValue, parcel.value(), 'child parcel onChange updates original parcels value correctly');
        }
    };

    var expectedValue = {
        a: 2,
        b: 4
    };

    var expectedAction = {
        type: "set",
        keyPath: ["a"],
        payload: {
            value: 2
        }
    };

    var childParcel = new Parcel(data).get("a");

    t.true(childParcel instanceof Parcel, 'get(key) returns a child Parcel');
    t.is(childParcel.value(), 1, 'child parcel has correct value');
    childParcel.onChange(2);
});

test('ParentParcel.get(key).value() should return the same instance of the nested piece of data', t => {
    var myObject = {a:1,b:2};

    var data = {
        value: {
            a: myObject,
            b: 2
        }
    };

    t.is(new Parcel(data).get("a").value(), myObject);
});

test('ParentParcel.get(key).key() on object should return the key', t => {
    var data = {
        value: {
            a: {
                a:1,
                b:2
            },
            b: 2
        }
    };

    t.is(new Parcel(data).get("a").key(), "a");
});

test('ParentParcel.get(index).value() on array should return the first element', t => {
    var data = {
        value: [1,2,3]
    };

    t.is(new Parcel(data).get(0).value(), 1);
});

test('ParentParcel.get(key).value() on array should return the first element', t => {
    var data = {
        value: [1,2,3]
    };

    t.is(new Parcel(data).get("#a").value(), 1);
});

test('ParentParcel.get(key).key() on array should return the key, not the index', t => {
    var data = {
        value: [1,2,3]
    };

    t.is(new Parcel(data).get(0).key(), "#a");
});

test('ParentParcel.get(key).get(key) should return a new child Parcel and chain onChanges', t => {
    t.plan(4);

    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        },
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(parcel.value(), expectedValue, 'child parcel onChange updates original parcels value correctly');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'child parcel onChange passes correct action');
        }
    };

    var expectedValue = {
        a: {
            b: 6
        },
        c: 4
    };

    var expectedAction = {
        type: "set",
        keyPath: ["a", "b"],
        payload: {
            value: 6
        }
    };

    var childParcel = new Parcel(data).get("a").get("b");

    t.true(childParcel instanceof Parcel, 'get(key).get(key) returns a grandchild Parcel');
    t.is(childParcel.value(), 2, 'grandchild parcel has correct value');
    childParcel.onChange(6);
});

test('ParentParcel.get(keyDoesntExist) should return a parcel with value of undefined', t => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        }
    };

    t.true(typeof new Parcel(data).get("z").value() === "undefined");
});

test('ParentParcel.get(keyDoesntExist, "notset") should return a parcel with value of "notset"', t => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        }
    };

    t.is(new Parcel(data).get("z", "notset").value(), "notset");
});

test('ParentParcel.getIn(keyPath) should return a new descendant Parcel', t => {
    t.plan(4);

    var data = {
        value: {
            a: {
                c: {
                    d: 123
                }
            },
            b: 4
        },
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(parcel.value(), expectedValue, 'descendant parcel onChange updates original parcels value correctly');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'descendant parcel onChange passes correct action');
        }
    };

    var expectedValue = {
        a: {
            c: {
                d: 456
            }
        },
        b: 4
    };

    var expectedAction = {
        type: "set",
        keyPath: ["a", "c", "d"],
        payload: {
            value: 456
        }
    };

    var descendantParcel = new Parcel(data).getIn(["a", "c", "d"]);

    t.true(descendantParcel instanceof Parcel, 'getIn(keyPath) returns a descendant Parcel');
    t.is(descendantParcel.value(), 123, 'descendant parcel has correct value');
    descendantParcel.onChange(456);
});

test('ParentParcel.getIn(keyPath) should cope with non existent keypaths', t => {
    var data = {
        value: {
            a: {
                c: {
                    d: 123
                }
            },
            b: 4
        }
    };

    var descendantParcel = new Parcel(data).getIn(["x", "y", "z"]);
    t.deepEqual(descendantParcel.value(), undefined);

    var descendantParcel2 = new Parcel(data).getIn(["x", "y", "z"], "!!!");
    t.deepEqual(descendantParcel2.value(), "!!!");
});

test('ParentParcel.toObject() should make an object', (t: Object) => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    };

    var expectedObject = {a:1,b:2,c:3};
    var parcel = new Parcel(data);
    var obj = map(ii => ii.value())(parcel.toObject());

    t.deepEqual(expectedObject, obj, 'value is correct');

});

test('ParentParcel.toObject() should make an object with a mapper', (t: Object) => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    };

    var expectedObject = {a:2,b:3,c:4};
    var parcel = new Parcel(data);
    var expectedPassedArgs = [
        {value: 1, key: "a", iter: parcel},
        {value: 2, key: "b", iter: parcel},
        {value: 3, key: "c", iter: parcel}
    ];

    var passedArgs = [];

    var obj = parcel.toObject((pp, key, iter) => {
        passedArgs.push({value: pp.value(), key, iter});
        return pp.value() + 1;
    });

    t.deepEqual(expectedObject, obj, 'value is correct');
    t.deepEqual(passedArgs, passedArgs, 'passed args is correct');

});

test('ParentParcel.toArray() should make an array', (t: Object) => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        }
    };

    var expectedArray = [1,2,3];
    var parcel = new Parcel(data);
    var array = map(ii => ii.value())(parcel.toArray());

    t.deepEqual(expectedArray, array, 'value is correct');

});


test('ParentParcel.toArray() should make an array with a mapper', (t: Object) => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        }
    };

    var expectedArray = [2,3,4];
    var parcel = new Parcel(data);
    var expectedPassedArgs = [
        {value: 1, key: 0, iter: parcel},
        {value: 2, key: 1, iter: parcel},
        {value: 3, key: 2, iter: parcel}
    ];

    var passedArgs = [];

    var array = parcel.toArray((pp, key, iter) => {
        passedArgs.push({value: pp.value(), key, iter});
        return pp.value() + 1;
    });

    t.deepEqual(expectedArray, array, 'value is correct');
    t.deepEqual(passedArgs, passedArgs, 'passed args is correct');

});

test('ParentParcel.setSelf() should call the Parcels handleChange function with the new parcelData', (t: Object) => {
    t.plan(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual("???", value);
        }
    };

    new Parcel(data).setSelf("???");
});

test('ParentParcel.updateSelf() should call the Parcels handleChange function with the new parcelData', (t: Object) => {
    t.plan(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual("???", value);
        }
    };

    var expectedArg = {
        a: "!!!"
    };

    new Parcel(data).updateSelf((ii) => {
        t.deepEqual(expectedArg, ii, 'updateSelf passes correct argument to updater');
        return "???";
    });
});

test('ParentParcel.set(key) should call the Parcels handleChange function with the new parcelData', (t: Object) => {
    t.plan(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual({a: "???"}, value);
        }
    };

    new Parcel(data).set("a", "???");
});

test('ParentParcel.update(key) should call the Parcels handleChange function with the new parcelData', (t: Object) => {
    t.plan(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual({a: "???"}, value);
        }
    };

    new Parcel(data).update("a", ii => {
        t.is("!!!", ii, 'update passes correct value to updater');
        return "???";
    });
});

test('ParentParcel.setIn(keyPath) should call the Parcels handleChange function with the new parcelData', (t: Object) => {
    t.plan(1);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual({a: {b: "???"}}, value);
        }
    };

    new Parcel(data).setIn(["a", "b"], "???");
});

test('ParentParcel.updateIn(keyPath) should call the Parcels handleChange function with the new parcelData', (t: Object) => {
    t.plan(2);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual({a: {b: "???"}}, value);
        }
    };

    new Parcel(data).updateIn(["a", "b"], ii => {
        t.is("!!!", ii, 'update passes correct value to updater');
        return "???";
    });
});
