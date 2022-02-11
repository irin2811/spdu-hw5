import express from 'express';
import fs from 'fs';
import routes from './routes';

const app = express();
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'twig');

const port = 3000;

app.use(routes);

fs.writeFile('./log.txt', 'API started:\n', {flag: 'w'}, (err) => {
    if(err) {
        console.log(err);
    }
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
