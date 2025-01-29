import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
// @desc array of rules for

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name"),
  validatorMiddleware,
];
// dry => dont repeat your self
export const getSpecificBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];
export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];
