import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { SuccessResponse } from '@401_digital/xrm-core';

@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}
  @Get('/reviews')
  async findAll() {
    return new SuccessResponse(await this.googleService.reviews());
  }

  @Get('/reviews-by-location')
  async findReviewByLocation(@Query() query) {
    const { place_id } = query;
    const googleResponse = await this.googleService.findReviewByLocation(
      place_id,
    );
    return new SuccessResponse(googleResponse);
  }
}
