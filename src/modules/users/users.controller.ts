import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DesactivateUserDto, ActivateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserBaseDto} from './dto';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: UserBaseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully activated.',
    type: ActivateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Desactivate a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully desactivated.',
    type: DesactivateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.desactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: UserBaseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login', description: 'Authenticates a user with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User authenticated', type: UserBaseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(200)
  login(@Body() user: LoginDto) {
    return this.usersService.login(user.email, user.password);
  }

  @Post('/create-reset-password')
  @ApiOperation({ summary: 'Create a reset password code' })
  @ApiBody({ type: CreateResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset password code created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  createCodeResetPassword(@Body() createResetPasswordDto: CreateResetPasswordDto) {
    return this.usersService.createCodeResetPassword(createResetPasswordDto.email);
  }

  @Post('/verify-reset-code')
  @ApiOperation({ summary: 'Verify reset password code' })
  @ApiBody({ type: VerifyResetCodeDto })
  @ApiResponse({ status: 200, description: 'Reset code verified successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid reset code' })
  verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.usersService.verifyResetCode(verifyResetCodeDto.email, verifyResetCodeDto.code);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto.email, resetPasswordDto.newPassword);
  }

}
