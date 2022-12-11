import { UserAgentApplication } from 'msal';

import { ImplicitMSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider';
import { MSALAuthenticationProviderOptions } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';
import { Client } from '@microsoft/microsoft-graph-client';

// An Optional options for initializing the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-basics#configuration-options
// const msalConfig = {
//   auth: {
//     clientId: 'ee646a19-b279-4a0b-9a0f-94b9fa27c944',
//     redirectUri: 'http://localhost:3000/auth/callback',
//   },
// };
// const graphScopes = ['user.read']; // An array of graph scopes

// const msalApplication = new UserAgentApplication(msalConfig);
// const options = new MSALAuthenticationProviderOptions(graphScopes);
// const authProvider = new ImplicitMSALAuthenticationProvider(
//   msalApplication,
//   options,
// );

// const client = Client.initWithMiddleware({
//   authProvider: authProvider,
// });

// try {
//   client
//     .api('/me')
//     .get()
//     .then((userDetails) => {
//       console.log(userDetails);
//     });
// } catch (error) {
//   throw error;
// }
