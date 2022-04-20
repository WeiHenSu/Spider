var request = require("request")
var cheerio = require("cheerio")
var express = require("express")
var cors = require("cors")
var app = express()


app.use(cors()) //解決cors問題

app.get("/", function (req, res) {  //express
    (async function () {
      var post = await getPost()
      res.json(post)
    })()
  }).listen(3000)

  var options = {
    method: "GET",
    url: "https://www.ptt.cc/bbs/Stock/index.html",
  }

function doRequest(options) { //取post資訊
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      const $ = cheerio.load(body)
      var list = $(".r-ent")    //每篇貼文的資訊存在r-ent class裡
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
        }else{
          reject(error)
        }
    })
  })
}

function getPageIndex(options) {  //取總頁
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      const $ = cheerio.load(body)
      let prev = $(".btn-group-paging a").eq(1).attr("href").match(/\d+/)[0] 
      if (!error && res.statusCode == 200) {
          resolve(prev)
      } else {
          reject(error)
      }
    })
  })
}


async function getPost() {    //將三頁的資訊push進data
    let prev = await getPageIndex(options)
    // console.log(prev) 4993 page
    let data = []
    for (var i = parseInt(prev) - 1; i <= parseInt(prev) + 1; i++) {    //取三頁
      let res = await doRequest("https://www.ptt.cc/bbs/Stock/index" + i + ".html")
      data.push(res)
    }
    // console.log(data[0].length + data[1].length + data[2].length)
    return data
}

