var express = require('express');
var app = express();

const apiRouter = '../routes/apiRouter';
const authRouter = '../routes/authRouter';

app.use('/api', apiRouter);
app.use('/auth', authRouter);
