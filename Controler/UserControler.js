const User = require("../Module/User");
const { generatToken } = require("../Modules/JWTtoken");
const { hashPassword, comparePassword } = require("../Modules/PasswordEncrption");



signUp = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existUser = await User.findone({ email: email });
        if (existUser) {
            return res.status(400).json({message:"user already exist"})
        }
        const hashPasswords = await hashPassword(password)
        const newUser = new User({
            name,
            email,
            password:hashPasswords
        })
        await newUser.save();
        res.status(201).json({message:"signUp successfully"})

    } catch {
       res.status((500).json({"message":"internal server error"}))
    }



}
login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findone({ email: email });
        if (!user)
        {
           return res.status(400).json({"message":"email is not found"})
        }
        const checkPassword = await comparePassword(password, user?.password)
        if (!checkPassword) {
             return res.status(400).json({"message":"password is not valid"})
        }
         res.status(201).json({message:"success",token:generatToken({email:email})})

    } catch {
  res.status(500).json({message:"internal server error"})
    }
  }

  module.exports={signUp}