// @flow
import type Parcel from './Parcel';
import type Action from '../action/Action';
import Reducer from '../action/Reducer';

export default (_this: Parcel): Object => ({
    _buffer: () => {
        _this._actionBuffer = [];
        _this._actionBufferOn = true;
    },

    _flush: () => {
        _this._actionBufferOn = false;
        _this.dispatch(_this._actionBuffer);
        _this._actionBuffer = [];
    },

    _skipReducer: (handleChange: Function): Function => {
        handleChange.SKIP_REDUCER = true;
        return handleChange;
    },

    dispatch: (action: Action|Action[]) => {
        if(_this._actionBufferOn) {
            _this._actionBuffer = _this._actionBuffer.concat(action);
            _this._parcelData = Reducer(_this._parcelData, action);
            return;
        }

        let parcelDataFromRegistry = _this._treeshare
            .registry
            .get(_this._id.id())
            .raw();

        let parcel = null;
        if(!_this._handleChange.SKIP_REDUCER) {
            let parcelData = Reducer(parcelDataFromRegistry, action);
            parcel = _this._create({
                parcelData
            });

            if(_this._treeshare.hasPreModifier() && _this.id() === "^") {
                parcel = _this._treeshare.preModifier.applyTo(parcel);
            }
        }

        _this._handleChange(parcel, [].concat(action));
    },

    batch: (batcher: Function) => {
        _this._buffer();
        batcher(_this);
        if(_this._actionBuffer.length > 0) {
            _this._flush();
        }
    }
});