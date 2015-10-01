
process.browser = false;

import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';

import routes from './routes.js';
import settings from './settings/current';


const absolute = (relPath)=> path.join(__dirname, relPath);
const htmlBase = fs.readFileSync(absolute('./index.html'), { encoding: 'utf-8' });
const app = express();


// app.use(favicon(absolute('../public/img/favicon/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(absolute('./public')));

app.use(function(req, res, next) {
  if (req.headers['x-forwarded-protocol'] !== 'https' && settings.SSL !== false)
    res.redirect('https://' + req.headers.host + req.url);
  else
    next();
});

app.use(function(req, res, next) {
  const location = createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps)=> {
    if (redirectLocation)
      return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    else if (error)
      return res.status(500).send(error.message);
    else if (renderProps === null)
      return res.status(404).send('Not found');

    let body = '';

    try {
      body = renderToString(<RoutingContext {...renderProps}/>);
    } catch(error) {
      res.status(500).send(error.message);
      console.error(error.stack);
      return;
    }

    res.status(200).send(htmlBase
      .replace('<!--[body]-->', body)
      .replace('<!--[props]-->', `<script>window.__routeProps=${JSON.stringify(renderProps)};</script>`)
      .replace('<!--[google_analytics_account]-->', settings.GOOGLE_ANALYICS_ACCOUNT)
    );

    next();
  });
});


app.use(function(err, req, res, _next) {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message);
});


const server = app.listen(settings.PORT, function() {
  console.log(`https://localhost:${server.address().port}`);
});
