import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

// Proxy specific API requests
app.use("/providers", proxy("http://localhost:3000", {
  proxyReqPathResolver: function (req) {
    console.log(req.originalUrl);
    return req.originalUrl;
  }
}));

app.use("/students", proxy("http://localhost:3000", {
  proxyReqPathResolver: function (req) {
    console.log(req.originalUrl);
    return req.originalUrl;
  }
}));

app.use("/admin", proxy("http://localhost:3000", {
    proxyReqPathResolver: function (req) {
        console.log(req.originalUrl);
        return req.originalUrl;
    }
}));

// Serve static files from the dist directory
app.use(express.static('dist'));

app.listen(8080, () => {
  console.log("Server started on port 8080");
  console.log("Connect by using http://localhost:8080");
});