import{test, expect} from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com'
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const YAHOO_USER = { email: 'abc123@abc.com', password: 'Abc123' };
const GMAIL_USER = { email: 'abc12345@abc.com', password: 'Abc@12345' };

async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test('Assignment_4', async ({page, request})=>{

    //Step 1----
    const login_response = await request.post(`${API_URL}/auth/login`,
        { 
            data:{ email: YAHOO_USER.email , password: YAHOO_USER.password}
        });
    await expect(login_response.ok()).toBeTruthy();
    const body = await login_response.json();
    const token = body.token;
    // console.log(token);

    //Step 2---------
    const event_response = await request.get(`${API_URL}/events`,
        {
            headers: {Authorization: `Bearer ${token}`,
        }
    });
    await expect(event_response.ok()).toBeTruthy();
    const event_body = await event_response.json();
    const eventId = event_body.data[0].id;
    // console.log(eventId);

    //Step 3-----
    const booking_resposne= await request.post(`${API_URL}/bookings`,
        {
            headers : {Authorization: `Bearer ${token}`},
            data : {
                        eventId : eventId ,
                        customerName: "ABCD",
                        customerEmail: "ABCD@email.com",
                        customerPhone: "+91-1234567890",
                        quantity: 1
                    }                  
        }
    )
    await expect(booking_resposne.ok()).toBeTruthy();
    const booking_body = await booking_resposne.json();
    const bookingId = booking_body.data.id;
    // console.log(bookingId);

    //Step 4----------------
    await loginAs(page, GMAIL_USER); 

    //Step 5 ----------------
    page.goto(`${BASE_URL}/bookings/${bookingId}`, { waitUntil: 'networkidle' });

    //Step 6 --------------------
    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();

})

