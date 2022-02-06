const validatePassword = (pass) => {
    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/
    return re.test(pass);
}

export default validatePassword;