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
        await connectToMongodb();
        const browser = await puppeteer.launch({
            headless: true,
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
                '--headless',
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

const checkIfInDb = async function (ALLLINKS, link) {

    console.log("checking if in db");

    let query = {url: link};
    let update = {
        $set: {

            url: link,
        }
    };

    await Sleep(1000);
    let options = { upsert: true, returnOriginal:false };

    ALLLINKS.findOneAndUpdate(query, update, options, (err)=>{
        if (err) {
            console.log("Something wrong when updating data!",err);
        }
        console.log("Saved to db!")
    });


};


const singleADCheckIfInDb = async function (SINGLEAD, complete) {

    console.log("checking if in db");

    let query = {url: complete[0]};
    let update = {
        $set: {
            url: complete[0],
            title : complete[1],
            price : complete[2],
            location: complete[3],
            area : complete[4],
            description: complete[5],
            transactionType : complete[6],
            published : complete[7],
            images: complete[8]
        }
    };

    await Sleep(1000);
    let options = { upsert: true, returnOriginal:false };

    SINGLEAD.findOneAndUpdate(query, update, options, (err, doc)=>{
        if (err) {
            console.log("Something wrong when updating data!",err);
        }
        console.log("Saved to db!", doc);
    });


};



module.exports = {Sleep, Browser, checkIfInDb,singleADCheckIfInDb,connectToMongodb};