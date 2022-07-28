import { NextFunction, Request, Response } from "express";
import User, { UserRole } from "../models/User";
import userService from "../services/userService";
import imageService from "../services/imageService";
import { CustomError } from "../types/CustomError";
import jwt from 'jsonwebtoken'

require('dotenv').config()

const userLogin = (req: Request, res: Response) => {
  // console.log('Plain Text:', req.body)
  const token = jwt.sign(req.body, `${process.env.JWT_SECRET}`, {
    algorithm: "HS256"
  })
  // console.log('Encrypted Token:', token)
  return res.json(token)
}


const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  return res.json(users);
};

const getSingleUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const foundUser = await userService.getSingleUser(userId);
  return res.json(foundUser);
};

const getUserByEmail = (req: Request, res: Response) => {
  const userEmail = req.params.userEmail;
  res.send({
    message: `You are at viewing the details of User by email: ${userEmail}`,
    status: 200,
  });
};

const postUser = (req: Request, res: Response) => {
  res.send(JSON.stringify(req.body));
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { firstname, lastname, phone, email, password, role } = req.body;

    const user = new User({
      firstname,
      lastname,
      phone,
      email,
      role,
      password
    });
    const newUser = await userService.createUser(user);
    return res.status(201).json(newUser);
    } catch (error) {
    return next(error);
  }
};

const deleteUserByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    await userService.deleteUser(userId);
    return res.status(204).send("User has been deleted by Id");
  } catch (e) {
    return next(e);
  }
};

const deleteUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username;
    await userService.deleteUser(username);
    return res.status(204).send("User has been deleted by username");
  } catch (e) {
    return res.send(e);
  }
};

const deleteUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.params.email;
    await userService.deleteUserByEmail(email);
    return res.status(204).send("User has been deleted by email");
  } catch (e) {
    return next(e);
  }
};


const addBookToBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const { bookId } = req.body
    const updatedUser = await userService.addBookToBasket(userId, bookId)
    return res.status(201).json(updatedUser)
  } catch (error) {
    return next(error)
  }
}

const deleteBookFromBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const { bookId } = req.body
    const updatedBasket = await userService.deleteBookFromBasket(userId, bookId)
    return res.json(updatedBasket)
  } catch (error) {
    return error
  }
}

const viewUserBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const userBasket = await userService.viewUserBasket(userId)
    return res.json(userBasket)
  } catch (error) {
    return error
  }
}

const checkoutBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const updatedUser = await userService.checkoutBasket(userId)
    return res.json(updatedUser)
  } catch (error) {
    return next(error)
  }
}

const viewLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const loans = await userService.viewLoans(userId)
    return res.json(loans)
  } catch (error) {
    return next(error)
  }
}

const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const { bookId } = req.body
    const updatedUser = await userService.returnBook(userId, bookId)
    return res.json(updatedUser)
  } catch (error) {
    return next(error)
  }
}


export default {
  userLogin,
  // verifyToken,
  getAllUsers,
  getSingleUser,
  getUserByEmail,
  postUser,
  createUser,
  deleteUserByUsername,
  deleteUserByEmail,
  deleteUserByUserId,
  addBookToBasket,
  deleteBookFromBasket,
  viewUserBasket,
  checkoutBasket,
  viewLoans,
  returnBook
};
