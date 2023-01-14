const puppeteer = require('puppeteer');
require('dotenv').config('.env');
const fs = require('fs');
const { parse } = require('path');
const { env } = require('process');
const cookieFile = 'cookie.json'

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

  // dismiss notification popup
  await dismissNotifPopup(page)

  // trigger upload form and upload image
  await uploadImage(page)

  console.log('finished, :)')
  await browser.close()

}

async function abortShowingImage(page) {
  console.log('abort showing images...')
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if(req.resourceType() == 'image') {req.abort();}
    else req.continue();
  })
}

async function uploadImage(page) {
  console.log('uploading...')
  if(await page.$('svg[aria-label="New post"]') !== null) {
    await page.click('svg[aria-label="New post"]');

    // wait filechooser
    try {
        // await page.waitForSelector('div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > div > div > div._ab8w._ab94._ab97._ab9f._ab9k._ab9p._abc2._abcm > div > button')
        // const buttonUpload = await page.$("div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > div > div > div._ab8w._ab94._ab97._ab9f._ab9k._ab9p._abc2._abcm > div > button");
        // await buttonUpload.click()
        // await page.waitForFileChooser({timeout: 10000}).then(res => {
        //   res.accept(['kurisu.png'])
        // })

        // const [filechooser] = await Promise.all([
        //   page.waitForFileChooser({timeout: 5000}),
        //   page.click('div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > div > div > div._ab8w._ab94._ab97._ab9f._ab9k._ab9p._abc2._abcm > div > button'),
        // ])
        // await filechooser.accept(['kurisu.png'])

        await page.waitForSelector('div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > form > input');
        const inputUploadHandler = await page.$('div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x1iyjqo2.xs83m0k.xdl72j9.xqbdwvv.x1cwzgcd > div.x78zum5.x5yr21d.xl56j7k.x6s0dn4.xh8yej3 > form > input');
        let filename = 'kurisu.png';
        await inputUploadHandler.uploadFile(filename);

        // next step click to filter
        await nextStepClickButton(page, 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > div > div > div._ac7b._ac7d > div > button', 'next to filter..')

        // next step click to caption
        await nextStepClickButton(page, 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > div > div > div._ac7b._ac7d > div > button', 'next to caption..')

        // finished step
        await nextStepClickButton(page, 'div > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div > div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abcm > div > div > div._ac7b._ac7d > div > button', 'on shared please wait...')

    }catch(err) {
      console.log('error upload image..')
      console.log(err)
    }
  }
}

async function nextStepClickButton(page, selector, log) {
  console.log(log)
  await page.waitForSelector(selector);
  const nextButton = await page.$(selector)
  await nextButton.click();
  await page.waitForNetworkIdle(1000,1000)
}

async function dismissNotifPopup(page) {
  console.log('dismiss notification popup...')
  await page.waitForNetworkIdle(1000, 1000)
  const[button] = await page.$x("//button[contains(., 'Not Now')]");
  if(button){await button.click();}
}

async function login(page) {
  console.log('login...')
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


main()