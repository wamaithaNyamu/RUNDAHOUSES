const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dotenv = require("dotenv");
dotenv.config();

//Mongodb Atlas uri we are using to connect to the db
const MONGOURI = process.env.MONGOURI;



const connectToMongodb = async function () {
    /**
     * connects to the mongodb instance using the mongouri
     */
    try{
        console.log("Connecting to mongo");

        mongoose.connect(MONGOURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log("Successfully connected to  mongo");

    }catch (e) {
        console.log("Error from connectToMongodb function ", e);
    }

};

const Browser = async function (){
    /**
     * @return browser - returns the browser instance launched by puppeteer
     */
    try{
        console.log("Launching browser...");
        const browser = await puppeteer.launch({
            headless: false,
            args : [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--ignore-certificate-errors',
                '--proxy-server="direct://"',
                '--proxy-bypass-list=*',
                '--hide-scrollbars',
                '--mute-audio',
                '--disable-gl-drawing-for-tests',
                '--use-gl=swiftshader',
                '--disable-infobars',
                '--disable-breakpad',
                '--disable-canvas-aa',
                '--disable-2d-canvas-clip-aa',
                '--deterministic-fetch',
                // '--single-process', // <-  doesn't work on Windows
            ]
        });

        console.log("Successfully launched browser");
        return browser

    }catch (e) {
        console.log("This error is coming from the getBrowser function", e);
    }
}


const Sleep= function(ms) {
    console.log('Sleeping for ', ms);

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}



const singleADCheckIfInDb = async function (SINGLEADMODEL, url, newPrice, beds, baths, cars, lastArea, generalFeatures, internalFeatures, externalFeatures, description) {

    console.log("checking if in db");

    let query = {url:url};
    let update = {
        $set: {
            url: url,
            price : newPrice,
            beds : beds,
            baths: baths,
            cars : cars,
            area: lastArea,
            generalFeatures :generalFeatures,
            internalFeatures : internalFeatures,
            externalFeatures: externalFeatures,
            description: description

        }
    };

    await Sleep(1000);
    let options = { upsert: true, returnOriginal:false };

    SINGLEADMODEL.findOneAndUpdate(query, update, options, (err, doc)=>{
        if (err) {
            console.log("Something wrong when updating data!",err);
        }
        console.log("Saved to db!", doc);
    });


};

let removeHtmlTags = async function (string, array){
    /**
     * @param {String} string takes in the string you want stripped of html elements
     * @param {Array} array takes in an array of tags you want to keep in the string
     * @return {String}  returns the string of stripped html or with the tags you specified maintained
     */
    try {

        return array ? string.split("<").filter(function(val){ return f(array, val); }).map(function(val){ return f(array, val); }).join("") : string.split("<").map(function(d){ return d.split(">").pop(); }).join("");
        function f(array, value){
            return array.map(function(d){ return value.includes(d + ">"); }).indexOf(true) != -1 ? "<" + value : value.split(">")[1];
        }

    }catch (e) {
        console.log("This error is coming from the removeHtmlTags function",e);
    }


}



module.exports = {Sleep, Browser,singleADCheckIfInDb,connectToMongodb, removeHtmlTags};