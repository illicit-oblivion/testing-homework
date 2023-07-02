import Mock = jest.Mock;

export function mockXhr() {
    const xhrMockClass = () => ({
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn()
    })

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass) as XMLHttpRequest & Mock
}

export function mockFetch() {
    window.fetch = jest.fn(() =>
        Promise.resolve({})
    ) as never;
}
