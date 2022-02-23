import * as _ from 'lodash';


export const toCamelCase = (element: any): any => {
  /**
     * Regex expresion that replace all occurences of wsalevel
     * ignoring between uppercase and lowercase letters
     */
  const regexExpresion = new RegExp("wsaLevel", "gi")
  const response = _.mapKeys(element, (v: any, k:any) => 
    _.replace(_.camelCase(k), regexExpresion, "WSALevel")
  );
  return response;
}