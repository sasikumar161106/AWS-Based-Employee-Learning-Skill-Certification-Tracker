import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession
} from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID
});

const getCognitoUser = (email?: string) => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) return currentUser;
  return email ? new CognitoUser({ Username: email, Pool: userPool }) : null;
};

export const cognito = {
  authenticate(email: string, password: string): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const user = getCognitoUser(email);
      if (!user) {
        reject(new Error('Unable to initialize Cognito user pool.'));
        return;
      }

      user.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
        onSuccess: resolve,
        onFailure: reject,
        newPasswordRequired: () => reject(new Error('A new password is required for this account.'))
      });
    });
  },

  getSession(): Promise<CognitoUserSession | null> {
    return new Promise((resolve, reject) => {
      const user = getCognitoUser();
      if (!user) {
        resolve(null);
        return;
      }

      user.getSession((error: Error | null, session: CognitoUserSession | null) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(session && session.isValid() ? session : null);
      });
    });
  },

  getAttributes(email?: string): Promise<CognitoUserAttribute[]> {
    return new Promise((resolve, reject) => {
      const user = getCognitoUser(email);
      if (!user) {
        resolve([]);
        return;
      }
      user.getUserAttributes((error, attributes) => {
        if (error) reject(error);
        else resolve(attributes || []);
      });
    });
  },

  getJwtToken(session: CognitoUserSession): string {
    return session.getIdToken().getJwtToken();
  },

  signOut(): void {
    userPool.getCurrentUser()?.signOut();
  }
};

export const getCognitoUserPool = () => userPool;
