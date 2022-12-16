import { z } from "zod";
import {
  CommentScope,
  SolutionComment,
} from "../../../models/interaction.comment";
import { Tag } from "../../../models/tag";
import { validate } from "../../../utils/express/express-handler";
import { genericCommentFilter } from "../../../utils/field-filters/comment";
import * as SolutionRep from "../solution.repository";
import nodemailer from "nodemailer";
export const createSolutionComment = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({
      comment: z.string(),
      scope: z.nativeEnum(CommentScope),
      parent: z.string().optional(),
      tag: z.string(),
    }),
  },
  async ({ user, params: { solutionId }, body }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);
    if (!SolutionRep.canViewSolution(user, solution)) {
      return res.status(403).json({ message: "not authorized" });
    }

    if (body.scope === CommentScope.GROUP) {
      const isInSolution = [
        ...solution.coauthor.map((coauthor) => coauthor.userId),
        solution.author.userId,
        ...solution.externalOpinion.map(
          (externalOpinion) => externalOpinion.userId
        ),
      ];
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
      if (!isInSolution.includes(user.userId)) {
        return res.status(403).json({ message: "not authorized" });
      }
    }

    const parentComment = await SolutionComment.findById(body.parent)
      .populate("author")
      .populate("insertedBy")
      .populate("parent")
      .populate("tag")
      .populate("resource");

    if (parentComment.resource.id !== solution.id) {
      return res
        .status(400)
        .json({ message: `parent not belongs to solution ${solution.id}` });
    }

    if (parentComment !== null && parentComment.parent !== null) {
      return res.status(400).json({ message: "Max comment child level is 2" });
    }

    const tag = await Tag.findById(body.tag);
    if (!tag) {
      return res.status(400).json({ message: "Tag does not exists" });
    }

    const newComment = await SolutionComment.create({
      author: user,
      insertedBy: user,
      resource: solution,
      scope: body.scope,
      comment: body.comment,
      parent: parentComment,
      tag: parentComment ? parentComment.tag : tag,
    });

    return res.status(201).json(await genericCommentFilter(newComment));
  }
);
