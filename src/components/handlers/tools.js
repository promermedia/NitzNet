const Tools = {
  serverURL: "https://nitzcha-6d2fcb.appdrag.site/api/",
  getLSbyKey: (lsKEY, objKEY) => {
    const obj = JSON.parse(localStorage[lsKEY]);
    if (obj && obj[objKEY]) return obj[objKEY];
    else return null;
  },

  updateLS: (lsKEY, objKEY, objVAL) => {
    const obj = JSON.parse(localStorage[lsKEY]) || {};
    obj[objKEY] = objVAL;

    localStorage[lsKEY] = JSON.stringify(obj);
  },
  processEmail: (em) => {
    var email = em.replace(/ /g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return null;
    }
    const lowercaseEmail = email.toLowerCase();
    const [localPart, domainPart] = lowercaseEmail.split("@");
    return domainPart === "gmail.com"
      ? `${localPart.replace(/\./g, "")}@${domainPart}`
      : lowercaseEmail;
  },
  formatDate: (d) => {
    return new Intl.DateTimeFormat("he-IL").format(new Date(d));
  },
  passwordStrength: (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{2,20}$/;
    return regex.test(password);
  },
};

export default Tools;
