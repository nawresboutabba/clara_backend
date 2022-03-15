import { Post, Controller, Route, Body, Delete, Path, Get, Inject } from 'tsoa'
import { UserI } from '../../models/users';
import { deleteUser, getParticipation, getUserInformation, login, signUp } from '../../repository/repository.users'
import { AreaResponse } from '../area/area'

/**
 * User interface used when a user is added to Request after 
 * authentication successfully
 */
export interface UserRequest {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
}

/**
 * User interface used just for create a user
 */
export interface UserBody {
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string
}

export interface Login {
  email: string,
  password: string
}


export interface LightUserInterface {
  username: string,
  points: number,
}

export interface UserResponse extends LightUserInterface {
  area_visible: Array<AreaResponse>,
  external_user: boolean,
  active: boolean,
  email: string,
  first_name: string,
  last_name: string,
}

export interface UserInformationResponse extends UserResponse {
  committe_member: boolean,
}

@Route("user")
export default class UserController extends Controller {
  @Post("signup")
  public async signUp(@Body() body: UserBody): Promise<UserResponse> {
    return signUp(body)
  }
  @Post("login")
  public async login(@Body() body: Login): Promise<string> {
    return login(body)
  }
  @Delete(':userId')
  public async delete(@Path('userId') userId: string): Promise<boolean> {
    return deleteUser(userId)

  }
  /**
   * User information 
   * @param userRequest UserRequestType
   * @returns 
   */
  @Get('info')
  public async getInformation(@Inject() user: UserRequest): Promise<UserResponse> {
    return getUserInformation(user)
  }

  @Get('participation')
  public async getParticipation(@Inject() user: UserI): Promise<any> {
    return getParticipation(user)
  }
}