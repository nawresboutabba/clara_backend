import * as aws from 'aws-sdk'
import { ERRORS, HTTP_RESPONSE } from '../constants';
import RepositoryError from '../handle-error/error.repository';

export const getImageSignedUrlForPost = async (imageName: string): Promise<string> => {
  try {
    const region = process.env.AWS_REGION
    const bucketName = process.env.AWS_BUCKET_NAME
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    const s3 = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: 'v4'
    })

    const params = ({
      Bucket: bucketName,
      Key: imageName,
      Expires: 30
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
        
    return uploadURL
  } catch (error) {
    return Promise.reject(new RepositoryError(
      ERRORS.REPOSITORY.GET_URL_IMAGE_SIGNED_FOR_POST,
      HTTP_RESPONSE._500,
      error)
    )
  }
}

export const getSignedUrl = async (imageName: string): Promise<string> => {
  try{
    const region = process.env.AWS_REGION
    const bucketName = process.env.AWS_BUCKET_NAME
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    const s3 = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: 'v4'
    })

    const params = ({
      Bucket: bucketName,
      Key: imageName,
    })
    const imageUrl = s3.getSignedUrl('getObject', params)
    return imageUrl
  }catch(error){
    return Promise.reject(new RepositoryError(
      ERRORS.REPOSITORY.GET_URL_IMAGE_SIGNED,
      HTTP_RESPONSE._500,
      error)
    )
  }
}