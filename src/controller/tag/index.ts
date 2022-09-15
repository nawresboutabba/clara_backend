import { Types } from "mongoose";
import { Body, Controller, Get, Inject, Post } from "tsoa";
import { UserI } from "../../models/users";
import { getTags, newTag } from "../../repository/repository.tags";

export interface TagBody {
    name: string,
    description: string,
    type:string
}

export interface TagResponse {
  id: Types.ObjectId
  name:string,
  description:string,
}

export default class TagController extends Controller {
  @Post()
  public async newTag(@Body() tag : TagBody,@Inject() user: UserI): Promise<TagResponse>{
    return newTag(tag, user)
  }
  @Get()
  public async getTags(query: any ,@Inject() url : string): Promise<any> {
    return getTags(query, url)
  }

}
