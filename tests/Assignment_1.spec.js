import {test,expect} from '@playwright/test'
const base_Url = 'https://eventhub.rahulshettyacademy.com';

async function login(page){
    await page.goto(base_Url);
    await page.getByPlaceholder('you@email.com').fill('abc12345@abc.com');
    await page.getByLabel('Password').fill('Abc@12345');
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link',{name: 'Browse Events →'})).toBeVisible();
}

test('Assignment_1', async ({page})=> {

    //Step 1-------------
    await login(page);

    //Step 2------------------
    await page.goto(`${base_Url}/admin/events`);
    const eventTitle = `Test Event ${Date.now()}`;
    await page.locator('#event-title-input').fill(eventTitle);
    await page.locator('#admin-event-form textarea').fill('Test Purpose');
    await page.getByLabel('City').fill('Test city');
    await page.getByLabel('Venue').fill('Test Venue');
    await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');
    await page.getByLabel('Price ($)').fill('100');
    await page.getByLabel('Total Seats').fill('50');
    await page.locator('#add-event-btn').click();
    await expect(page.getByText('Event created!')).toBeVisible();
    console.log(`Created event: "${eventTitle}"`);

    //Step 3 -----------------
    await page.goto(`${base_Url}/events`);
    var eventcards =await page.getByTestId('event-card');
    await expect(eventcards.first()).toBeVisible();
    const targetCard = eventcards.filter({ hasText: eventTitle }).first();
    await expect(targetCard).toBeVisible({ timeout: 5000 });
    const seats = parseInt(await targetCard.getByText('seat').first().innerText());
    console.log(`Seats before booking: ${seats}`);
    await targetCard.getByTestId('book-now-btn').click();

    //Step 4--------------------
    const ticketcount = await page.locator('#ticket-count');
    await expect(ticketcount).toHaveText('1');
    await page.locator('#customerName').fill('testname');
    await page.locator('#customer-email').fill('abc12345@abc.com');
    await page.locator('#phone').fill('1234567890');
    await page.locator('#confirm-booking').click();

    //Step 5-------------------------
    const bookingRef = page.locator('.booking-ref').first();
    await expect(bookingRef).toBeVisible();
    const bookingRef1 = (await bookingRef.innerText()).trim();
     expect(bookingRef1.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());  
    console.log(`Booking confirmed. Ref: ${bookingRef1}`);

    //Step 6 ----------------------------       
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${base_Url}/bookings`);
    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();
    const matchingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef1 }) });
    await expect(matchingCard).toBeVisible();
    await expect(matchingCard).toContainText(eventTitle);
    console.log(`Booking card found in My Bookings for ref: ${bookingRef}`);

    //Step 7--------------------------------------
    await page.goto(`${base_Url}/events`);
    await expect(eventcards.first()).toBeVisible();
    const updatedCard = eventcards.filter({ hasText: eventTitle }).first();
    await expect(updatedCard).toBeVisible();
    const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
    console.log(`Seats after booking: ${seatsAfterBooking}`);
    expect(seatsAfterBooking).toBe(seats - 1);
})