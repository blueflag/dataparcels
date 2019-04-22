import Link from 'component/Link';

# CancelActionMarker

```js
import CancelActionMarker from 'dataparcels/CancelActionMarker';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';
```

The CancelActionMarker can be used inside of [Parcel.modifyUp](/api/Parcel#modifyUp) to cancel a change. See [Parcel.modifyUp](/api/Parcel#modifyUp) for more details.

```js
let parcel = new Parcel({
    value: 123
})

parcel = parcel.modifyUp(value => value === null ? CancelActionMarker : value);

parcel.set(456); // this would work, value becomes 123
parcel.set(null); // this would cause no change
```