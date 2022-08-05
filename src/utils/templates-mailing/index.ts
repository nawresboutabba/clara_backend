import { MAILING_TEMPLATES } from "../../constants";
import * as path from "path";
import { readFile } from "fs/promises";

const fileNames = [
  MAILING_TEMPLATES.EXTERNAL_OPINION_INVITATION,
  MAILING_TEMPLATES.NEW_EXTERNAL_USER,
  MAILING_TEMPLATES.GREETINGS_MAILING
];

export default async function () {
  const templates = {};
  for (const templateName of fileNames) {
    const templateBuffer = await readFile(
      path.join(
        process.cwd(),
        "src",
        "utils",
        "templates-mailing",
        templateName
      )
    );
    const template = templateBuffer.toString("utf-8");
    templates[templateName] = template;
  }

  return templates;
}
