const {test, expect} = require('@playwright/test');

test('opening website', async ({browser})=> {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.google.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");

});

test('Assignment-login and place order and verify', async ({browser})=> {
 
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
   
    const email = "pjyoti1908@gmail.com";
    const item = "iphone 13 pro";
    const products = page.locator(".card-body");

    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Abcd@1234");
    await page.locator("[value='Login']").click();

    // await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").last().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    // console.log(titles);

    const count = await products.count();  
    // console.log(count);

    for (let i =0 ; i< count ; ++i){
        // console.log(await products.nth(i).locator("b").textContent());
       
        if(item == await products.nth(i).locator("b").textContent()){         
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    const cart =  page.locator("button[routerlink*='cart']");
    await expect(cart).toBeVisible();
    await cart.click();

    await page.locator("div li").first().waitFor();
    const expecteditem = await page.locator(".cartSection h3").textContent();
    expect(item).toBe(expecteditem);

    await page.locator("text=Checkout").click();

    // await page.getByRole('textbox').nth(2).fill("abcd");
    // // await page.locator("//div[@class='payment__info']//div[3]//div[1]//input[1]").fill("abcd");
    // await page.locator("[name='coupon']").fill("rahulshettyacademy");
    // await page.locator("button[type='submit']").click();  
    // await page.waitForLoadState('networkidle');
    // await expect(page.locator('p.mt-1')).toHaveText('* Coupon Applied');
    
    await expect(page.locator(".user__name label").first()).toHaveText(email);   
    const selectcountry =  page.locator("[placeholder*='Country']")
    await expect(selectcountry).toBeEditable();
    await selectcountry.pressSequentially("ind",  { delay: 250 });
    const country = " India";
    const dropdown = page.locator(".ta-results");
    await dropdown.first().waitFor({ state: 'visible' });
    // await expect(dropdown.first()).toBeVisible();
   
    const optionsCount = await dropdown.locator("button").count();
    for (let i =0 ; i< optionsCount ; ++i){
        const text = await dropdown.locator("button").nth(i).textContent();
        if(country.includes(text)){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await page.locator(".action__submit").click();
   
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId= await page.locator("label[class='ng-star-inserted']").textContent();
    console.log(orderId);
   
    await page.locator("button[routerlink*='myorders']").click();
 
    await page.locator("tbody").waitFor();
    const rows = page.locator("tbody tr");

     for (let i =0 ; i< await rows.count() ; ++i){
        const  rowsid = await rows.nth(i).locator("th").textContent();
        if(orderId.includes(rowsid)){
           await rows.nth(i).locator("button").first().click();        
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    // await page.pause();
})