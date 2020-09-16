// TODO:
//  - get price
//  - get number of bedrooms
//  - get number of cars that can be parked
//  - get area size

const utilities = require('./utility_functions.js')
const allUrlsSchema = require('./model.js');
const mongoose = require("mongoose");

let allLinks = [];

// url we are scraping housing prices
const BuyRentUrl = "https://www.buyrentkenya.com/houses-for-sale/westlands/runda?page=";


async function launchPage() {

    try {
        const browser = await utilities.Browser();
        await utilities.connectToMongodb();
        const page = await browser.newPage();
        return page;

    } catch (e) {
        console.log("this error is coming from scrapeDailyNation", e);
    }

}


async function getAllLinksOnPage(page) {
    /**
     * Gets all links in the current page
     * Stores them to the db
     */
    try {
        console.log("On landing page");
        for (let i = 2; i < 9; i++) {
            let currentUrl = BuyRentUrl + i;
            console.log("The current url is ", currentUrl)
            await page.goto(currentUrl, {timeout: 180000});
            console.log("On page ", i)
            console.log('Getting details');
            const selector = ".property-title > a"
            await page.waitForSelector(selector);
            const links = await page.$$eval(selector, am => am.filter(e => e.href).map(e => e.href));
            console.log(links)
            let schema = await allUrlsSchema;
            let ALLLINKS = await mongoose.model('RundaHouses', schema);
            for (let i = 0; i < links.length; i++) {
                allLinks.push(links[i]);
                await utilities.singleADCheckIfInDb(ALLLINKS, links[i]);
            }

        }


    } catch (e) {
        console.log("this error is coming from getAllLinksOnPage", e);
    }

}

// TODO:
//  -This is not working and I dont know why!

// async function getList(page, selector) {
//     let list = await page.evaluate(() => {
//         const lis = Array.from(document.querySelectorAll(selector))
//         return lis.map(li => li.textContent)
//     });
//     return list;
// }

async function getDetail(page, selector) {
    /**
     * @param {object} page current page the browser is on
     * @param {string} selector - selector of the element
     * @return {String} the area of the land
     */
    try {
        let element = (await page.$(selector)) || "";
        if (element !== "") {
            const el = await page.$eval(selector, (element) => {
                return element.innerHTML;

            });
            return await utilities.removeHtmlTags(el);

        } else {
            console.log("No such element");
            return 0;
        }


    } catch (e) {
        console.log('Error from get area function', e);
    }

}

async function getPrice(page) {
    //    get price
    try {

        const price = await getDetail(page, ".amenities-grid > .body-left > .info-row > .item-price > .text-primary");
            const newPrice = price.split(' ')[2]
            const cleanPrice = newPrice.replace(/,/g, '')
            let finalPrice = parseInt(cleanPrice);
            console.log("price", finalPrice);
            if(isNaN(finalPrice)){
                return 0
            }else{

                 return finalPrice
            }


    } catch (e) {
        console.log("This error is coming from getPrice ", e)
    }
}



async function getDetails(page) {
    try {
        console.log("In get details");
        console.log("ALL LINKS ARE", allLinks.length);

        for (let i = 0; i < allLinks.length; i++) {
            await page.goto(allLinks[i], {timeout: 180000});
            //get price
            let price = await getPrice(page);

            //    get beds
            const beds = await getDetail(page, ".col-lg-12 > .table-cell > .info-row > p > .h-beds");

            console.log("beds", beds)

            //    get baths
            const baths = await getDetail(page, ".col-lg-12 > .table-cell > .info-row > p > .h-baths");
            console.log("baths", baths)

            //    get cars
            const cars = await getDetail(page, ".col-lg-12 > .table-cell > .info-row > p > .h-garage");
            console.log("cars", cars)

            //    get area
            let lastArea;
            const area = await getDetail(page, ".col-lg-12 > .table-cell > .info-row > p > .h-area");
            console.log("ARREEEAAA", area)
            if (area === null || area === 0 ) {
                lastArea = 0;
                console.log("newArea", lastArea);

            } else {
                const newArea = area.split(/(?=[²³ⁿºʳᵈ™℠®])/)[0];
                console.log("newArea", newArea)

                const onlyArea = newArea.slice(0, -1);
                console.log("onlyArea", onlyArea)

                const cleanArea = onlyArea.replace(/,/g, '');
                console.log("cleanArea", cleanArea)

                 lastArea = parseInt(cleanArea);
                console.log("lastArea", lastArea)
            }


            //    get general features
            let general, internal, external = [];


            general = await page.evaluate(() => {
                const lis = Array.from(document.querySelectorAll('div.col-md-4:nth-child(1) > div:nth-child(1) >' +
                    ' div:nth-child(2) li'))
                return lis.map(li => li.textContent)
            });
            console.log("general ", general);


            //    get internal features
            internal = await page.evaluate(() => {
                const lis = Array.from(document.querySelectorAll('div.col-md-4:nth-child(3) > div:nth-child(1) >' +
                    ' div:nth-child(2) li'))
                return lis.map(li => li.textContent)
            });
            console.log("internal ", typeof (internal), internal, internal[0]);

            //   get external features
            external = await page.evaluate(() => {
                const lis = Array.from(document.querySelectorAll('div.col-md-4:nth-child(2) > div:nth-child(1) > div:nth-child(2) li'))
                return lis.map(li => li.textContent)
            });

            console.log("external ", typeof (external), external, external[0]);

            //    get description
            const description = await getDetail(page, '.mrc-content-wrap');
            console.log("desc ", description);

            //    store to db
            let schema = await allUrlsSchema;
            let ALLLINKS = await mongoose.model('RundaHouses', schema);
            await utilities.singleADCheckIfInDb(ALLLINKS, allLinks[i], price, parseInt(beds), parseInt(baths), parseInt(cars), lastArea, general, internal, external, description);

        }


    } catch
        (e) {
        console.log(" Error from get details : ", e)
    }
}


async function main() {
    try {
        let page = await launchPage(BuyRentUrl);
        await getAllLinksOnPage(page);
        await getDetails(page);

    } catch (e) {
        console.log(" Error from main : ", e)
    }
}


main()

//  todo:
//      - figure out the features