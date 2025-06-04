import { AppDispatch } from "@/Store/store";
import { setAccess, setRefresh } from "@/Features/User/userSlice";

// Token key constants
const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
// const AUTH_STATE_KEY = "isAuthorized";

/**
 * Saves authentication tokens to localStorage
 */
export const saveAuthTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  // Save authentication state
  // localStorage.setItem(AUTH_STATE_KEY, "true");
  
  console.log("Auth tokens saved to localStorage");
};

/**
 * Clears authentication tokens from localStorage
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // localStorage.removeItem(AUTH_STATE_KEY);
  
  console.log("Auth tokens cleared from localStorage");
};

/**
 * Checks if a JWT token is expired
 * @param token The JWT token to check
 * @returns boolean indicating if the token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Get the payload part of the JWT (second part)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    
    // Decode the base64 payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if the token has an expiration time
    if (!payload.exp) return false;
    
    // Compare expiration time with current time
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    return currentTime > expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't parse the token, consider it expired
  }
};

/**
 * Checks if the user is authenticated based on token presence and validity
 */
// export const isAuthenticated = (): boolean => {
//   const token = localStorage.getItem(ACCESS_TOKEN_KEY);
//
//   if (!token) return false;
//
//   // Check if the token is expired
//   if (isTokenExpired(token)) {
//     console.log('Token is expired, clearing auth state');
//     clearAuthTokens();
//     return false;
//   }
//
//   return true;
// };

/**
 * Gets the access token from localStorage
 */
export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  // If token exists, check if it's expired
  if (token && isTokenExpired(token)) {
    console.log('Access token is expired, clearing it');
    clearAuthTokens();
    return null;
  }
  
  return token;
};

/**
 * Gets the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Restores authentication state from localStorage to Redux
 */
export const restoreAuthState = (dispatch: AppDispatch): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  if (accessToken) {
    // Set the access token in Redux
    dispatch(setAccess(accessToken));
    
    if (refreshToken) {
      dispatch(setRefresh(refreshToken));
    }
    
    // Explicitly set the isAuthorized state to true
    // dispatch(setIsAuthorized(true));
    
    console.log("Auth state restored from localStorage");
    return true;
  } else {
    // If no valid token was found, ensure isAuthorized is set to false
    // dispatch(setIsAuthorized(false));
    console.log("No valid auth token found, setting isAuthorized to false");
    return false;
  }
};
