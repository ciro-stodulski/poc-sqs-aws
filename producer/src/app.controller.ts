import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("purchase")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("")
  processMessaging(
    @Body('type') type: string,
    @Body('product_id') productId: string,
    @Body('quantity') quantity: number,
    @Body('user_id') userId: number,
  ): void {
     this.appService.processMessaging({
      type,
      productId,
      quantity,
      userId
     });
  }
}
