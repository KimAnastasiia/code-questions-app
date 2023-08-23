export interface Question {
    question:string|any,
    answer1:string,
    answer2:string, 
    answer3:string,
    answer4:string, 
    index?:number,
    code:string,
    rightAnswer:string,
    numberOfQuestion:number,
    email?:string
  }
export default Question