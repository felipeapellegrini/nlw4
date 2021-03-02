import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import { UsersRepository } from "../repositories/UsersRepository";

export default class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: "Validation failed!",
      });
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userExists = await usersRepository.findOne({
      email,
    });

    if (userExists) {
      return response.status(400).json({
        message: "User already exists.",
      });
    }

    const user = usersRepository.create({
      name,
      email,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const usersRepository = getCustomRepository(UsersRepository);

    const users = await usersRepository.find();

    return response.status(200).json(users);
  }
}
