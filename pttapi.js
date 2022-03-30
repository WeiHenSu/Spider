var request = require("request")
var cheerio = require("cheerio")
var express = require("express")
var cors = require("cors")
var app = express()
var data = []

var options = {
  method: "GET",
  url: "https://www.ptt.cc/bbs/Stock/index.html",
}

app.use(cors()) //解決cors問題
app.get("/", function (req, res) {  //express
    (async function () {
      var post = await getpost()
      res.json(post)
    })()
  }).listen(3000)

async function doRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      const $ = cheerio.load(res.body)  //讀body
      var list = $(".r-ent")
      let data = []
      for (let i = 0; i < list.length; i++) {
          const title = list.eq(i).find(".title a").text()
          const author = list.eq(i).find(".meta .author").text()
          const date = list.eq(i).find(".meta .date").text()
          const link = list.eq(i).find(".title a").attr("href")
          data.push({ title, author, date, link })
      }
      if (!error && res.statusCode == 200) {  //HTTP 200 代表網頁正常
          resolve(data)
      } else {
          reject(error)
      }
    })
  })
}

async function getPageIndex(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      const $ = cheerio.load(res.body)
      let prev = $(".btn-group-paging a").eq(1).attr("href").match(/\d+/)[0] 
      if (!error && res.statusCode == 200) {
          resolve(prev)
      } else {
          reject(error)
      }
    })
  })
}
// async function main() {
//   let res = await doRequest("https://www.ptt.cc/bbs/Stock/index" + "5009" + ".html")
//   console.log(res)
// }

async function getpost() {
  return new Promise(async (resolve, reject) => {     //await -> 暫停此 async 函式的執行，並且等待傳遞至表達式的 Promise 的解析
    let prev = await getPageIndex(options)
    console.log(prev) //5014 page
    data = []
    for (var i = parseInt(prev) - 1; i <= parseInt(prev) + 1; i++) {
      const res = await doRequest("https://www.ptt.cc/bbs/Stock/index" + i + ".html")
      data.push(res)  // 二維
    }
    console.log(data[0].length + data[1].length + data[2].length)
    resolve(data)
  })
}

