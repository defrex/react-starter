
process.browser = true;

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
// import NProgress from 'nprogress';

import routes from '../routes.js';


ReactDOM.render(
  <Router>{routes}</Router>,
  document.getElementById('root')
);

// Router.run(routes, Router.HistoryLocation, function(Handler, state) {
//   NProgress.start();
//   React.render(<Handler params={state.params}/>, document.getElementById('root'));
//   NProgress.done();
//   window.ga('send', 'pageview');
// });
