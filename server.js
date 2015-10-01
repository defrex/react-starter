
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import Helmet from 'react-helmet';

import routes from './routes.js';
import settings from './settings/current';


const absolute = (relPath)=> path.join(__dirname, relPath);
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
  match({ routes, location: createLocation(req.url) }, (error, redirect, props)=> {
    if (redirect)
      return res.redirect(301, redirect.pathname + redirect.search);
    else if (error)
      return res.status(500).send(error.message);
    else if (props === null)
      return res.status(404).send('Not found');

    let body = '';

    try {
      body = renderToString(<RoutingContext {...props}/>);
    } catch(error) {
      res.status(500).send(error.message);
      console.error(error.stack);
      return;
    }

    const head = Helmet.rewind();
    console.log('head', head);
    const { title, meta, link } = head;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${title}</title>
          ${meta}
          ${link}
        </head>
        <body>
          <div id="root">${body}</div>
          <script src="/main.js"></script>
        </body>
      </html>
    `;

    res.status(200).send(html);

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
