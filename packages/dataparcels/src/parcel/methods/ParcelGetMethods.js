// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../../parcel/Parcel';
import type {ParcelUpdater} from '../../types/Types';

import Types from '../../types/Types';
import deleted from '../../parcelData/deleted';

import pipeWith from 'unmutable/lib/util/pipeWith';

let getValue = (_this: Parcel, notFoundValue: *): * => {
    let {value} = _this;
    return value === deleted || typeof value === "undefined"
        ? notFoundValue
        : value;
};

export default (_this: Parcel) => ({

    // Spread Methods

    spread: (notFoundValue: ?* = undefined): Object => ({
        value: getValue(_this, notFoundValue),
        onChange: _this.onChange
    }),

    spreadDOM: (notFoundValue: ?* = undefined): Object => ({
        value: getValue(_this, notFoundValue),
        onChange: _this.onChangeDOM
    }),

    spreadDOMCheckbox: (notFoundValue: ?boolean = false): Object => ({
        checked: !!getValue(_this, notFoundValue),
        onChange: _this.onChangeDOMCheckbox
    }),

    // Branch methods

    metaAsParcel: (key: string): Parcel => {
        return _this._createNew({
            value: _this.meta[key],
            handleChange: ({value}) => _this.setMeta({
                [key]: value
            })
        });
    },

    // Composition methods

    pipe: (...updaters: ParcelUpdater[]): Parcel => {
        return pipeWith(
            _this,
            ...updaters
        );
    },

    // Side-effect methods

    spy: (sideEffect: Function): Parcel => {
        Types(`spy()`, `sideEffect`, `function`)(sideEffect);
        sideEffect(_this);
        return _this;
    },

    spyChange: (sideEffect: Function): Parcel => {
        Types(`spyChange()`, `sideEffect`, `function`)(sideEffect);
        return _this._create({
            id: _this._id.pushModifier('sc'),
            updateChangeRequestOnDispatch: (changeRequest: ChangeRequest): ChangeRequest => {
                let basedChangeRequest = changeRequest._create({
                    prevData: _this.data
                });
                sideEffect(basedChangeRequest);
                return changeRequest;
            }
        });
    }
});
