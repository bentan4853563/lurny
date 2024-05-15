// Hook for authentication checking
const useAuth = () => {
  // Retrieve the token from local storage.
  // The key 'token' should match the key used when setting the token in local storage.
  const token = localStorage.getItem("token");

  // Determine the authentication status based on the presence of a token.
  // The Boolean conversion is implicit, as the !! operator converts its operand to a boolean.
  const isAuthenticated = !!token;

  // Return the authentication status.
  return isAuthenticated;
};

// Export the useAuth hook for use in other parts of the application.
export default useAuth;
