
export const checkValidData = (email, password) => {

    const isEmailValid = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}./.test(email);
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);


    if (!isEmailValid) return "Email ID is not valid";
    if (!isPasswordValid) return "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters";

    return null;
};