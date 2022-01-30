interface Course{
    name: string, 
    duration?: number, //atriduto opcional
    educator: string
}

class CreateCourseService{
    execute({duration = 8, name, educator}:Course){
        console.log(name, duration, educator)
    }//duration com valor padrão
}

/**class CreateCourseService{
    execute(name: string, duration: number, educator: string){
        console.log(name, duration, educator)
    }
}SEM INTERFACE**/

export default new CreateCourseService();