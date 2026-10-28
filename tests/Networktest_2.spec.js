const { test, expect, request } = require('@playwright/test');


test('Security test', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("pjyoti1908@gmail.com");
    await page.locator("#userPassword").fill("Abcd@1234");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => route.continue({
            url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6960eac0c941646b7a8b3e69'

        })

    )
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");


});
