// @flow
import type Parcel from '../parcel/Parcel';
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type Action from './Action';

import {ReadOnlyError} from '../errors/Errors';
import Reducer from '../change/Reducer';

type ActionUpdater = (actions: Action[]) => Action[];

export default class ChangeRequest {

    _actions: Action[] = [];
    _baseParcel: ?Parcel;
    _meta: * = {};
    _originId: ?string = null;
    _originPath: ?string[] = null;
    _cachedData: ?ParcelData;

    constructor(action: Action|Action[] = []) {
        this._actions = this._actions.concat(action);
    }

    _create = ({actions, baseParcel, meta, originId, originPath}: Object): ChangeRequest => {
        let changeRequest = new ChangeRequest();
        changeRequest._actions = actions || this._actions;
        changeRequest._baseParcel = baseParcel || this._baseParcel;
        changeRequest._meta = meta || this._meta;
        changeRequest._originId = originId || this._originId;
        changeRequest._originPath = originPath || this._originPath;
        return changeRequest;
    };

    _unget = (key: Key|Index): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._unget(key))
        });
    };

    _setBaseParcel = (baseParcel: Parcel): ChangeRequest => {
        return this._create({
            baseParcel
        });
    };

    // $FlowFixMe - this doesn't have side effects
    get data(): * {
        if(!this._baseParcel) {
            throw new Error(`ChangeRequest.data cannot be accessed before calling _setBaseParcel()`);
        }

        if(this._cachedData) {
            return this._cachedData;
        }

        let parcelDataFromRegistry = this
            ._baseParcel
            ._treeshare
            .registry
            .get(this._baseParcel._id.id())
            .data;

        let data = Reducer(parcelDataFromRegistry, this._actions);
        this._cachedData = data;
        return data;
    }

    // $FlowFixMe - this doesn't have side effects
    set data(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): * {
        return this.data.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta (): * {
        return this.data.meta;
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: *) {
        throw ReadOnlyError();
    }

    actions = (): Action[] => {
        return this._actions;
    };

    updateActions = (updater: ActionUpdater): ChangeRequest => {
        return this._create({
            actions: updater(this._actions)
        });
    };

    merge = (other: ChangeRequest): ChangeRequest => {
        return this
            .updateActions(ii => ii.concat(other.actions()))
            .setChangeRequestMeta(other.changeRequestMeta);
    };

    // $FlowFixMe - this doesn't have side effects
    get changeRequestMeta(): * {
        return this._meta;
    }

    // $FlowFixMe - this doesn't have side effects
    set changeRequestMeta(value: *) {
        throw ReadOnlyError();
    }

    setChangeRequestMeta = (partialMeta: *): ChangeRequest => {
        return this._create({
            meta: {
                ...this._meta,
                ...partialMeta
            }
        });
    };

    // $FlowFixMe - this doesn't have side effects
    get originId(): ?string {
        return this._originId;
    }

    // $FlowFixMe - this doesn't have side effects
    set originId(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get originPath(): ?string[] {
        return this._originPath;
    }

    // $FlowFixMe - this doesn't have side effects
    set originPath(value: *) {
        throw ReadOnlyError();
    }

    toJS = (): Object => {
        return {
            actions: this._actions.map(action => action.toJS()),
            meta: this._meta,
            originId: this._originId,
            originPath: this._originPath
        };
    };

    toConsole = () => {
        console.log(this.toJS());
    };
}