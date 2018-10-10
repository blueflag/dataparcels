// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {ChangeRequest} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

type Props = {};
type State = {
    parcel: ?Parcel,
    initialize: (value: *) => Parcel,
    prevValueFromProps: *
};
type ChildProps = {
    // ${name}: Parcel
};

type ParcelHocConfig = {
    name: string,
    valueFromProps?: (props: *) => *,
    controlled?: boolean,
    shouldControlledHocUpdate?: (valueA: *, valueB: *) => boolean,
    delayUntil?: (props: *) => boolean,
    onChange?: (props: *) => (parcel: Parcel, changeRequest: ChangeRequest) => void,
    pipe?: (props: *) => (parcel: Parcel) => Parcel,
    debugRender?: boolean
};

const PARCEL_HOC_NAME = `ParcelHoc()`;

export default (config: ParcelHocConfig): Function => {
    Types(`ParcelHoc()`, `config`, `object`)(config);

    let {
        name,
        valueFromProps = (props) => undefined, /* eslint-disable-line no-unused-vars */
        controlled = false, /* eslint-disable-line no-unused-vars */
        shouldControlledHocUpdate = (valueA, valueB) => valueA !== valueB,
        delayUntil = (props) => true, /* eslint-disable-line no-unused-vars */
        onChange = (props) => (value, changeRequest) => undefined, /* eslint-disable-line no-unused-vars */
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        // debug options
        debugRender = false
    } = config;

    Types(PARCEL_HOC_NAME, "config.name", "string")(name);
    Types(PARCEL_HOC_NAME, "config.valueFromProps", "function")(valueFromProps);
    Types(PARCEL_HOC_NAME, "config.delayUntil", "function")(delayUntil);
    Types(PARCEL_HOC_NAME, "config.onChange", "function")(onChange);
    Types(PARCEL_HOC_NAME, "config.pipe", "function")(pipe);
    Types(PARCEL_HOC_NAME, "config.debugRender", "boolean")(debugRender);

    return (Component: ComponentType<ChildProps>) => class ParcelHoc extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);

            let initialize = (value: *) => new Parcel({
                value,
                handleChange: this.handleChange,
                debugRender
            });

            this.state = {
                parcel: undefined,
                initialize
            };
        }

        static getDerivedStateFromProps(props: Props, state: State): * {
            let newState = {};

            if(!state.parcel && delayUntil(props)) {
                let value = valueFromProps(props);
                newState.prevValueFromProps = value;
                newState.parcel = state.initialize(value);
            }

            if(state.parcel && controlled) {
                let value = valueFromProps(props);
                newState.prevValueFromProps = value;

                if(shouldControlledHocUpdate(value, state.prevValueFromProps)) {
                    newState.parcel = state.parcel.batchAndReturn((parcel: Parcel) => {
                        parcel.set(value);
                    });
                }
            }

            return newState;
        }

        handleChange = (parcel, changeRequest) => {
            this.setState({parcel});
            let onChangeWithProps = onChange(this.props);
            Types(`handleChange()`, "return value of onChange", "function")(onChangeWithProps);
            onChangeWithProps(parcel.value, changeRequest);
        };

        render(): Node {
            let {parcel} = this.state;

            if(pipe && parcel) {
                let pipeWithProps = pipe(this.props);
                Types(`pipe()`, `return value of pipe`, `function`)(pipeWithProps);
                parcel = pipeWithProps(parcel);
                Types(`pipe()`, "return value of pipe(props)", `parcel`)(parcel);
            }

            let props = {
                ...this.props,
                [name]: parcel
            };

            return <Component {...props} />;
        }
    };
};
