const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  console.log("Admin1 isAuthorized:", isAuthorized);
  if (!isAuthorized) {
    return res.status(401).send("Forbidden");
  }else{
    next();
  }
}

const userAuth = (req, res, next) => {
    const token ="abc";
    const isAuthorized = token === "abc";
    console.log("User1 isAuthorized:", isAuthorized);
    if (!isAuthorized) {
      return res.status(401).send("Forbidden");
    }else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}