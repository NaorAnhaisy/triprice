import { ConfigFactory } from '@nestjs/config';

export const configFactory: ConfigFactory<{ config: IConfiguration }> = () => {
  const nodeEnv = process.env.NODE_ENV;
  const isProdEnv = nodeEnv === 'production';
  return {
    config: {
      nodeEnv: nodeEnv,
      appUrl: isProdEnv ? process.env.PROD_URL : process.env.DEV_URL,
      portConfiguration: {
        backendInside: Number(process.env.BACKEND_PORT_DEV),
        backendOutside: Number(
          isProdEnv
            ? process.env.BACKEND_PORT_PROD
            : process.env.BACKEND_PORT_DEV
        ),
        frontend: Number(
          isProdEnv ? process.env.CLIENT_PORT_PROD : process.env.CLIENT_PORT_DEV
        ),
      },
      amadeus: {
        client: {
          id: process.env.AMADEUS_CLIENT_ID,
          secret: process.env.AMADEUS_CLIENT_SECRET,
        },
      },
      jwt: {
        accessToken: process.env.ACCESS_TOKEN_JWT_KEY,
        expires: process.env.ACCESS_TOKEN_JWT_KEY_EXPIRATION,
      },
      airports: {
        key: process.env.AIRPORTS_AUTH_KEY,
        secret: process.env.AIRPORTS_AUTH_SECRET,
      },
      hasura: {
        key: process.env.HASURA_KEY,
      },
      gmail: {
        user: process.env.GMAIL_USER,
        password: process.env.GMAIL_APP_PASS,
      },
      googleAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      facebookAuth: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
      },
      cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
    },
  };
};

export interface IConfiguration {
  nodeEnv: string;
  appUrl: string;
  portConfiguration: IPortConfiguration;
  amadeus: IAmadeusConfiguration;
  jwt: IJwtConfiguration;
  airports: IAirportsConfiguration;
  hasura: IHasuraConfiguration;
  gmail: IGmailConfiguration;
  googleAuth: IGoogleAuthConfiguration;
  facebookAuth: IFacebookAuthConfiguration;
  cloudinary: ICloudinaryConfiguration;
}

export interface IPortConfiguration {
  backendInside: number;
  backendOutside: number;
  frontend: number;
}

export interface IAmadeusConfiguration {
  client: IAmadeusClientConfiguration;
}

export interface IAmadeusClientConfiguration {
  id: string;
  secret: string;
}

export interface IJwtConfiguration {
  accessToken: string;
  expires: string;
}

export interface IAirportsConfiguration {
  key: string;
  secret: string;
}

export interface IHasuraConfiguration {
  key: string;
}

export interface IGmailConfiguration {
  user: string;
  password: string;
}

export interface IGoogleAuthConfiguration {
  clientId: string;
  clientSecret: string;
}

export interface IFacebookAuthConfiguration {
  appId: string;
  appSecret: string;
}

export interface ICloudinaryConfiguration {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}
