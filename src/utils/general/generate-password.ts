import generator from 'generate-password'

export const generatePassword = ():string=> {
  try{
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    return password
  }catch(error){
    return error
  }
}