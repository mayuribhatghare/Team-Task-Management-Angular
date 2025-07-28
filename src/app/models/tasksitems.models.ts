import {TaskStatus,TaskPriority} from '@app/Taskenum/taskenum';

export interface UserTaskResponseDto
{
    TaskId :number,
    Title : string;
    Description? : string;
    Status : string;
    Priority : string;
    DueDate : string;
 
}

export interface TaskCreateRequestDto
{
    Title : string,
    Description? : string
}

export interface  TaskCreateResponseDto
{
    TaskId : number,
    Title: string,
    Description?: string,
    CreatedDate : Date,
    CreatedBy : number

}

export interface UnAssignedTaskResponseDto
{
    TaskId:number,
    Title:string,
    Description?: string,
    Priority: TaskPriority,
    AssigneeId:number,
    Status: TaskStatus,
    DueDate: Date
}

export interface AssignTaskToUserRequestDto
{
    TaskId:number,
    UserId: number,
    Status : string,
    Priority: string,
    DueDate? : string
}

export interface AssignedTaskManagerResponseDto
{

    Title: string,
    Description? : string,
    Status: string,
    Priority: string,
    DueDate : Date,
    UserName: string
}

export interface TaskResponseByTaskIdDto
{
    Title :string ,
    DueDate: string,
    Status: TaskStatus,
    Priority: TaskPriority,
    Description? : string,
    UserId: number,
    CreatedDate: Date
}
export interface UpdateTaskWithCommentRequestDto
{
    TaskId : number,
    Title: string,
    Description ? : string,
    Priority:string,
    DueDate? : Date,
    UserId: number,
    Status : string,
    Comment?: string,
    CommentId :number
}

export interface CommentAndTaskResponseDto
{
    CommentId : number,
    TaskId: number,
    AddedBy? : number,
    Comment? : string,
    UserName :string,
    AssignedByUserId : number,
    AssignedToUserId : number,
    GetDate : Date
}

export interface TaskReportDto
{
    TaskId :number,
    Title : string,
    UserName : string,
    Status? : string,
    Priority? :string,
    DueDate? : Date,
    OverDue : boolean
}