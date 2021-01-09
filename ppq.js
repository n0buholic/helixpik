const fs = require("fs");

(async () => {

    let loop = setInterval(async () => {
        let check = await checkFile("ppq.txt")
        console.log("woi anjing")
        if (check == true) {
            clearInterval(loop)
            console.log("ok")
        }
    }, 2 * 1000)

    async function checkFile(path) {
        return new Promise(resolve => {
            if (fs.existsSync(path)) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }
})()