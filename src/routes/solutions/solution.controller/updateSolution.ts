import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import { genericSolutionFilter } from "../solution.serializer";
import { removeEmpty } from "../../../utils/general/remove-empty";
import { numberSchema } from "../../../utils/zod";
import { booleanSchema } from "../../../utils/zod/booleanSchema";
import { StrategicAlignment } from "../../strategic-alignments/strategic-alignment.model";
import * as TagsRep from "../../tags/tags.repository";
import * as SolutionRep from "../solution.repository";
import { getAreasByIds } from "../../area/area.repository";
import nodemailer from "nodemailer";

export const updateSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({
      title: z.string(),
      description: z.string().optional(),
      differential: z.string().optional(),

      is_new_for: z.string().optional(),

      was_tested: booleanSchema(z.boolean().optional()),

      first_difficulty: z.string().optional(),
      second_difficulty: z.string().optional(),
      third_difficulty: z.string().optional(),

      implementation_time_in_months: numberSchema(z.number().optional()),
      money_needed: numberSchema(z.number().optional()),

      is_privated: booleanSchema(z.boolean().optional()),

      WSALevel_chosed: z.string().optional(),

      images: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      department_affected: z.array(z.string()).optional(),
      file_complementary: z.array(z.string()).optional(),

      proposed_solution: z.string().optional(),
      test_description: z.string().optional(),
      barema_type_suggested: z.string().optional(),
      impact: z.string().optional(),

      participation: z.any(),

      strategic_alignment: z.string().optional(),
    }),
  },
  async ({ user, params, body }, res) => {
    const solution = await SolutionRep.getSolutionById(params.solutionId);

    if (solution.author.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" });
    }
    //****************************email */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tecnologia@claraidea.com.br',
        pass: 'Tecnologia1*'
      }
    });
    
  const mailOptions = {
      from: 'tecnologia@claraidea.com.br',
      to: user.email,
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

//****************************email */

    const tags = await TagsRep.getTagsById(body.tags);
    const departmentAffected = await getAreasByIds(body.department_affected);
    const strategicAlignment = await StrategicAlignment.findById(
      body.strategic_alignment
    );

    console.log(strategicAlignment);

    const updatedSolution = await SolutionRep.updateSolutionPartially(
      params.solutionId,
      removeEmpty({
        ...body,
        tags,
        departmentAffected,
        strategicAlignment,
      })
    );

    return res.status(201).json(await genericSolutionFilter(updatedSolution));
  }
);
