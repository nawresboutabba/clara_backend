import { Post , Controller, Route, Body, Delete , Path} from 'tsoa'
import { TYPE_USER } from '../../models/users'
import { deleteUser, login, signUp } from '../../repository/users'


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
@Route("user")
export default class UserController extends Controller {
  @Post("signup")
  public async signUp(@Body() body: UserBody): Promise<TYPE_USER> {
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
}