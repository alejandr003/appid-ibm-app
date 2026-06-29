import { Controller, Get, Render, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  @Render('login')
  root() {
    return {};
  }

  @Get('dashboard')
  @Render('dashboard')
  dashboard(@Req() req: Request) {
    const user = (req as any).session?.user;
    if (!user) {
      return { user: null, initials: '' };
    }
    const initials = (user.name || user.email || '?').charAt(0).toUpperCase();
    return { user, initials };
  }
}
