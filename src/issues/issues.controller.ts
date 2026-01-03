import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() createIssueDto: CreateIssueDto, @Request() req) {
    return this.issuesService.create(createIssueDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('apartmentId') apartmentId?: string,
    @Query('assignedManagerId') assignedManagerId?: string,
  ) {
    return this.issuesService.findAll({
      status: status as any,
      category,
      apartmentId,
      assignedManagerId,
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

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.issuesService.addComment(id, createCommentDto, req.user.id);
  }
}


