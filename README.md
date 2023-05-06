![routinejs](docs/user/routinejs/static/img/RoutineJS-logos-cropped.jpeg 'RoutineJS')

*Routinejs* is a high-performance Node.js web framework that is designed to be faster and more flexible than Express. With built-in Typescript support and a radix trie-based router, Routinejs offers a robust set of features to help you create scalable and maintainable web applications.
Features

- **5x faster than Express:** Routinejs is designed for speed and is optimized for high-performance web applications.
- **Typescript support:** Routinejs has built-in Typescript support, so you can write type-safe code with ease.
- **Radix trie-based router:** The router is built on a radix trie data structure, which allows for efficient routing and low memory usage.
- **Regex support:** Routinejs supports regular expressions as URL paths, giving you more flexibility in defining routes.
-  **Middleware and nested route support:** Middleware can be used to modify request and response objects, and nested routes can be defined for more complex applications.
-  **Express plugin/middleware support:** Routinejs supports almost all existing Expressjs plugins and middlewares, making it easy to switch from Express.
-  **Built-in body parser and cookie-parser:** Routinejs includes built-in middleware for parsing request bodies and cookies.
-  **Fast-safe-stringify JSON responder:** Routinejs has a built-in JSON responder using fast-safe-stringify, which is faster than native JSON.stringify and can detect circular objects.

Usage

Here is an example of how to use Routinejs:

```js
import Routine, { Request, Response } from "@juniordev/routinejs";

const app = new Routine();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
```
####  You can also use a nested router like this:

```js

// src/router.ts
import { Router, Request, Response } from "@juniordev/routinejs";

const router = new Router();

router.get("/router", (req: Request, res: Response) => {
  res.json({
    msg: "from router"
  });
});

export default router;
```

```js

// src/index.ts
import Routine from "@juniordev/routinejs";
import router from "./router";

const app = new Routine();

//Using a nested router
app.use("/nested", router);

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
```
#### Middleware support

Routinejs supports almost all existing Expressjs middlewares and plugins, making it easy to switch from Express. Here are some examples:
Morgan

**Morgan** is a popular middleware for logging HTTP requests. Here is an example of how to use Morgan with Routinejs:

```js

import Routine, { Request, Response } from "@juniordev/routinejs";
import morgan from "morgan";

const app = new Routine();

// Use Morgan middleware
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
```

**Body parser**
Body parser is a middleware for parsing request bodies. Here is an example of how to use body parser with Routinejs:

```js
import Routine, { Request, Response } from "@juniordev/routinejs";
import bodyParser from "body-parser";

const app = new Routine();

// Use body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Hello, world!");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
```

Benchmarks
Routinejs has been benchmarked against Express and has been found to be 5x faster. Benchmark code is available within the repo.
License

Routinejs is licensed under the MIT License.

Documentation: https://routine.juniordev.net/docs/intro
