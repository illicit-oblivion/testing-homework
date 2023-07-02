import {fireEvent, render, screen} from '@testing-library/react';
import {addToCart} from "../../src/client/store";
import userEvent from '@testing-library/user-event'
import {getApp} from "./helpers/getApp";
import {getProduct} from "./helpers/product";
import {mockXhr} from "./helpers/mockNetwork";

describe('Заказ', () => {
    const user = userEvent.setup();

    test('заказ создается', async () => {
        mockXhr();
        const {app, store} = getApp();

        const {getByRole} = render(app);

        store.dispatch(addToCart(getProduct(1)));

        await user.click(screen.getByText(/cart/i))

        const name = screen.getByLabelText('Name');
        fireEvent.change(name, {target: {value: 'Jorge'}});

        const phone = screen.getByLabelText('Phone');
        fireEvent.change(phone, {target: {value: '79991111212'}});

        const address = screen.getByLabelText('Address');
        fireEvent.change(address, {target: {value: 'Blabla'}});

        const checkoutButton = getByRole('button', {name: 'Checkout'});
        await user.click(checkoutButton);

        expect(window.XMLHttpRequest).toBeCalled();
    });
});
