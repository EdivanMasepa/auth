import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ListUserDto } from './dto/list-user.dto';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto): Promise<{statusCode: number, message: string}> {
    try{
      await this.prisma.user.create({data: createUserDto});

      return {statusCode: 201, message: "Usuário criado com sucesso."};
      
    }catch(erro){
      
      console.error(erro);
      throw new BadRequestException("Erro ao criar usuário, tente novamente.");
    }
  }

  async findAll(): Promise<ListUserDto[]> {
    try{
      const users = await this.prisma.user.findMany();
  
      return users.map((user => new ListUserDto( user.id, user.name, user.email)));
    
    }catch(erro){

      throw new BadRequestException("Erro ao buscar usuários.");
    }
  }

  async findOne(id: number): Promise<ListUserDto> {
    try {
      const user = await this.prisma.user.findUnique({where: {id}});

      if(!user) throw new NotFoundException("Usuário não encontrado.");

      return new ListUserDto(user.id, user.name, user.email)
      
    }catch(erro){

      throw new BadRequestException("Erro ao buscar usuário, tente novamente.")
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try{
      await this.prisma.user.update({where:{id}, data: updateUserDto})
    
      return {statusCode: 200, message: "Usuário atualizado com sucesso."};

    }catch(erro){
      
      throw new BadRequestException("Erro ao atualizar usuário, tente novamente.")
    }
  }

  async remove(id: number) {
    try{
      await this.prisma.user.delete({where: {id}});

      return {statusCode: 200, message: "Usuário excluído com sucesso."};

    }catch(erro){

      throw new BadRequestException("Erro ao excluír usuário, tente novamente.");
    }
  }
}
