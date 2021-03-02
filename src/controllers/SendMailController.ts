import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from "path";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { SurveysRepository } from "../repositories/SurvveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return response.status(400).json({
        error: "User does not exists",
      });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      return response.status(400).json({
        error: "Survey does not exists",
      });
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
    });

    const vars = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    if (surveyUserAlreadyExists) {
      vars.id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, vars, npsPath);
      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id: survey.id,
    });

    vars.id = surveyUser.id;

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, survey.title, vars, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailController };
