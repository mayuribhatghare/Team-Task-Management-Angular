export interface UserResponseDto
{
    UserName:string,
    Email:string,
    PhoneNumber:string,
    Role:string;
}

export interface DecodeUserInfo
{
    UserName :string;
    UserId:number;
    Role:string;
}

export interface UserDropDownDto
{
    UserId : number,
    UserName : string
}