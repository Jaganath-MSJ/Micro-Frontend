export function getUserMessage(user: boolean = false) {
  if (!user) {
    return "User is not logged in pls login to use this feature";
  }
  return "Ashsome you are logged in";
}
