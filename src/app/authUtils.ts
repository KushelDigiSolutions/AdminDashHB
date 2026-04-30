import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  Auth,
} from 'firebase/auth';

class FirebaseAuthBackend {
  auth: Auth | null = null;

  constructor(firebaseConfig) {
    if (firebaseConfig) {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      this.auth = getAuth(app);
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          sessionStorage.setItem('authUser', JSON.stringify(user));
        } else {
          sessionStorage.removeItem('authUser');
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      if (!this.auth) {
        reject('Firebase auth is not initialized');
        return;
      }

      createUserWithEmailAndPassword(this.auth, email, password).then(
        () => {
          const user = this.auth?.currentUser;
          resolve(user);
        },
        (error) => {
          reject(this._handleError(error));
        },
      );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      if (!this.auth) {
        reject('Firebase auth is not initialized');
        return;
      }

      signInWithEmailAndPassword(this.auth, email, password).then(
        () => {
          const user = this.auth?.currentUser;
          resolve(user);
        },
        (error) => {
          reject(this._handleError(error));
        },
      );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email) => {
    return new Promise((resolve, reject) => {
      if (!this.auth) {
        reject('Firebase auth is not initialized');
        return;
      }

      sendPasswordResetEmail(this.auth, email, {
        url: window.location.protocol + '//' + window.location.host + '/login',
      })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      if (!this.auth) {
        reject('Firebase auth is not initialized');
        return;
      }

      signOut(this.auth)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  setLoggeedInUser = (user) => {
    sessionStorage.setItem('authUser', JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!sessionStorage.getItem('authUser')) {
      return null;
    }
    return JSON.parse(sessionStorage.getItem('authUser'));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    const errorMessage = error?.message ?? error;
    return errorMessage;
  }
}

// tslint:disable-next-line: variable-name
let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config) => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
