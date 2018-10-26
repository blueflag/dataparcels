// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import Types from '../../types/Types';

import ParcelTypes from '../ParcelTypes';
import {ModifyValueChildReturnError} from '../../errors/Errors';
import {ModifyValueChangeChildReturnError} from '../../errors/Errors';

import equals from 'unmutable/lib/equals';
import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import isEmpty from 'unmutable/lib/isEmpty';
import merge from 'unmutable/lib/merge';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({

    modifyValue: (updater: Function): Parcel => {
        Types(`modifyValue()`, `updater`, `function`)(updater);

        let {value} = _this._parcelData;
        let updatedValue = updater(value, _this);
        let updatedType = new ParcelTypes(updatedValue);

        if(updatedType.isParent() && !isEmpty()(updatedValue) && !equals(value)(updatedValue)) {
            throw ModifyValueChildReturnError();
        }

        let updatedTypeChanged: boolean = updatedType.isParent() !== _this._parcelTypes.isParent()
            || updatedType.isIndexed() !== _this._parcelTypes.isIndexed();

        let onDispatch;
        if(updatedTypeChanged) {
            onDispatch = (changeRequest: ChangeRequest) => {
                _this.batch(
                    (parcel: Parcel) => {
                        parcel.set(updatedValue);
                        parcel.dispatch(changeRequest);
                    },
                    changeRequest
                );
            };
        }

        return _this._create({
            id: _this._id.pushModifier('mv'),
            parcelData: {
                ..._this._parcelData,
                value: updatedValue
            },
            onDispatch
        });
    },

    modifyChangeBatch: (batcher: Function): Parcel => {
        Types(`modifyChangeBatch()`, `batcher`, `function`)(batcher);
        return _this._create({
            id: _this._id.pushModifier('mc'),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.batch(
                    (parcel: Parcel) => batcher(parcel, changeRequest._setBaseParcel(parcel)),
                    changeRequest
                );
            }
        });
    },

    modifyChangeValue: (updater: Function): Parcel => {
        Types(`modifyChangeValue()`, `updater`, `function`)(updater);
        return _this.modifyChangeBatch((parcel: Parcel, changeRequest: ChangeRequest) => {

            let {value} = changeRequest;
            let type = new ParcelTypes(value);

            let updatedValue = updater(value, _this);

            if(type.isParent()) {
                if(!equals(value)(updatedValue)) {
                    throw ModifyValueChangeChildReturnError();
                }
                parcel.dispatch(changeRequest);
                return;
            }

            // dispatch all non-value actions in this change request
            let valueActionFilter = actions => actions.filter(action => !action.isValueAction());
            parcel.dispatch(changeRequest.updateActions(valueActionFilter));

            parcel.set(updatedValue);
        });
    },

    initialMeta: (initialMeta: ParcelMeta = {}): Parcel => {
        Types(`initialMeta()`, `initialMeta`, `object`)(initialMeta);
        let {meta} = _this._parcelData;

        let partialMetaToSet = pipeWith(
            initialMeta,
            filterNot((value, key) => has(key)(meta))
        );

        let metaSetter = isEmpty()(partialMetaToSet)
            ? ii => ii
            : pipe(
                setIn(['parcelData', 'meta'], merge(partialMetaToSet)(meta)),
                set('onDispatch', (changeRequest: ChangeRequest) => {
                    _this.batch((parcel: Parcel) => {
                        parcel.setMeta(partialMetaToSet);
                        parcel.dispatch(changeRequest);
                    });
                })
            );

        return pipeWith(
            {
                id: _this._id.pushModifier('im')
            },
            metaSetter,
            _this._create
        );
    },

    _boundarySplit: ({handleChange}: *): Parcel => {
        return _this._create({
            id: _this._id.pushModifier('bs'),
            parent: _this._parent,
            handleChange,
            treeshare: _this._treeshare.boundarySplit()
        });
    }
});
