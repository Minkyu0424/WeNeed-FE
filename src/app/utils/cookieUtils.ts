import { parse } from 'cookie';
import { NextResponse } from 'next/server';

export const setTokens = (
  response: NextResponse<unknown>,
  accessToken: string,
  refreshToken: string,
): NextResponse<unknown> => {
  try {
    response.cookies.set('accessToken', accessToken);
    response.cookies.set('refreshToken', refreshToken);

    console.log('cookies set on server response', response);
    return response;
  } catch (error) {
    console.error('Error during setting cookies:', error);
    throw error;
  }
};

export const getCookie = (req: Request, name: string) => {
  try {
    const cookieHeader = req.headers.get('cookie');
    const cookies = parse(cookieHeader || '');
    console.log('getCookies cookies : ', cookies);
    console.log('getCookies cookies[name] : ', cookies[name]);
    return cookies[name];
  } catch (error) {
    console.error('Error during getting cookies:', error);
    throw error;
  }
};
