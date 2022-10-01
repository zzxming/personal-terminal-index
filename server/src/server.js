const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const http = require('http');

// 请求大小限制
const requestLimit = "5120kb";


class Server {
    constructor() {
        this.app = express();

        this.app.use(morgan('short'));
        this.app.use(bodyParser.urlencoded({ extended: false, limit: requestLimit }));
        this.app.use(bodyParser.json({ limit: requestLimit }));
        this.server = http.createServer(this.app);
    }

    setRoute(routeOption) {
        let method = routeOption.method || 'post';
        const handler = async (req, res) => {
            const event = Object.assign(req.body, req.query, req.params);
            let result;
            try {
                result = await routeOption.handle(event, req, res);
                result = {
                    code: 0,
                    data: result
                }
            }
            catch(e) {
                console.error(`request path ${req.path} error`, e);
                result = {
                    code: 500,
                    data: null,
                    message: e.message
                }
            }
            res.send(result);
        }
        this.app[method](routeOption.path, handler);
    }

    listen(port) {
        this.port = port;
        this.server.listen(port, () => console.log(`serve start at port ${this.port}`))
    }
}

module.exports = Server;
