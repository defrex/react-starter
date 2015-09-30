
import Base from './components/base.js';
import Home from './components/home.js';


export default {
  path: '/',
  component: Base,
  childRoutes: [
    { component: Home },
  ],
};
