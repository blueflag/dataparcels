import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-initialvalue.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';
import IconParcelHoc from 'content/icon-parcelhoc0001.png';

# ParcelHoc

<ApiPageIcon>{IconParcelHoc}</ApiPageIcon>

ParcelHoc is a React higher order component. It's job is to provide a parcel as a prop, and to handle how the parcel binds to React props and lifecycle events.

It is recommended that you <Link to="/examples/editing-objects">use ParcelHoc</Link>, rather than <Link to="/examples/managing-your-own-parcel-state">managing your own Parcel state</Link>.

```js
import {ParcelHoc} from 'react-dataparcels';
```

```flow
ParcelHoc({
    name: string,
    initialValue?: Function,
    delayUntil?: Function,
    onChange?: Function,
    pipe?: Function
    // debugging options
    debugRender?: boolean
});
```