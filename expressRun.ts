import express from 'express';
import proxy from 'express-http-proxy';
import { handler as FafsaHandler } from './src/lambdaFunctions/getFafsaReport/index';

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

// app.get('/admin/get/fafsa/*', async (req, res) => {
//   console.log("Getting FAFSA info");
//
//   const studentId = req.path.split('/')[4];
//
//   console.log(`student id: ${studentId}`)
//
//   const response = await FafsaHandler({
//     pathParameters: {
//       studentId: studentId
//     }
//   });
//
//   res.set(response.headers || {});
//
//   if (response.isBase64Encoded) {
//     res.status(response.statusCode).send(Buffer.from(response.body, 'base64'));
//   } else {
//     res.status(response.statusCode).send(response.body);
//   }
// });

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
