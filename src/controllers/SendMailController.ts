import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsers";
import { SurveysRepository } from "../repositories/SurvveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";

class SendMailController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await usersRepository.findOne(email);

    if (!userExists) {
      return response.status(400).json({
        error: "User does not exists",
      });
    }

    const surveyExists = await surveysRepository.findOne({ id: survey_id });

    if (!surveyExists) {
      return response.status(400).json({
        error: "Survey does not exists",
      });
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id: surveyExists.id,
    });

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { SendMailController };
