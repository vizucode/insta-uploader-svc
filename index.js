const puppeteer = require('puppeteer');
require('dotenv').config('.env');
const fs = require('fs');
const cookieFile = 'cookie.json'

async function main() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // inject cookie
  await injectCookie(page)

  // abort showing images
  await abortShowingImage(page)

  // login insta
  await login(page)

  // dismiss notification popup
  await dismissNotifPopup(page)

  // hijack cookie
  await hijackCookie(page)

  // await browser.close()
}

async function abortShowingImage(page) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if(req.resourceType() == 'image') {req.abort();}
    else req.continue();
  })
}

async function dismissNotifPopup(page) {
  await page.waitForNetworkIdle(1000, 1000)
  const[button] = await page.$x("//button[contains(., 'Not Now')]");
  if(button){await button.click();}
}

async function login(page) {
  await page.goto('https://www.instagram.com/', {waitUntil: 'networkidle0', timeout:0})

  // if session is injected
  if (await page.$('input[type=password]') != null) {
    let username = process.env.INSTA_USERNAME
    let password = new Buffer(process.env.INSTA_PASSWORD, 'base64')
    password = password.toString('ascii')
  
    await page.type('input[type=text]', username)
    await page.type('input[type=password]', password)
    await page.click('#loginForm > div > div:nth-child(3) > button');
    await page.waitForNavigation();
  }
}

async function hijackCookie(page) {
  const cookieObj = await page.cookies();
  fs.writeFile(cookieFile, JSON.stringify(cookieObj), (err) => {
    if(err) {
      console.log("failed create cookie")
    }else {
      console.log('cookie saved')
    }
  })
}

async function injectCookie(page) {
  if(fs.existsSync(cookieFile)) {
    const cookieRaw = fs.readFileSync(cookieFile)
    const cookieList = JSON.parse(cookieRaw)
    if(cookieRaw.length !== 0) {
      for (the_cookie of cookieList) {
        await page.setCookie(the_cookie)
      }
      console.log("cookie readed")
    }
  }else {
    console.log("cookie doesn't exist")
  }
}


main()