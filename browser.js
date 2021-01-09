const puppeteer = require('puppeteer');


module.exports.browser = async function browser() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        args:['--user-data-dir=%userprofile%/AppData/Local/Google/Chrome/User Data/Profile 1']
    })
    
    return browser
}