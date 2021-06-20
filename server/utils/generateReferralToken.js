function generateReferralToken() {
   let time = Date.now();
   let randomString = Math.floor(Math.random() * 999999999 + 1).toString(16);

   return time + randomString;
}

module.exports = generateReferralToken;
