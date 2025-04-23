const bcrypt =require('bcrypt');

const hashPassword = async (password) =>{
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        return hashedPassword;
        
    } catch (error) {
        console.log("error in hashing", error);
        
    }
     
}

const comparePassword = (password,hashedPassword) =>{ 
      return  bcrypt.compare(password,hashedPassword);

}



exports.hashPassword=hashPassword;
exports.comparePassword=comparePassword;