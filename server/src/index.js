const { routes } = require('./routes');
const Server = require('./server');

const app = new Server();

for (let item of routes) {
    app.setRoute(item);
}

app.listen(80);


