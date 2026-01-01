(function () {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let isAdmin = false;

  try {
    if (token && userString) {
      const user = JSON.parse(userString);
      if (user.role === "admin") isAdmin = true;
    }
  } catch (e) {}

  if (!isAdmin) {
    window.location.replace("login.html");
  }
})();
