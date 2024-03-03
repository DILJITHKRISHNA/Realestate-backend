import Owner from "../models/ownerModel.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const OwnerAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.status(401).send({ msg: 'Unauthorized: Token is invalid' });
          } else {

            const owner = await Owner.findOne({
              _id: decoded.id,
            });
            if (owner) {
              if (owner.is_block === false) {
                req.headers.ownerId = decoded.id;
                next();
              } else {
                return res
                  .status(403)
                  .json({ data: { message: "You are blocked by admin " } });
              }
            } else {
              return res
                .status(400)
                .json({ message: "Owner not authorised or inavid user" });
            }
          }
        }
      );
    } else {
      return res.status(400).json({ message: "Owner not authorised" });
    }
  } catch (error) {
    console.log(error.message);
  }
};