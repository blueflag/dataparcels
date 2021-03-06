import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import asNode from 'react-dataparcels/asNode';
import exampleFrame from 'component/exampleFrame';

const setWordLengthMeta = asNode(node => node.setMeta({
    wordLength: node.value.word.length
}));

export default function WordEditor(props) {

    let [wordParcel] = useParcelState({
        value: {
            word: "blueberries",
            wordLength: undefined
        },
        beforeChange: setWordLengthMeta
    });

    return exampleFrame({wordParcel}, <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
        <p>word length is {wordParcel.meta.wordLength}</p>
    </div>);
}
