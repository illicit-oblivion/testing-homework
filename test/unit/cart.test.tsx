import {getByTestId, render, screen} from '@testing-library/react';
import {addToCart, clearCart} from "../../src/client/store";
import userEvent from '@testing-library/user-event'
import {getApp} from "./helpers/getApp";
import {getProduct} from "./helpers/product";

describe('Старница корзина', () => {
    const user = userEvent.setup();
    const clearShoppingCartText = "Clear shopping cart";

    test('в корзине должна быть кнопка "очистить корзину"', async () => {
        const {app, store} = getApp();

        const {getByText, findAllByText} = render(app);

        const noResetButton  = await findAllByText(clearShoppingCartText).then(() => false).catch(() => true)

        expect(noResetButton).toBe(true);
        store.dispatch(addToCart(getProduct(1)));

        await user.click(screen.getByText(/cart/i))

        expect(getByText(clearShoppingCartText)).toBeInTheDocument();
    });

    test('по нажатию на кнопку "очистить корзину" все товары должны удаляться', async () => {
        const {app, store} = getApp();

        const {getByText} = render(app);

        store.dispatch(addToCart(getProduct(1)));
        expect(store.getState().cart['1']).not.toBe(undefined)

        await user.click(screen.getByText(/cart/i))
        const clearCardBtn = getByText(clearShoppingCartText);

        await user.click(clearCardBtn);
        const products = store.getState().cart;

        expect(products).toStrictEqual({})
    });

    test('если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
        const {app, store} = getApp();

        const {findByRole} = render(app);

        store.dispatch(clearCart());

        await user.click(screen.getByText(/cart/i))

        const hasCatalogLink  = await findByRole('link', {name: 'catalog'}).then(() => true).catch(() => false)

        expect(hasCatalogLink).toBe(true);
    });

    const productIds =  [1, 1, 2, 3, 4 ,4 , 5];
    test('в корзине должна отображаться таблица с добавленными в нее товарами', async () => {
        const {app, store} = getApp();

        const {getByTestId} = render(app);

        productIds.forEach((it) => store.dispatch(addToCart(getProduct(it))))

        await user.click(screen.getByText(/cart/i))

        for (const it of productIds) {
            getByTestId(it);
        }
    });

    const catalogLinkText = 'Cart ('

    test('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
        const {app, store} = getApp();

        const {getAllByRole} = render(app);

        productIds.forEach((it) => store.dispatch(addToCart(getProduct(it))))

        const expectedCartLength = productIds.reduce((acc, item) => {
            if (acc.includes(item)) {
                return acc;
            }
            return [...acc, item];
        }, []).length;

        const catalogLink  = getAllByRole('link').find(it => it.hasAttribute('href') && it.getAttribute('href') === '/hw/store/cart')
        const catalogLength  =  Number(catalogLink?.innerHTML.slice(catalogLinkText.length, -1)) || 0;

        expect(catalogLength).toBe(expectedCartLength);
    });

    test('для каждого товара должны отображаться название, цена, количество, стоимость', async () => {
        const {app, store} = getApp();

        const {getByTestId} = render(app);

        const products = productIds.map(getProduct);

        products.forEach((it) => store.dispatch(addToCart(it)));

        await user.click(screen.getByText(/cart/i))

        for (const product of products) {
            const item = getByTestId(product.id);
            const cartItemName = item.getElementsByClassName('Cart-Name')[0];
            const cartItemPrice = item.getElementsByClassName('Cart-Price')[0];
            const cartItemCount = item.getElementsByClassName('Cart-Count')[0];
            const cartItemTotal = item.getElementsByClassName('Cart-Total')[0];

            [cartItemName, cartItemPrice, cartItemCount, cartItemTotal].forEach(it => expect(it).toBeInTheDocument())
        }
    });

    test('должна отображаться общая сумма заказа', async () => {
        const {app, store} = getApp();
        const {getByText} = render(app);

        const products = productIds.map(getProduct);
        products.forEach((product) => store.dispatch(addToCart(product)));
        const total = products.reduce((total, product) => {
            return total + product.price;
        }, 0);

        await user.click(screen.getByText(/cart/i))

        const totalRow = getByText('Order price:');

        expect(totalRow.nextSibling.textContent).toBe('$' + total)
    });

});
