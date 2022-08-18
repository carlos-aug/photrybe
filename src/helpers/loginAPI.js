export const requestLogin = async (email, password) => {
  return {
    statusCode: password === "11111111" ? 401 : 200,
    json: () => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve({
            email,
            isAdmin: email.includes(".admin")
          })
        }, 1000);
      });
    }
  }
}
