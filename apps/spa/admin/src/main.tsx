import { ApolloProvider } from '@apollo/client';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { createApolloClient } from '@trail/shared/apps/backend/web/util-react-apollo';

import { App } from './app/App';

import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Missing #root element');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ApolloProvider client={createApolloClient()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
