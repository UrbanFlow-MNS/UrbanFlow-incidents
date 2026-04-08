import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @MessagePattern({ cmd: 'category.findAll' })
  findAllTcp() {
    return this.categoriesService.findAll();
  }

  @MessagePattern({ cmd: 'category.findOne' })
  findOneTcp(@Payload() id: number) {
    return this.categoriesService.findOne(id);
  }

  @MessagePattern({ cmd: 'category.create' })
  createTcp(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern({ cmd: 'category.update' })
  updateTcp(@Payload() data: { id: number; dto: UpdateCategoryDto }) {
    return this.categoriesService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'category.remove' })
  removeTcp(@Payload() id: number) {
    return this.categoriesService.remove(id);
  }
}
