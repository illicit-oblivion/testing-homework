import {getByText, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {getApp} from "./helpers/getApp";
import {generateProducts, getShortInfo} from "./helpers/generateProducts";

describe('Страница каталог', () => {
    const user = userEvent.setup();
    const products = generateProducts().map(getShortInfo);

    test('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
        const {app} = getApp({
            getProducts: () => Promise.resolve({data: products} as never),
        });

       const {getAllByTestId} =render(app);

        await user.click(screen.getByText(/catalog/i));

        for (const it of products) {
            console.log(it)
            getAllByTestId(it.id);
        }
    });


    test('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
        const {app} = getApp({
            getProducts: () => Promise.resolve({data: products} as never),
        });

        const {getAllByTestId} =render(app);

        await user.click(screen.getByText(/catalog/i));

        for (const it of products) {
            const product= getAllByTestId(it.id)[1];

            const productName = product.getElementsByClassName('ProductItem-Name')[0];
            const productPrice = product.getElementsByClassName('ProductItem-Price')[0];

            [productName, productPrice].forEach(it => expect(it).toBeInTheDocument())

            getByText(product, 'Details');
        }
    });

    test('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка * * "добавить в корзину"', async () => {
        const firstProduct = products[0];
        const {app} = getApp({
            getProducts: () => Promise.resolve({data: products} as never),
            getProductById: () => Promise.resolve({data: firstProduct} as never),
        });

        const {getByRole} =render(app);

        await user.click(screen.getByText(/catalog/i));
        await user.click(screen.getAllByText(/Details/i)[0]);

        let productDetailClassName = 'ProductDetails';
        const productTitle = document.getElementsByClassName(productDetailClassName + '-Name')[0];
        const productDetailsPrice = document.getElementsByClassName(productDetailClassName + '-Price')[0];
        const productDetailsColor = document.getElementsByClassName(productDetailClassName + '-Color')[0];
        const productName = document.getElementsByClassName(productDetailClassName + '-Material')[0];

        [productTitle, productDetailsPrice, productDetailsColor, productName].map(it => expect(it).toBeInTheDocument())
        getByRole('button', {name: 'Add to Cart'});
    });

    test('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
        const firstProduct = products[0];
        const {app, store} = getApp({
            getProducts: () => Promise.resolve({data: products} as never),
            getProductById: () => Promise.resolve({data: firstProduct} as never),
        });

        const {getByRole} =render(app);

        await user.click(screen.getByText(/catalog/i));
        await user.click(screen.getAllByText(/Details/i)[0]);

        const addToCartBtn = getByRole('button', {name: 'Add to Cart'});

        await user.click(addToCartBtn);
        await user.click(addToCartBtn);

        const cartItem = store.getState().cart[firstProduct.id];
        expect(cartItem).toBeDefined();
        const productNumbersInCart = cartItem.count;

        expect(productNumbersInCart).toBe(2)
    });

    test('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
        const firstProduct = products[0];
        const {app} = getApp({
            getProducts: () => Promise.resolve({data: products} as never),
            getProductById: () => Promise.resolve({data: firstProduct} as never),
        });

        const {getByRole, getAllByText, getAllByTestId} =render(app);

        await user.click(screen.getByText(/catalog/i));
        await user.click(screen.getAllByText(/Details/i)[0]);

        const addToCartBtn = getByRole('button', {name: 'Add to Cart'});

        await user.click(addToCartBtn);
        getAllByText('Item in cart')
        await user.click(screen.getByText(/catalog/i));
        const product= getAllByTestId(firstProduct.id)[1];
        getByText(product,'Item in cart')

    });

    test('проверка правильного CSS класса на кнопке', async () => {
        const firstProduct = products[0];
        const {app} = getApp({
            getProducts: () => Promise.resolve({data: products} as never),
            getProductById: () => Promise.resolve({data: firstProduct} as never),
        });

        const {getByRole, getAllByText, getAllByTestId} =render(app);

        await user.click(screen.getByText(/catalog/i));
        await user.click(screen.getAllByText(/Details/i)[0]);

        const addToCartBtn = getByRole('button', {name: 'Add to Cart'});

        expect(addToCartBtn.classList.contains('btn-lg')).toBe(true);
    });

});
