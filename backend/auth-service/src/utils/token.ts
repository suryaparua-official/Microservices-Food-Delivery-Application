import jwt from "jsonwebtoken";

const genToken = async (userId: string): Promise<string> => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return token;
};

export default genToken;
