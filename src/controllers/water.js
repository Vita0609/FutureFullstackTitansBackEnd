import createHttpError from 'http-errors';

import * as waterServices from '../services/water.js';
import parseWaterFilterParams from "../utils/filter/parseWaterFilterParams.js";

export const addWaterController = async (req, res) => {
  const { waterVolume, userId, date } = req.body;
  if (waterVolume > 5000) {
    throw createHttpError(400, 'Water volume cannot exceed 5000 ml');
  }

  if (!date) {
    throw createHttpError(400, 'Date is required');
  }
  console.log('userId');
  console.log(userId);
  const data = await waterServices.createWater({
    waterVolume,
    userId,
    date: new Date(date).toISOString(),
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully add record',
    data,
  });
};

export const patchWaterController = async (req, res) => {
  const { id } = req.params;
  const result = await waterServices.updateWater({ _id: id }, req.body);
  if (!result) {
    throw createHttpError(404, 'Water record not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a water record!',
    data: result.data,
  });
};

export const deleteWaterController = async (req, res) => {
  const { id } = req.params;
  const data = await waterServices.deleteWater({ _id: id });
  if (!data) {
    throw createHttpError(404, 'Water record not found');
  }

  res.status(204).send();
};

export const getMonthWaterController = async (req, res)=>{

  const filter = parseWaterFilterParams(req.query);
  const { _id: userId } = req.user;
  const data = await waterServices.getMonthWater({

    filter: { ...filter, userId },
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found month data!',
    data: data,
  });
};

