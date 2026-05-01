import { initializeApp } from 'firebase/app';
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
  private auth: Auth | null = null;

  constructor(firebaseConfig: any) {
    if (firebaseConfig) {
      const app = initializeApp(firebaseConfig);
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

  private getAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase auth is not initialized.');
    }
    return this.auth;
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.getAuth(), email, password)
        .then(() => {
          resolve(this.getAuth().currentUser);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.getAuth(), email, password)
        .then(() => {
          resolve(this.getAuth().currentUser);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email: string) => {
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(this.getAuth(), email, {
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
      signOut(this.getAuth())
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  setLoggeedInUser = (user: any) => {
    sessionStorage.setItem('authUser', JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    const storedUser = sessionStorage.getItem('authUser');
    if (!storedUser) {
      return null;
    }
    return JSON.parse(storedUser);
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error: any) {
    const errorMessage = error?.message || error?.toString() || 'An unknown error occurred';
    return errorMessage;
  }
}

// tslint:disable-next-line: variable-name
let _fireBaseBackend: FirebaseAuthBackend | null = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config: any) => {
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
