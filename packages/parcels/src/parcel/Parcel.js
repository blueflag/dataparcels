// @flow
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal
} from '../types/Types';
import type Action from '../action/Action';

import ActionMethods from './ActionMethods';
import ChildParcelMethods from './ChildParcelMethods';
import IndexedParcelMethods from './IndexedParcelMethods';
import ModifyMethods from './ModifyMethods';
import ParcelTypes from './ParcelTypes';
import ParentParcelMethods from './ParentParcelMethods';
import ValueParcelMethods from './ValueParcelMethods';

import ParcelId from '../parcelId/ParcelId';
import ParcelRegistry from '../registry/ParcelRegistry';

import map from 'unmutable/lib/map';

type CreateParcelConfigType = {
    handleChange?: Function,
    id: ParcelId,
    parcelData: ParcelData,
    parent?: Parcel
};

const DEFAULT_CONFIG_INTERNAL = {
    child: undefined,
    id: new ParcelId(),
    registry: undefined,
    parent: undefined
};

export default class Parcel {

    //
    // private data
    //

    _handleChange: Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _registry: ParcelRegistry;
    _actionBuffer: Action[] = [];
    _actionBufferOn: boolean = false;
    _parcelTypes: ParcelTypes;

    //
    // private methods
    //

    // - action methods
    _buffer: Function;
    _flush: Function;
    _skipReducer: Function;
    // - id methods
    _typedPathString: Function;

    //
    // public get methods
    //

    // get methods
    // - type methods
    isChild: Function;
    isElement: Function;
    isIndexed: Function;
    isParent: Function;
    // - id methods
    key: Function;
    id: Function;
    path: Function;
    // - value parcel methods
    raw: Function;
    data: Function;
    value: Function;
    spread: Function;
    spreadDOM: Function;
    // - parent parcel methods
    has: Function;
    get: Function;
    getIn: Function;
    toObject: Function;
    toArray: Function;
    size: Function;

    //
    // public change methods
    //

    // - action methods
    dispatch: Function;
    batch: Function;
    // - value parcel methods
    setSelf: Function;
    updateSelf: Function;
    onChange: Function;
    onChangeDOM: Function;
    // - parent parcel methods
    set: Function;
    setIn: Function;
    update: Function;
    updateIn: Function;
    // - indexed parcel methods
    delete: Function;
    insert: Function;
    push: Function;
    pop: Function;
    shift: Function;
    swap: Function;
    swapNext: Function;
    swapPrev: Function;
    unshift: Function;
    // - child parcel methods
    deleteSelf: Function;

    //
    // public modify methods
    //

    chain: Function;
    modify: Function;
    modifyValue: Function;
    modifyChange: Function;

    constructor(parcelConfig: ParcelConfig, _parcelConfigInternal: ?ParcelConfigInternal) {
        let {
            handleChange,
            value
        } = parcelConfig;

        let {
            child,
            id,
            registry,
            parent
        } = _parcelConfigInternal || DEFAULT_CONFIG_INTERNAL;

        this._handleChange = handleChange;
        this._parcelData = {
            value,
            child,
            key: id.key()
        };

        // types
        this._parcelTypes = new ParcelTypes(value, parent && parent._parcelTypes);
        this._id = id.setTypeCode(this._parcelTypes.toTypeCode());

        // registry
        this._registry = registry || new ParcelRegistry(); // TODO ParcelTree?
        this._registry.set(id.id(), this);

        // parcel type methods
        this.isChild = this._parcelTypes.isChild;
        this.isElement = this._parcelTypes.isElement;
        this.isIndexed = this._parcelTypes.isIndexed;
        this.isParent = this._parcelTypes.isParent;

        // id methods
        this._typedPathString = this._id.typedPathString;
        this.key = this._id.key;
        this.id = this._id.id;
        this.path = this._id.path;

        // method creators
        // $FlowFixMe - I want to use compued properties, go away flow
        let addMethods = map((fn, name) => this[name] = fn);
        addMethods({
            ...ActionMethods(this),
            ...ChildParcelMethods(this),
            ...IndexedParcelMethods(this),
            ...ModifyMethods(this),
            ...ParentParcelMethods(this),
            ...ValueParcelMethods(this)
        });
    }

    //
    // private
    //

    _create: Function = (createParcelConfig: CreateParcelConfigType): Parcel => {
        let {
            handleChange = this._handleChange,
            id = this._id,
            parcelData: {
                child,
                value
            },
            parent
        } = createParcelConfig;

        return new Parcel(
            {
                handleChange,
                value
            },
            {
                child,
                id,
                registry: this._registry,
                parent
            }
        );
    };
}