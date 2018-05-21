import * as React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  Redirect,
  browserHistory
} from 'react-router';
import * as ReactGA from 'react-ga';
import AsyncProps from 'async-props';

import AppContainer from './components/AppContainer';
import ProductLanding from './product-landing';
import Login from './login';
import Register from './register';
import Trade from './trade';
import TradeView from './trade/components/TradeView';
import IssueAsset from './issue-asset';

function isBrowser() {
  return typeof window !== 'undefined' && window.document && window.document.createElement;
}

// function checkAuth(nextState, replace, callback) {
//   if (isBrowser()) {
//     // check logged in first
//     const accessToken = Auth.accessToken;
//     if (!accessToken) {
//       // not logged in; redirect to login page.
//       replace({
//         pathname: '/login', 
//         state: {
//           prev: nextState.location.pathname + nextState.location.search
//         }
//       });
//     }
//     callback();
//   } else {
//     // for server side, the redirect to the login page is already done
//     callback();
//   }
// }

// /**
//  * Checks if redirects should be made for ':orgname.bidsquid.com' - redirects to 'bidsquid.com/organizations/:orgname/...'
//  * @param {Object} nextState 
//  * @param {Function} replace 
//  * @param {Function} callback 
//  */
// function checkSubdomainRerouting(nextState, replace, callback) {
//   if (typeof window === 'object') {
//     const organizationId = getOrganizationIdFromUrl(window.location.hostname);

//     if (organizationId != null) {
//       replace({
//         pathname: `/organizations/${organizationId}${window.location.pathname}`
//       });
//     }
//   }

//   callback();
// }

function renderAsyncProps(props) {
  return (
    <AsyncProps {...props} renderLoading={() => {
        return (
          <LoadingPage/>
        );
      }}
    />
  );
}

function resetScrollPosition(prevState, nextState) {
  if (typeof window === 'object' && nextState.location.action !== 'POP') {
    window.scrollTo(0, 0);
  }
}

if (isBrowser()) {
  // ReactGA.initialize('UA-93024036-1');
  // browserHistory.listen(({ pathname, search }) => {
  //   const page = pathname + search;
  //   ReactGA.set({ page });
  //   ReactGA.pageview(page);
  // });
}

const notFound = () => {
  return (
    <div>
      <h1>
        The page could not be found (404)
      </h1>
    </div>
  );
};

const appRouter = () => {
  return (
    <Router history={browserHistory} render={renderAsyncProps}>
      <Route path='/' component={ProductLanding}>
      </Route>
      <Route component={AppContainer}>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/trade' component={Trade}/>
        <Route path='/trade/asset/:assetId' component={TradeView}/>
        <Route path='/issue' component={IssueAsset}/>
      </Route>
    </Router>
  );
};

export default appRouter;