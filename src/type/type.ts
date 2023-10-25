type AccessToken = {
  accessToken: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type NicknameValidationResponse = {
  success: boolean;
};

export type { AccessToken, Tokens, NicknameValidationResponse };
