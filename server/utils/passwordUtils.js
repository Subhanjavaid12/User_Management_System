import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (plainPassword) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.error("Error in hashPassword:", error);
        throw new Error("Could not hash password.");
    }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error("Error in comparePassword:", error);
        throw new Error("Could not compare passwords.");
    }
};
