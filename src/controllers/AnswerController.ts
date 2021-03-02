import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { value } = request.params;
    const { U } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(U),
    });

    if (!surveyUser) {
      return response.status(400).json({
        error: "Survey user does not exists!",
      });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
