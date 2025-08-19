export const generateCode = (digit: number): string => {
  let code = '';
  for (let i = 0; i < digit; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    code += randomDigit.toString();
  }
  return code;
};
