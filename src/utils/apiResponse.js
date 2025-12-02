class apiResponse {
    constructor(statusCode,data,message){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.succes=statusCode<400
    }
}

export {apiResponse};