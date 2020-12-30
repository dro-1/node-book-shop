const fs = require("fs");

const reqHandler = (req, res) => {
  const { url, method } = req;
  res.setHeader("Content-Type", "text/html");
  if (url === "/") {
    res.write(`<html>
    <title>My First Server</title>
    <body>
    <h1>Welcome to the Form Page</h1>
    <form action='/message' method='POST'>
    <input type='text' name='message' />
    <button type='submit'>Send IT!</button>
    </form>
    </body>
    </html>
    `);
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      fs.writeFile("message.txt", parsedBody.split("=")[1], () =>
        console.log("done")
      );
    });

    res.writeHead(302, {
      Location: "/",
    });
  }
  res.end();
};

module.exports = {
  handler: reqHandler,
  text: "Some Text",
};
