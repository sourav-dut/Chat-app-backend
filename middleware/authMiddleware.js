import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
        if (error) {
            return res.status(404).send({
                success: false,
                message: "Unauthorized user"
            })
        }
        req.body.user = decode.user;
        next();
    });

  } catch (error) {
    console.log("Error in authMiddleware middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};