// @flow
import ChangeRequest from '../ChangeRequest';
import ChangeRequestReducer from '../ChangeRequestReducer';
import Action from '../Action';
import pipeWith from 'unmutable/lib/util/pipeWith';

const makeReducer = (action) => pipeWith(
    new ChangeRequest(action),
    ChangeRequestReducer
);

test('ChangeRequestReducer should set with empty keyPath', () => {
    var data = {
        value: 123,
        meta: {
            abc: 123
        },
        key: "^"
    };
    var action = new Action({
        type: "set",
        payload: 3
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        }
    };

    // value should be replaced
    // key and meta should be untouched
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should set with empty keyPath and clear existing child', () => {
    var data = {
        value: {
            a: {
                c: 123
            },
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: {
                    c: {
                        key: "c",
                        meta: {abc: 123}
                    }
                }
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        payload: 3
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        }
    };

    // value should be replaced
    // key and meta should be untouched
    // child should be removed
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should set with keyPath of 1 element', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a"],
        payload: 3
    });

    var expectedData = {
        value: {
            a: 3,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should clear child from set key', () => {
    var data = {
        value: {
            a: {
                c: 123
            },
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: {
                    c: {
                        key: "c",
                        meta: {
                            def: 456
                        }
                    }
                }
            },
            b: {
                key: "b",
                meta: {}
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a"],
        payload: 3
    });

    var expectedData = {
        value: {
            a: 3,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b",
                meta: {}
            }
        }
    };

    // value should be replaced at keyPath
    // child should be removed at keyPath
    // top level key and meta should be untouched
    // child.b.meta should be untouched
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should set with keyPath of 2 elements', () => {
    var data = {
        value: {
            a: {},
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a", "b"],
        payload: 3
    });

    var expectedData = {
        value: {
            a: {
                b: 3
            },
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: {
                    b: {
                        key: "b"
                    }
                }
            },
            b: {
                key: "b"
            }
        }
    };

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should set with keyPath of 2 elements on arrays', () => {
    var data = {
        value: [
            [],
            [1,2,3]
        ],
        meta: {
            abc: 123
        },
        key: "^"
    };
    var action = new Action({
        type: "set",
        keyPath: ["#b", "#c"],
        payload: 4
    });

    var expectedData = {
        value: [
            [],
            [1,2,4]
        ],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {
                key: "#a"
            },
            {
                key: "#b",
                child: [
                    {
                        key: "#a"
                    },
                    {
                        key: "#b"
                    },
                    {
                        key: "#c"
                    },
                ]
            }
        ]
    };

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    // keys should be generated for existing value, and for newly set value
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should set with an unkeyed array and give it keys', () => {
    var data = {
        value: 9,
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: [],
        payload: [1,2,3]
    });

    var expectedData = {
        value: [1,2,3],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    // value should be replaced
    // key and meta should be untouched
    // top level child should be kept
    // keys should be generated for newly set value
    expect(makeReducer(action)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should set (with a keyPath) with an unkeyed array and give it keys', () => {
    var data = {
        value: {
            a: [0,0,0]
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a"],
        payload: [1,2,3]
    });

    var expectedData = {
        value: {
            a: [1,2,3]
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: [
                    {key: "#a"},
                    {key: "#b"},
                    {key: "#c"}
                ]
            }
        }
    };

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    // keys should be generated for newly set value
    expect(makeReducer(action)(data)).toEqual(expectedData);
});
