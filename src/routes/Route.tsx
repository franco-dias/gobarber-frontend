import React from 'react';
import { Route as ReactDomRoute, RouteProps as RouteDomProps, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends RouteDomProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}: RouteProps) => {
  const { user } = useAuth();

  return (
    <ReactDomRoute
      {...rest}
      render={({ location }): JSX.Element => (isPrivate === !!user ? (
        <Component />
      ) : (
        <Redirect to={{ pathname: isPrivate ? '/' : '/dashboard', state: { from: location } }} />
      ))}
    />
  );
};

export default Route;
