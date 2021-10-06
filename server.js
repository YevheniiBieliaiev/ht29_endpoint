import http from "http";
import fs from "fs";
import path from "path";

const SERVER_PATH = path.dirname(process.argv[1]);
const PORT = 5000;
const HOMEWORKS = JSON.parse(fs.readFileSync(path.join(SERVER_PATH, "static", "homework.json"), 'utf8'));

// /^\/homework\/?$/.test(endpoint) 
const REG_EXP = /\/homework/ || /\/homework\//;

function regExp(endpoint) {
  if (endpoint.match(REG_EXP)) {
    return '/homework'
  }
}

const SERVER = http.createServer((req, res) => {
  if (regExp(req.url)) {
    res.write(` 
    <!DOCTYPE html> 
        <html lang="en"> 
        <head> 
            <meta charset="UTF-8"> 
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
            <link rel="stylesheet" href="/css/style.css">
            <title>Document</title> 
        </head> 
        <body> 
        <div class="container">
        <div class="ht-links">
            <ol> 
    `);

    HOMEWORKS.forEach(homework => {
      res.write(`<li><a href=${regExp(req.url)}/${homework._id}>${homework.title}</a></li>`);
    });

    res.write(` 
            </ol> 
        </div>
        <div class="task-wrapper">
        `);

    HOMEWORKS.forEach(homework => {
      if (req.url.split("/")[2] === homework._id)
        res.write(`
          <strong class="sensei">Сэнсэй: ${homework.author.first_name} ${homework.author.last_name}</strong>
         ${homework.description}
          <strong>Сдать до:
          ${new Date(homework.time_terms).getDay()}.${new Date(homework.time_terms).getMonth()}.${new Date(homework.time_terms).getFullYear()}г.
         </strong>
          `);
    });

    res.write(`
        </div>
        <div class="school-logo-block">
          <img class="hillel-logo" src="/images/hillel-school-logo.png" alt="HILLEL">
          <img class="pirate-flag" src="/images/pirateflag.png" alt="PIRATEFLAG">
          <span class="copyright">&copy; arr rights reserved</span>
        </div>
        </div>
        </body> 
    </html> 
    `);
    res.end();
  } else {
    const INDEX_PATH = path.join(SERVER_PATH, 'static', req.url);
    fs.readFile(INDEX_PATH, (err, htmlContent) => {
      if (err) {
        res.statusCode = 400;
        res.end();
      }
      res.end(htmlContent);
    });
  }
});

SERVER.listen(PORT, () => {
  console.log('Server is running ' + PORT);
});