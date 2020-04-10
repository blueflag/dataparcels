// @flow
import promisify from '../promisify';
import Parcel from '../../parcel/Parcel';

describe('promisify', () => {
    it('should fire promise and resolve', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let promisifiedParcel = parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: () => Promise.resolve()
            }));

        expect(promisifiedParcel.value).toBe(123);
        expect(promisifiedParcel.meta.fooStatus).toBe(undefined);
        expect(promisifiedParcel.meta.fooError).toBe(undefined);

        promisifiedParcel.set(456);

        expect(handleChange).toHaveBeenCalledTimes(1);

        let newParcel = handleChange.mock.calls[0][0];
        expect(newParcel.value).toBe(456);
        expect(newParcel.meta.fooStatus).toBe('pending');
        expect(newParcel.meta.fooError).toBe(undefined);

        await Promise.resolve();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(456);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('resolved');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe(undefined);

        window.setTimeout = realSetTimeout;
    });

    it('should fire promise and resolve with updated data', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: ({value}) => Promise.resolve({
                    value: value + 1
                })
            }))
            .set(456);

        await Promise.resolve();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(457);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('resolved');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe(undefined);

        window.setTimeout = realSetTimeout;
    });

    it('should fire promise and reject', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: () => Promise.reject('error!')
            }))
            .set(456);

        await Promise.resolve();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(456);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('rejected');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe('error!');

        window.setTimeout = realSetTimeout;
    });

    it('should only allow update from most recently fired promise to enforce order', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: '',
            handleChange
        });

        let resolveFirstPromise = () => {};
        let firstPromise = new Promise(resolve => {
            resolveFirstPromise = () => resolve({
                value: 'first-resolved'
            });
        });

        let resolveSecondPromise = () => {};
        let secondPromise = new Promise((resolve, reject) => {
            resolveSecondPromise = () => reject('second-rejected');
        });

        let promiseUpdater = promisify({
            key: 'foo',
            effect: ({value}) => {
                if(value === 'first') {
                    return firstPromise;
                }
                if(value === 'second') {
                    return secondPromise;
                }
                return Promise.resolve({
                    value: 'third-resolved'
                });
            }
        });

        parcel
            .modifyUp(promiseUpdater)
            .set('first');

        handleChange.mock.calls[0][0]
            .modifyUp(promiseUpdater)
            .set('second');

        handleChange.mock.calls[1][0]
            .modifyUp(promiseUpdater)
            .set('third');

        expect(handleChange).toHaveBeenCalledTimes(3);

        await Promise.resolve();

        expect(handleChange).toHaveBeenCalledTimes(4);
        expect(handleChange.mock.calls[3][0].value).toBe('third-resolved');

        resolveFirstPromise();
        await firstPromise;

        resolveSecondPromise();
        await secondPromise.catch(() => {});

        expect(handleChange).toHaveBeenCalledTimes(4);

        window.setTimeout = realSetTimeout;
    });
});
