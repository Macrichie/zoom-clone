// Generating Random Character string such as API keys or secret keys

const uidGen = () => {
  // Define all the possible characters that could go into a string
  const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
  // start the final string
  let uid = "";
  for (let i = 1; i <= 20; i++) {
    // Get a random character from the possibleCharacters string
    const randomCharacter = possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
    uid += randomCharacter;
  }
  return uid;
};

module.exports = uidGen;
