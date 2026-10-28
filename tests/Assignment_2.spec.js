import {test,expect} from '@playwright/test'
const base_Url = 'https://eventhub.rahulshettyacademy.com';

async function login(page){
    await page.goto(base_Url);
    await page.getByPlaceholder('you@email.com').fill('abc12345@abc.com');
    await page.getByLabel('Password').fill('Abc@12345');
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link',{name: 'Browse Events →'})).toBeVisible();
}

test('Assignment_2-> Test 1', async ({page})=> {

    //Step 1-------------
    await login(page);

    //Step 2-------------
    await page.goto(`${base_Url}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();
    await page.getByLabel('Name').fill('testname');
    await page.locator('#customer-email').fill('abc12345@abc.com');
    await page.locator('#phone').fill('1234567890');
    await page.locator('.confirm-booking-btn').click();

    //Step 3---------------------
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${base_Url}/bookings`);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4----------------------
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
    await page.locator('#check-refund-btn').click();

    //Step 5-------------------
    await expect(page.locator('#refund-spinner')).toBeVisible();

    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 8000 });

    //Step 6-----------------
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
})

test('Test 2', async ({ page }) => {
    //Step 1-------------
    await login(page);

    //Step 2----------------------
    await page.goto(`${base_Url}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();
    await page.getByLabel('Full Name').fill('Test User');
    await page.locator('#customer-email').fill('abc12345@abc.com');
    await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
    await page.locator('.confirm-booking-btn').click();

    //Step 3------------------------
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${base_Url}/bookings`);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4---------------------------
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
    await page.locator('#check-refund-btn').click();

    //Step 5---------------------------
    await expect(page.locator('#refund-spinner')).toBeVisible();

    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 8000 });

    //Step 6-----------------------------
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Not eligible for refund');
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});
