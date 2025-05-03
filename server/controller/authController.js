//external module
const JWT = require('jsonwebtoken');

//local module
const userModel = require('../model/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');


const registerController = async (req, res) => {
    const errors = [];
    try {
        const { name, email, password, address, phone, answer } = req.body;

        if (!name || !email || !password || !address || !phone || !answer) {
            errors.push("All fields are mandatory");
        }

        // Phone validation: must be 10 digits starting with 9
        const phoneRegex = /^9[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            errors.push("Phone number must be a 10-digit number starting with 9");
        }

        // Email validation: simple regex check
        const emailRegex = /^[a-z0-9._]+@[a-z]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push("Invalid email format");
        }

        // password validation: simple regex check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*?])[a-zA-Z\d@#$%&*?]{6,}$/;
        if (!passwordRegex.test(password)) {
            errors.push("Invalid password format , should contain 1 uppercase 1 lowercase and special symbol");
        }

        if(errors.length>0){
            return res.send({
                message: "validation failed",
                success: false
            })
        }

        //check already registered 
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered"
            })
        }

        //hashing the password
        const hashedPassword = await hashPassword(password);

        //saving the info
        const user = await new userModel({ name, email, address, phone, answer, password: hashedPassword }).save();

        res.status(200).send({
            success: true,
            message: "Account registered successfully",
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(200).send({
            success: false,
            message: "Error in registration",
            error
        })
    }
}


//login controller 
const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        //if email and password is empty
        if (!email || !password) {
            return res.status(200).send({
                message: "Email and password is mandatory"
            })
        }

        //if user doesnot exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.send({
                success: false,
                message: "Email not registered"
            })
        }

        //if password doesnot match
        const passMatched = await comparePassword(password, user.password);
        if (!passMatched) {
            return res.status(200).send({
                success: false,
                message: "Password is invalid"
            })
        }
        // initializing jwt
        const token = JWT.sign(
            { _id: user.id },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );


        //if user is authenticated
        res.status(200).send({
            success: true,
            message: "User login sucess",
            user: {
                email: user.email,
                name: user.name,
                address: user.address,
                role: user.role,
                phone: user.phone,
                _id: user._id
            },
            token
        })



    } catch (error) {
        console.log("login controller error : ", error);
        return res.status(400).send({
            success: false,
            message: "Cannot perform login operation",
            error
        })
    }
}

//forgot password controller 
const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*?])[a-zA-Z\d@#$%&*?]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send({
                success: false,
                message: "Password format invalid"
            })
          }
       
        const user = await userModel.findOne({ email, answer })

        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'Email or security answer is invalid'
            })
        }

        const hashedPassword = await hashPassword(newPassword);
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        if (updatedUser) {
            res.status(200).send({
                success: true,
                message: 'Password changed Successfully'
            })
        } else {
            res.send({
                success: false,
                message: 'Password change unsuccess'
            })
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'couldnot perform the pass change operation'
        })
    }
}

//update profile controller
const updateProfileController = async (req, res) => {
    try {
        const { uid } = req.params;
        const { name, phone, address } = req.body;
        if (!name || !phone || !address) {
            return res.send({
                success: false,
                message: "All fields are mandatory"
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(uid, { name, phone, address }, { new: true });
        if (!updatedUser) {
            return res.send({
                success: false,
                message: "Couldnot update the user"
            })
        }

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            updatedUser: {
                name: updatedUser.name,
                address: updatedUser.address,
                phone: updatedUser.phone
            }
        })
    } catch (error) {
        console.log(error);
        res.send("Error in updating profile");
    }
}



exports.registerController = registerController;
exports.loginController = loginController;
exports.forgotPasswordController = forgotPasswordController;
exports.updateProfileController = updateProfileController;

