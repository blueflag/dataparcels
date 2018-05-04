// @flow
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal,
    CreateParcelConfigType
} from '../types/Types';

import type Action from '../action/Action';

import Modifiers from '../modifiers/Modifiers';

import ActionMethods from './ActionMethods';
import ChildParcelMethods from './ChildParcelMethods';
import ElementParcelMethods from './ElementParcelMethods';
import IndexedParcelMethods from './IndexedParcelMethods';
import ModifyMethods from './ModifyMethods';
import ParcelTypes from './ParcelTypes';
import ParentParcelMethods from './ParentParcelMethods';
import ValueParcelMethods from './ValueParcelMethods';

import ParcelId from '../parcelId/ParcelId';
import Treeshare from '../treeshare/Treeshare';

import map from 'unmutable/lib/map';

const DEFAULT_CONFIG_INTERNAL: ParcelConfigInternal = {
    child: undefined,
    meta: {},
    id: new ParcelId(),
    modifiers: undefined,
    parent: undefined,
    treeshare: undefined
};

export default class Parcel {

    //
    // private data
    //

    _handleChange: Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _modifiers: Modifiers;
    _treeshare: Treeshare;
    _actionBuffer: Action[] = [];
    _actionBufferOn: boolean = false;
    _parcelTypes: ParcelTypes;
    _applyModifiers: Function;

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
    meta: Function;
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
    setMeta: Function;
    updateMeta: Function;
    // - parent parcel methods
    set: Function;
    setIn: Function;
    update: Function;
    updateIn: Function;
    // - indexed parcel methods
    delete: Function;
    insertAfter: Function;
    insertBefore: Function;
    push: Function;
    pop: Function;
    shift: Function;
    swap: Function;
    swapNext: Function;
    swapPrev: Function;
    unshift: Function;
    // - child parcel methods
    deleteSelf: Function;
    // - element parcel methods
    insertAfterSelf: Function;
    insertBeforeSelf: Function;
    swapWithSelf: Function;
    swapNextWithSelf: Function;
    swapPrevWithSelf: Function;

    //
    // public modify methods
    //

    chain: Function;
    modify: Function;
    modifyValue: Function;
    modifyChange: Function;
    addPreModifier: Function;
    addModifier: Function;
    addDescendantModifier: Function;

    constructor(parcelConfig: ParcelConfig, _parcelConfigInternal: ?ParcelConfigInternal) {
        let {
            handleChange,
            value
        } = parcelConfig;

        let {
            child,
            meta,
            id,
            modifiers,
            parent,
            treeshare
        } = _parcelConfigInternal || DEFAULT_CONFIG_INTERNAL;

        this._handleChange = handleChange;
        this._parcelData = {
            value,
            child,
            key: id.key(),
            meta
        };

        // types
        this._parcelTypes = new ParcelTypes(value, parent && parent._parcelTypes);
        this._id = id.setTypeCode(this._parcelTypes.toTypeCode());

        // modifiers
        this._modifiers = modifiers || new Modifiers();

        // treeshare
        this._treeshare = treeshare || new Treeshare();
        this._treeshare.registry.set(id.id(), this);

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
            ...ElementParcelMethods(this),
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
            handleChange,
            id = this._id,
            parcelData: {
                child,
                value,
                meta
            },
            modifiers = this._modifiers,
            parent
        } = createParcelConfig;

        if(!handleChange) {
            handleChange = this._skipReducer((parcel: Parcel, action: Action|Action[]) => {
                this.dispatch(action);
            });
        }

        let parcel: Parcel = new Parcel(
            {
                handleChange,
                value
            },
            {
                child,
                meta,
                id,
                modifiers,
                parent,
                treeshare: this._treeshare
            }
        );

        return parent
            ? parcel._applyModifiers()
            : parcel;
    };
}