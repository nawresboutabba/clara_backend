import { Post , Controller, Route, Body, Delete , Path, Get} from 'tsoa'
import { AreaI } from '../../models/organization.area'
import { UserI } from '../../models/users'
import { deleteUser, getUserInformation, login, signUp } from '../../repository/repository.users'
import { AreaResponse } from '../area/area'

/**
 * User interface used when a user is added to Request after 
 * authentication successfully
 */
export interface UserRequest{
  email: string;
  userId: string;
  firstName: string;
  lastName:string;
}

/**
 * User interface used just for create a user
 */
export interface UserBody {
  username : string,
  password: string,
  email: string,
  first_name: string,
  last_name: string
}

export interface Login {
  email: string,
  password: string
}

export interface UserResponse {
  area_visible: Array<AreaResponse>,
  external_user: boolean,
  active: boolean,
  points: number,
  username : string,
  email: string,
  first_name: string,
  last_name: string
}

export interface UserInformationResponse extends UserResponse {
  committe_member: boolean,
  points: number,
  
}

@Route("user")
export default class UserController extends Controller {
  @Post("signup")
  public async signUp(@Body() body: UserBody): Promise<UserI> {
    return signUp(body)
  }
  @Post("login")
  public async login(@Body() body: Login ): Promise<string>{
    return login(body)
  }
  @Delete(":userId")
  public async delete(@Path('userId') userId: string): Promise<boolean>{
    return deleteUser(userId)

  }
  @Get('info')
  public async getInformation(@Body() user:UserI): Promise<UserResponse>{
    return getUserInformation(user)
  }
}