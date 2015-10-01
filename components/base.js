
import React from 'react';
import Helmet from 'react-helmet';


export default React.createClass({
  render() {
    return (
      <div>
        <Helmet
          title='App'
          titleTemplate='%s | SiteName'
          meta={[
            { charset: 'utf-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          ]}
        />
        {this.props.children}
      </div>
    );
  },
});
