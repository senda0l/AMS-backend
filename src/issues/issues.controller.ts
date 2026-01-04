import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage, File } from 'multer';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { UploadService } from '../upload/upload.service';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
  constructor(
    private readonly issuesService: IssuesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async create(
    @Body() createIssueDto: CreateIssueDto,
    @Request() req,
    @UploadedFiles() files?: File[],
  ) {
    // Upload files if provided
    if (files && files.length > 0) {
      const fileUrls = await this.uploadService.saveMultipleFiles(files);
      createIssueDto.photos = fileUrls;
    }

    return this.issuesService.create(createIssueDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('apartmentId') apartmentId?: string,
    @Query('assignedManagerId') assignedManagerId?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.issuesService.findAll({
      status: status as any,
      category,
      apartmentId,
      assignedManagerId,
      priority,
      search,
      startDate,
      endDate,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Post(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateIssueStatusDto,
    @Request() req,
  ) {
    return this.issuesService.updateStatus(
      id,
      updateStatusDto,
      req.user.id,
      req.user,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
    @Request() req,
  ) {
    return this.issuesService.update(id, updateIssueDto, req.user);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.issuesService.addComment(id, createCommentDto, req.user.id);
  }
}


