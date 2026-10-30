const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const loginPayLoad = { userEmail: "pjyoti1908@gmail.com", userPassword: "Abcd@1234" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let response;
const fakeresponse = { data: [], message: "No Orders" }

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

})

test('Intercept the API- modify the response --- passing fake response', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakeresponse);
            route.fulfill({
                response,
                body,
            });

        }
    )

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());
     console.log(await page.locator(".mt-4").textContent());

});
