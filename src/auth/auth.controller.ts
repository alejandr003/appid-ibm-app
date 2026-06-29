import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  login(@Res() res: Response) {
    const url = this.authService.getAuthorizationUrl();
    res.redirect(url);
  }

  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    if (!code) {
      return res.redirect('/');
    }
    const tokenData = await this.authService.exchangeCodeForToken(code);
    const appIdUser = await this.authService.getUserInfo(tokenData.access_token);
    const user = await this.authService.findOrCreateUser(appIdUser);
    (req as any).session.user = user;
    res.redirect('/dashboard');
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }

  @Get('me')
  me(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).session?.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(user);
  }
}
