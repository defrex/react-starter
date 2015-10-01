
import React from 'react';
import Helmet from 'react-helmet';

import style from './home.css';


export default React.createClass({
  render() {
    return (
      <div className={style.base}>
        <Helmet title='Home'/>
        <h2>Home</h2>
      </div>
    );
  },
});
