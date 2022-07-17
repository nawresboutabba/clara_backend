import * as aws from 'aws-sdk'
import { ERRORS, HTTP_RESPONSE } from '../constants'
import ServiceError from '../handle-error/error.service'

// Email verification . https://aws.amazon.com/ses/verifysuccess/

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const ses = new aws.SES({
  region,
  accessKeyId,
  secretAccessKey,
})



const MailingService = {
  async sendMail(from: string , Destination: any, Message: any): Promise<any> {
    try{
      const params = {
        Destination, 
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8", 
              Data: Message
            }
          }, 
          Subject: {
            Charset: "UTF-8", 
            Data: "Test email"
          }
        }, 
        Source: from, 
      };


      /**
       * Operation asynchronus
       */
      ses.sendEmail(params, function(err, data) {
        if (err){
          console.log(err)
        }else {
          return data
        }
      });
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.NEW_INVITATION,
        HTTP_RESPONSE._500,
        error))
    }
  }
}
export default MailingService