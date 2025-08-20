import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  //GOOGLE_CLIENT_ID = 611228379418-3vjm1bi20ecgpsmkltkcg8afdi9a20g7.apps.googleusercontent.com
  //GOOGLE_SECRET = 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
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL:
        'http://localhost:3008/api/v1/authentication/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
