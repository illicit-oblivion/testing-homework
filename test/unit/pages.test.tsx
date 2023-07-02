import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {generateProducts, getShortInfo} from "./helpers/generateProducts";
import {getApp} from "./helpers/getApp";
import {mockFetch, mockXhr} from "./helpers/mockNetwork";

describe('Страницы', () => {
    const user = userEvent.setup();
    const data = generateProducts().map(getShortInfo);

    test('в магазине должны быть страницы: главная, каталог, условия доставки, контакты проверить тайтлы', async () => {
        const {app} = getApp({
            getProducts: () => Promise.resolve({data} as never),
        });

        const {getByRole} = render(app);
        const homeContainer = document.getElementsByClassName('Home')[0];

        expect(homeContainer).toBeInTheDocument();

        await user.click(screen.getByText(/catalog/i));
        getByRole('heading', {name: 'Catalog'})

        await user.click(screen.getByText(/delivery/i));
        getByRole('heading', {name: 'Delivery'})

        await user.click(screen.getByText(/contacts/i));
        getByRole('heading', {name: 'Contacts'})

        await user.click(screen.getByText(/cart/i));
        getByRole('heading', {name: 'Shopping cart'})
    });

    test('страницы главная, условия доставки, контакты должны иметь статическое содержимое ', async () => {
        mockXhr();
        mockFetch();
        const {app} = getApp();
        render(app);
        await user.click(screen.getByText(/delivery/i));
        expect(window.fetch).not.toBeCalled();
        expect(window.XMLHttpRequest).not.toBeCalled();

        await user.click(screen.getByText(/contacts/i));
        expect(window.fetch).not.toBeCalled();
        expect(window.XMLHttpRequest).not.toBeCalled()
    });
});
