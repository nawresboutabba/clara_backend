import RoutingError from "../handle-error/error.routing"

export function checkInterval(init:number, offset:number): Promise<boolean> {
    return new Promise((resolve, reject)=> {
        if (init < offset && (offset-init) > 0){
            return resolve(true)
        }
       // return new RoutingError()
    })
}