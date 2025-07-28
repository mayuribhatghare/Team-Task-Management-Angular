export interface UserRegisterDto
{
    UserName: string;
    Email: string;
    PhoneNumber : string;
    password : string;
}

export interface LoginDto
{
    Email : string;
    Password: string;
}

export interface AuthResponseDto {
    Token : string;
    Expiration : Date;
    
}
