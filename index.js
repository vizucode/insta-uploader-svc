const puppeteer = require('puppeteer');
require('dotenv').config('.env');
const fs = require('fs');
const cookieFile = 'cookie_memory.json'

async function main() {
  let browser = await puppeteer.launch();
  if (process.env.ENVIRONMENT == "dev") {
    browser = await puppeteer.launch({headless: false});
  }

  const page = await browser.newPage();

  // inject cookie
  await injectCookie(page)

  // abort showing images
  await abortShowingImage(page)

  // login insta
  await login(page)

  // add delay for 1s
  await delay(1000)

  // dismiss notification popup
  await dismissNotifPopup(page)

  // add delay for 1s
  await delay(5000)

  // trigger upload form and upload image
  await uploadImage(page, 'void high lord')

  console.log('finished, :)')
  // await browser.close()

}

async function abortShowingImage(page) {
  console.log('abort showing images...')
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if(req.resourceType() == 'image') {req.abort();}
    else req.continue();
  })
}

async function uploadImage(page, caption) {
  console.log('uploading...')

  // if browser is reload and notif popup again.
  // check if file cookie is exist
  await dismissNotifPopup(page)

  // wait for selector is ready.
  await page.waitForSelector('svg[aria-label="New post"]')
  
  if(await page.$('svg[aria-label="New post"]') !== null) {
    await page.click('svg[aria-label="New post"]');

    // wait filechooser
    try {
        await page.waitForSelector('div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > form > input');
        const inputUploadHandler = await page.$('div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > form > input');
        let filename = 'kurisu.png';
        await inputUploadHandler.uploadFile(filename);

        // next step click to filter
        await nextStepClickButton(page, 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > div > div > div._ac7b._ac7d > div > button', 'next to filter..')

        // next step click to caption
        await nextStepClickButton(page, 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > div > div > div._ac7b._ac7d > div > button', 'next to caption..')

        // finished step
        await nextStepClickButton(page, 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > div > div > div._ac7b._ac7d > div > button', 'on shared please wait...', caption)

    }catch(err) {
      console.log('error upload image..')
      console.log(err)
    }
  }
}

async function nextStepClickButton(page, selector, log, caption) {
  console.log(log)
  if(log === 'on shared please wait...' && caption !== '') {
    let textArea = 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.x13vbajr.x1ue5u6n.x78zum5 > div.x13ehr01.x9f619.x78zum5.x1n2onr6.x1f4304s > div > div > div > div:nth-child(2) > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > textarea'
    await page.waitForSelector(textArea)
    await page.type(textArea, caption)
  }

  await page.waitForSelector(selector);
  const nextButton = await page.$(selector)
  await nextButton.click();
  await delay(1000)
}

async function dismissNotifPopup(page) {
  console.log('dismiss notification popup...')
  // await page.waitForXPath("//button[contains(., 'Not Now')]")
  const[button] = await page.$x("//button[contains(., 'Not Now')]");
  if(button){await button.click();}
}

async function login(page) {
  console.log('login...')
  await page.goto('https://www.instagram.com/', {waitUntil: 'networkidle0', timeout:0})

  // if session is injected
  await delay(1000)
  if (await page.$('input[type=password]') != null) {
    let username = process.env.INSTA_USERNAME
    let password = new Buffer(process.env.INSTA_PASSWORD, 'base64')
    password = password.toString('ascii')
  
    await page.type('input[type=text]', username)
    await page.type('input[type=password]', password)
    await page.click('#loginForm > div > div:nth-child(3) > button');
    await page.waitForNavigation();

    // hijack cookie
    await hijackCookie(page)
  }
  console.log('logged.')
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
  console.log('reading cookie...')
  if(fs.existsSync(cookieFile)) {
    const cookieRaw = fs.readFileSync(cookieFile)
    const cookieList = JSON.parse(cookieRaw)
    if(cookieRaw.length !== 0) {
      for (the_cookie of cookieList) {
        await page.setCookie(the_cookie)
      }
      if (process.env.ENVIRONMENT == "dev") {
        console.log("cookie readed")
      }
    }
  }else {
    console.log("cookie doesn't exist")
  }
}

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

main()