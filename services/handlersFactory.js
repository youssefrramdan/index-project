/* eslint-disable arrow-body-style */
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/DummyData/apiFeatures.js";

const createOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await model.create(req.body);
    res.status(201).json({
      message: "Successfully created",
      data: document,
    });
  });
};
const updateOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.validData;

    const document = await model.findByIdAndUpdate(req.validData.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new ApiError(`No category for this id ${id}`, 404));
    }
    res.status(200).json({
      message: "Updated Successfully",
      data: document,
    });
  });
};
const deleteOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.validData;
    const document = await model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No ${model} found with ID ${id}`, 404));
    }

    res.status(200).json({ message: ` deleted successfully` });
  });
};

const getOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`No subcategory found for this ID: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      message: "Success",
      data: document,
    });
  });
};
const getAll = (model, modelName = "") => {
  return asyncHandler(async (req, res) => {
    const filter = req.filterObj || {};
    const documentCount = await model.countDocuments();
    const Features = new ApiFeatures(model.find(filter), req.query)
      .filter()
      .search(modelName)
      .sort()
      .limitFields()
      .paginate(documentCount);
    const { mongooseQuery, paginationResult } = Features;
    const documents = await mongooseQuery;
    res.status(200).json({
      message: "success",
      paginationResult,
      data: documents,
    });
  });
};
export { deleteOne, updateOne, createOne, getOne, getAll };
