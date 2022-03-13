import { Controller, Get, Path, Route } from "tsoa";
import { getImageSignedUrlForPost, getSignedUrl } from "../../repository/repository.image-service";

@Route('image')
export default class ImageController extends Controller {
  @Get('/image-post-signed-url/:imageName')
  public async getImageSignedUrlForPost(@Path('imageName') imageName: string): Promise<any> {
    return getImageSignedUrlForPost(imageName)
  }
  @Get('/image-signed-url/:imageName')
  public async getImageSignedUrl(@Path('imageName') imageName: string): Promise<any> {
    return getSignedUrl(imageName)
  }
}