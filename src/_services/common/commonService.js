
export const commonService = {
  checkIsAuthenticated,
}

async function checkIsAuthenticated() {
  // Comment-SB- This functionality is already taken care of in Middleware.

  // let headerSet = getStore("currentUser");
  // if (headerSet === null) {
  //   let data = {};
  //   data.status = false;
  //   return data;
  // } else {
  //   const response = await fetch(
  //     `${config.API_URL}checkIsAuthenticated`,
  //     headersWithAuthBody(
  //       "POST",
  //       { token: localStorage.getItem("token") },
  //       localStorage.getItem("token")
  //     )
  //   );
  //   return await response.json();
  // }
  return true
}
