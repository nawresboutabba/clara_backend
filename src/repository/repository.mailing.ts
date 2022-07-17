import MailingService from "../services/Mailing.service";
import fetchTemplates from './../utils/templates-mailing';
const twig = require('twig').twig;

export const sendEmail = async (Destination: any, eventType: string, info:any): Promise<any> => {
  try {
    const from = 'tecnologia@claraidea.com.br'
    const body = await renderEmailHTML(
      eventType,
      info
    )
    const emailResp = await MailingService.sendMail(from, Destination, body)
    return emailResp
  } catch (error) {
    return Promise.reject(error)
  }
}

async function renderEmailHTML(eventType:string, info:any) {
  const twigCode =  await twigCodeSelect(eventType)
  const html = twig( {
    data: twigCode
  })

  const output = await html.render({
    info
  })
  return output
}

async function twigCodeSelect (eventType:string){

  const template= await fetchTemplates();
  return template[`${eventType}.html.twig`]
}
