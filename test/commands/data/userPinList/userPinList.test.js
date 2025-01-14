import axios from 'axios';
import userPinList from './../../../../src/commands/data/userPinList/userPinList';

jest.mock('axios');

test('Result other than 200 status is returned', () => {
    const badStatus = {
        status: 700
    };
    axios.get.mockResolvedValue(badStatus);
    expect.assertions(1);
    expect(userPinList('test', 'test')).rejects.toEqual(Error(`unknown server response while attempting to retrieve user pin list: ${badStatus}`));
});

test('200 status is returned', () => {
    const goodStatus = {
        status: 200,
        data: 'testData'
    };
    axios.get.mockResolvedValue(goodStatus);
    expect.assertions(1);
    expect(userPinList('test', 'test')).resolves.toEqual(goodStatus.data);
});

test('Rejection handled', () => {
    axios.get.mockRejectedValue('test error');
    expect.assertions(1);
    expect(userPinList('test', 'test')).rejects.toEqual('test error');
});
