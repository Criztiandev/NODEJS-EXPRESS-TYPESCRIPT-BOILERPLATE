const generateOTP = (
  length: number = 6,
  characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  charactersSize: number = 3,
  numbers: string = "0123456789",
  numbersSize: number = 3
): string => {
  let otp = "";

  // Add 3 random characters
  for (let i = 0; i < charactersSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  // Add 3 random numbers
  for (let i = 0; i < numbersSize; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    otp += numbers[randomIndex];
  }

  return otp;
};

export { generateOTP };
