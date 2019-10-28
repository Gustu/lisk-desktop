/* istanbul ignore file */
// Coverage of this file is ignored because it's a central integration point
// of the whole app. If anything goes wrong here, e2e tests will fail,
// so it's covered by e2e tests.
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import styles from './app.css';
import Toaster from '../components/shared/toaster';
import LoadingBar from '../components/shared/loadingBar';
import OfflineWrapper from '../components/shared/offlineWrapper';
import CustomRoute from '../components/shared/customRoute';
import NotFound from '../components/shared/notFound';
import InitializationMessage from '../components/shared/initializationMessage';
import routes from '../constants/routesForApp';
import Header from '../components/shared/header/header';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';

class App extends React.Component {
  constructor() {
    super();
    this.state = { loaded: false };
  }

  markAsLoaded() {
    this.setState({ loaded: true });
  }

  componentDidMount() {
    this.markAsLoaded();
  }

  render() {
    const { location, history } = this.props;
    const allRoutes = Object.values(routes);
    const mainClassNames = [
      styles.bodyWrapper,
      (this.state.loaded ? `${styles.loaded} appLoaded` : ''),
    ].join(' ');
    const routeObj = Object.values(routes).find(r => r.path === location.pathname) || {};

    return (
      <OfflineWrapper>
        <DialogHolder />
        <Header
          isSigninFlow={routeObj.isSigninFlow}
          location={location}
        />
        <main
          className={mainClassNames}
          ref={(el) => { this.main = el; }}
        >
          <section>
            <FlashMessageHolder />
            <InitializationMessage history={history} />
            <div className={`${styles.mainContent} ${!routeObj.isSigninFlow ? styles.mainBox : ''}`}>
              <Switch>
                {this.state.loaded && allRoutes.map(route => (
                  route.isSigninFlow
                    ? (
                      <Route
                        path={route.path}
                        key={route.path}
                        component={route.component}
                        exact={route.exact}
                      />
                    ) : (
                      <CustomRoute
                        path={route.path}
                        pathSuffix={route.pathSuffix}
                        component={route.component}
                        isPrivate={route.isPrivate}
                        exact={route.exact}
                        forbiddenTokens={route.forbiddenTokens}
                        key={route.path}
                      />
                    )
                ))}
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
          </section>
          <Toaster />
        </main>
        <LoadingBar markAsLoaded={this.markAsLoaded.bind(this)} />
      </OfflineWrapper>
    );
  }
}

export default withRouter(App);
