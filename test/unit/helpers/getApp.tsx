import React from "react";

import {CartApi, ExampleApi, LOCAL_STORAGE_CART_KEY} from "../../../src/client/api";
import {initStore} from "../../../src/client/store";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../../src/client/Application";

const basename  = '/hw/store';

export const getApp = (mockMethods: Partial<ExampleApi> = {}) => {
    const api = Object.assign(new ExampleApi(basename), mockMethods);
    const cart = new CartApi();
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    const store = initStore(api, cart);

    window.history.pushState({}, '', basename);

    return (
        {
    app: <BrowserRouter basename={basename}>
        <Provider store={store}>
            <Application/>
        </Provider>
    </BrowserRouter>,
            store,
}
    );
}
