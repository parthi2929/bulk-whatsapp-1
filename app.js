//1. Import
var express = require("express");
var http = require("http");
var routes = require("./routes/route.js");
var quillLib = require("./routes/quillLib.js");
const puppeteer = require('puppeteer');

//1.1 IMPORT SOCKET
var socket = require("socket.io");

//2. Initialize
var app = express();
var server = http.createServer(app);
app.set("view engine","ejs");
var selectors = [
    '.compose-btn-send',
    '.popup-contents'
  ];
const TEXT_SELECTOR = '#main > footer > div.block-compose > div.input-container > div > div.pluggable-input-body.copyable-text.selectable-text';



//thanks to:https://stackoverflow.com/questions/47002776/how-to-pass-the-page-element-to-a-function-with-puppeteer
const check = async(element, page) => (await page.$(element) !== null); // Make it async, return true if the element is visible
//app.use(express.static(__dirname + "/public"));

//2.1 HOOKUP SOCKET TO SERVER
var socketServer = socket.listen(server); 

//3. Route - Paged(GET)/Pageless(POST)
app.get("/", routes.index);


//4. Create port and listen to server
var port = process.env.PORT || 8080;
server.listen(
    port,
    function(request, response)
    {
        console.log("Catch action at http://localhost: " + port);
    }
);

//5. SERVER SIDE SOCKET OPERATIONS

//5.1 Inform when a socket connects
socketServer.on(
    "connection",
    function(socketFromClient)
    {
        console.log("A new socket connected");

        //5.1.1 RECEIVING EVENT FROM CLIENT
        socketFromClient.on(
            "Start Request Event",
            function(totalDetailsArray)
            {
                var numbersArray = totalDetailsArray.numbersArray;
                var encodedMessage = encodeURIComponent( quillLib.encodeWhatsAppFormatFromQuill(totalDetailsArray.rawMessage));
                //console.log("Message to broadcast: " + encodedMessage);
                run(socketFromClient, numbersArray,encodedMessage);  //passing raw message itself..
                          
            }
        );

        //5.2 If that user disconnects..
        socketFromClient.on(
            "disconnect",
            function()
            {
                console.log("Socket disconnected");
            }
        );
    }
);


async function run(socketFromClient,numbersArray, targetMessage)
{  
    var totalCounter = 0;
    var successCounter = 0;
    var failureCounter = 0;
    const browser = await puppeteer.launch(
        {
            headless: false
        });
    const page = await browser.newPage();        
    var i;
    for(i=0; i<numbersArray.length;i++)
    {
        var url = 'https://web.whatsapp.com/send?phone=' + numbersArray[i] + '&text=' + targetMessage;
        console.log(url);
        await page.goto(url,
            {
                //networkIdleTimeout: 5000,
                //waitUntil: 'networkidle',
                timeout: 3000000
            }
        );
        await page.waitForSelector(selectors.join(', '));
    
        // now lets check for the h1 element on example.com
        const isSendButtonPresent = await check(selectors[0], page);
        console.log(`Send Button Found? : ${isSendButtonPresent}`);
    
        // now lets check for the h1 element on example.com
        const isPopupPresent = await check(selectors[1], page);
        console.log(`Popup Found? : ${isPopupPresent}`);  
    
        if (isSendButtonPresent)
        {
            // page.waitFor(1000);
            // await page.click(TEXT_SELECTOR);
            // await page.keyboard.type(targetMessage);
            // let newMessage = await page.evaluate((sel,val) => {
            //     return document.querySelector(sel).val(val);
            //   }, {TEXT_SELECTOR,targetMessage});            


            page.waitFor(2000);
            await page.click(selectors[0]);
            statusOne = "Send Button Clicked";
            ++successCounter;
            socketFromClient.emit("Status Update Event", {number: numbersArray[i], status: "Success"});
            
        }
        if(isPopupPresent)
        {
            page.waitFor(2000);
            statusOne = "Invalid Number";
            ++failureCounter;
            socketFromClient.emit("Status Update Event", {number: numbersArray[i], status: "Failure"});
        }
        page.waitFor(2000);
        ++totalCounter;
        
    }
    console.log("Result:\n Total Nos: " + totalCounter + "\n Success Nos: " + successCounter + "\n Failed Nos: " + failureCounter);
    socketFromClient.emit("Operation Completion Event");
    page.waitFor(2000);
    browser.close();
    //process.exit(0);

 
    
}

