// Auth
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

// User
type User = {
  id: number;
  nickname: string;
  birthday: string;
  profileImgSrc: string;
  fcmId: string;
  alarm: boolean;
};

type DeleteMyInfoResponse = {
  success: boolean;
};

// Follow
type Follower = {
  id: number;
  nickname: string;
  birthday: string;
  profileImgSrc: string;
  fcmId: string;
  alarm: boolean;
  isFollowing: boolean;
};

type FollowResponse = {
  success: boolean;
};

type UnFollowResponse = {
  success: boolean;
};

// Image

export type {
  AccessToken,
  Tokens,
  NicknameValidationResponse,
  User,
  DeleteMyInfoResponse,
  Follower,
  FollowResponse,
  UnFollowResponse,
};
