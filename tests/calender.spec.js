import {test,expect} from '@playwright/test';

test('Calender test', async ({page}) => {

    //  const context = await browser.newContext();
    //  const page = await context.newPage();
    const date = "27";
    const month = "03";
    const year = "2027";

    const expecteddate = [month,date,year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    // await page.waitForLoadState('networkidle');
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    
    // await page.getByText(month).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month) -1).click();
  
    await page.locator("//abbr[text()='"+date+"']").click();
    //  await page.getByText(date).click();

    const inputs =  await page.locator('.react-date-picker__inputGroup__input')

    for (let i=0 ; i<expecteddate.length;i++){

        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expecteddate[i]);
    }

})