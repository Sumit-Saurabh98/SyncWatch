export const strongPassword = (password: string): boolean => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\*])(?=.{8,})/;
  
    if (!passwordPattern.test(password) && password.length != 6) {
      return false;
    }
    return true;
  };