import { Module } from '@nestjs/common';
import { GraphqlService } from './graphql.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [GraphqlService],
  providers: [GraphqlService]
})
export class GraphqlModule { }
