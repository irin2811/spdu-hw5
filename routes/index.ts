import express from "express";
import logging from "../middleware/global/logging";
import checkToken, { tokens } from "../middleware/local/checktoken";

const router = express.Router();

let users: Array<{id: number, name: string, password: string}> = [
    {id: 1, name: 'standard', password: 'password'} // default user
];

const userExists = (name: string, password: string): boolean => {
    const userNameExists = users
        .map(item => item.name)
        .includes(name);

    const userPasswordExists = users
        .map(item => item.password)
        .includes(password);

    return (userNameExists && userPasswordExists);
}

router.post('/auth', logging, (req, res) => {
    const name = req.body.name as string;
    const password = req.body.password as string;
    if(name && password) {
        if(userExists(name, password)) {
            const token = (Math.random() + 1).toString(36).substring(7);
            tokens.push(token);
            res
                .set('Content-Type', 'application/json')
                .send({ token })
                .status(200)
        } else {
            res
                .status(404)
                .json({ message: 'Wrong user or password!' });
        }
    } else {
        res
            .status(400)
            .json({ message: 'Bad request!' });
    }
});

router.get('/users', checkToken, logging, (req, res) => {;
    res
        .status(200)
        .send(JSON.stringify(users));
});

router.get('/user/:id', checkToken, logging, (req, res) => {;
    const id = +req.params.id as number;

    if(id <= users.length) {
        for (let user of users) {
            if (user.id === id) {
                res
                    .status(200)
                    .send(JSON.stringify(user))
            }
        }
    } else {
        res
            .status(404)
            .send('User is not found');
    }
});

router.get('/report', checkToken, logging, (req,res) => {
    res.render('index', { users });
});

router.post('/user', checkToken, logging, (req, res) => {
    const name = req.body.name as string;
    const password = req.body.password as string;

    if(name && password) {
        const id = users.length + 1;
        users.push({id, name, password});
        res
            .status(200)
            .send(`${name} is added to local database`);
    } else {
        res
            .status(400)
            .json({ message: 'Bad request!' });
    }
});

router.patch('/user/:id', checkToken, logging, (req, res) => {
    const id = +req.params.id as number;
    const updateUserName = req.body.name as string;
    const updateUserPassword = req.body.password as string;

    if(id <= users.length) {
        users.map(item => {
            if(id === item.id) {
                updateUserName ? item.name = updateUserName : item.name;
                updateUserPassword ? item.password = updateUserPassword : item.password;
                res
                    .status(200)
                    .send('User was updated');
            }
        });
    } else {
        res
            .status(404)
            .send('Wrong user id');
    }
});

router.delete('/user/:id', checkToken, logging, (req, res) => {
    const id = +req.params.id as number;

    users = users.filter(item => {
        if(id !== item.id) {
            return true;
        }
        return false;
    });
    if(id <= users.length) {
        res
            .status(200)
            .send('User was deleted');
    } else {
        res
            .status(404)
            .send('Wrong user id');
    }
});

export default router;
