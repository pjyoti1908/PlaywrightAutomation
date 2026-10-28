const { test, expect, request } = require('@playwright/test');
const loginPlayload = { userEmail: "pjyoti1908@gmail.com", userPassword: "Abcd@1234" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let token;
let orderId;

test.beforeAll(async () => {

    const apicontext = await request.newContext();
    const loginResponse = await apicontext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPlayload
        });

    const loginResponseJSON = await loginResponse.json();
    token = loginResponseJSON.token;
    console.log(token);

    const orderResponse = await apicontext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayLoad,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

    const orderResponseJson = await orderResponse.json();
    orderId = orderResponseJson.orders[0];
    console.log(orderId);
});

test('login , place order through API and verify', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").waitFor();
    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); ++i) {
        const rowsid = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowsid)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
})