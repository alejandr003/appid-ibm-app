import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '../user/user.entity';

const APPID_OAUTH_SERVER_URL = process.env.APPID_OAUTH_SERVER_URL!;
const APPID_CLIENT_ID = process.env.APPID_CLIENT_ID!;
const APPID_CLIENT_SECRET = process.env.APPID_CLIENT_SECRET!;
const APPID_REDIRECT_URI = process.env.APPID_REDIRECT_URI!;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: APPID_CLIENT_ID,
      redirect_uri: APPID_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
    });
    return `${APPID_OAUTH_SERVER_URL}/authorization?${params}`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const { data } = await axios.post(
      `${APPID_OAUTH_SERVER_URL}/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: APPID_CLIENT_ID,
        client_secret: APPID_CLIENT_SECRET,
        redirect_uri: APPID_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return data;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const { data } = await axios.get(
      `${APPID_OAUTH_SERVER_URL}/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    return data;
  }

  async findOrCreateUser(appIdUser: any): Promise<User> {
    const sub = appIdUser.sub;
    let user = await this.usersRepository.findOne({ where: { sub } });
    if (!user) {
      user = this.usersRepository.create({
        id: sub,
        sub,
        email: appIdUser.email || '',
        name: appIdUser.name || appIdUser.given_name || '',
        avatar: appIdUser.picture || '',
      });
      await this.usersRepository.save(user);
    }
    return user;
  }
}
