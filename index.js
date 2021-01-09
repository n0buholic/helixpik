(async () => {
const TelegramBot = require('node-telegram-bot-api');
const token = '1428458871:AAFRgipLH8XabWjM0P9zuz394msCxC3puG8';
const bot = new TelegramBot(token, {polling: true});
const browser = require('./browser')
const fs = require('fs');
const request = require('request');
let b = await browser.browser()
let profile = await b.newPage()

const cookies = fs.readFileSync('cookie.json', 'utf8')
const deserializedCookies = JSON.parse(cookies)

await profile.setCookie(...deserializedCookies)
await profile.goto('https://www.freepik.com/profile/me')
setInterval(async () => {
    await profile.evaluate(() => {
        location.reload(true)
     })
}, 20 * 1000)

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `WELCOME TO HELIXPIK 1.0 - Freepik Bot Downloader
        \n\nLihat menu dibawah untuk menggunakan:
        \n-----------------------------------------------------------------------------------------------------
        \n<b>🛠️COMMANDS:</b>
        \nCara Pakai: /get Link-Freepik-Disini
        \n/get LINK-FREEPIK (Untuk Non-Premi Vector)
        \n/vip LINK-FREEPIK (Untuk Premium Vector)
        \n-----------------------------------------------------------------------------------------------------
        \n<b>💸UPGRADE AKUN:</b>
        \n/subsovo <pre>(Pembayaran via OVO)</pre>
        \n/subsgopay <pre>(Pembayaran via GoPay)</pre>
        \nCATATAN : Ketika sudah melakukan pembayaran, silahkan ketik /subs lalu kirimkan Bukti Pembayaran & ID anda kepada admin.
        \n-----------------------------------------------------------------------------------------------------
        \n<b>💸PRICELIST:</b>
        \nRp.200.000/Tahun
        \nRp.75.000/Bulan
        \nRp.40.000/Minggu
        \nRp.5.000/Hari
        \n-----------------------------------------------------------------------------------------------------
        \n\n
        \n<b>Powered by Helix</b>
        \n<b>[+] Website : https://helixproject.pw</b>`
         ,{parse_mode : "HTML"});
    });

bot.onText(/\/subs/, (msg) => {
    bot.sendMessage(msg.chat.id, `
    ID Kamu: ${msg.from.id}
    \nSilahkan Kirim Bukti Pembayaran & ID kamu untuk konfirmasi kepada salahsatu admin dibawah:
    \n✅ADMIN 1 - @rtzki 
    \n✅ADMIN 2 - @n0buholic`
    ,{parse_mode : "HTML"});
})

bot.onText(/\/subsovo/, (msg) => {
    //QR OVO
    bot.sendPhoto(msg.chat.id,"ovo.jpg",{caption : "Silahkan scan QR diatas \n Untuk Pembayaran"} );  
});

bot.onText(/\/subsgopay/, (msg) => {
    //QR GOPAY
    bot.sendPhoto(msg.chat.id,"gopay.jpg",{caption : "Silahkan scan QR diatas \n Untuk Pembayaran"} );  
});


bot.onText(/\/get2 (.+)/, (msg,match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    
    if (validURL(resp) == false) {
        bot.sendMessage(msg.chat.id, "invalid url")
        return
    }

    // url bukan freepik
    if (!resp.includes("freepik.com") || !resp.includes("_") || !resp.includes(".")) {
        bot.sendMessage(msg.chat.id, "bapak kau lah")
        return
    }

    let pecah = resp.split("_")
    let id = pecah[1].split(".")[0]

    request(resp, {}, function (err, r, body) {
        bot.sendDocument(msg.chat.id, "https://www.freepik.com/download-file/"+id).catch((error) => {
            if (error.response.body.description.includes("wrong file")) {
                bot.sendMessage(msg.chat.id, "kok kosong.")
            }
        })
        console.log("prosas proses ngentot lo...")
    })
});

bot.onText(/\/get (.+)/, async (msg,match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    if (validURL(resp) == false) {
        bot.sendMessage(msg.chat.id, "invalid url")
        return
    }

    const from = msg.from.id
    let ids = JSON.parse(await checkId())

    ids.feed.entry.forEach(async (id) => {
        if (id.gsx$idpremi.$t == from.toString()) {
            if (id.gsx$exp.$t < new Date().toLocaleDateString()) {
                bot.sendMessage(msg.chat.id, `Akun kamu sudah expired ☹️ - Expired pada: ${id.gsx$exp.$t}`)
                return
            }

            let download = await b.newPage()
            await download.goto(resp)
            await download._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: __dirname})
            await download.click('.download-button')
            download.on('request', async (req) => {
                if (req.url().includes('.zip')) {
                    let url = new URL(req.url())
                    let filename = url.pathname.split("/")[6]
                    await bot.sendMessage(msg.chat.id, `Found ${filename}`)
                    let loop = setInterval(async () => {
                        let check = await checkFile(filename)
                        if (check == true) {
                            clearInterval(loop)
                            await bot.sendDocument(msg.chat.id, filename)
                            await fs.unlinkSync(filename)
                            await download.close()
                        }
                    }, 2 * 1000)
                }
            })
        } else {
            // kontol??????
            await bot.sendMessage(msg.chat.id, `Maaf, kamu tidak bisa menggunakan fitur ini. Silahkan UPGRADE akun kamu.`)
        }
    })
        
});

    async function checkFile(path) {
        return new Promise(resolve => {
            if (fs.existsSync(path)) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }

    async function checkId() {
        return new Promise(resolve => {
            request("https://spreadsheets.google.com/feeds/list/1ezf9Dh9hbC0MTvv4bJrk3yC2O2HyZP_zinua4DbS7bo/1/public/values?alt=json", {}, (err, resp, body) => {
                resolve(body)
            })
        })
    }

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }

})()