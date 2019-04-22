import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';
import ExampleHoc from 'component/ExampleHoc';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;

    let selectedFruit = fruitListParcel
        .toArray()
        .filter(fruit => fruit.meta.selected);

    let allSelected = fruitListParcel.value.length === selectedFruit.length;
    let selectAll = (selected) => fruitListParcel.map(shape(
        fruit => fruit.setMeta({selected})
    ));

    return <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => {
                    let selectedParcel = parcel.metaAsParcel('selected');

                    let checkboxProps = {
                        checked: !!selectedParcel.value,
                        onChange: (event) => selectedParcel.set(event.currentTarget.checked)
                    };

                    return <div>
                        <input type="text" {...parcel.spreadDOM()} />
                        <input type="checkbox" style={{width: '2rem'}} {...checkboxProps} />
                        <button onClick={() => parcel.swapPrev()}>^</button>
                        <button onClick={() => parcel.swapNext()}>v</button>
                        <button onClick={() => parcel.delete()}>x</button>
                    </div>;
                }}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
        {allSelected
            ? <button onClick={() => selectAll(false)}>Select none</button>
            : <button onClick={() => selectAll(true)}>Select all</button>
        }
        <h4>Selected fruit:</h4>
        <ul>
            {selectedFruit.map((fruitParcel) => {
                return <li key={fruitParcel.key}>
                    <button onClick={() => fruitParcel.setMeta({selected: false})}>x</button>
                    {fruitParcel.value}
                </li>;
            })}
        </ul>
    </div>;
};

export default FruitListParcelHoc(ExampleHoc(FruitListEditor));