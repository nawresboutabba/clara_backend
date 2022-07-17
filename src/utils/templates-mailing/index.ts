import { MAILING_TEMPLATES } from "../../constants";
import * as path from 'path';
import  { readFile } from 'fs';
import  { promisify } from 'util'

const fileNames = [
  MAILING_TEMPLATES.EXTERNAL_OPINION_INVITATION,
  MAILING_TEMPLATES.NEW_EXTERNAL_USER
];

export default async function () {
  const templates = {};
  for (const templateName of fileNames) {
    const templateBuffer = await promisify(readFile)(path.join(__dirname, `./${templateName}`));
    const template = templateBuffer.toString('utf-8');
    templates[templateName] = template;
  }

  return templates;
}