// Auth
type AccessToken = {
  accessToken: string;
};

type RefreshToken = {
  refreshToken: string;
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
  snsId: string;
  name: string;
  nickname: string;
  birthday: Date;
  bank: string;
  account: string;
  profileImgSrc: string;
  fcmId: string;
  alarm: boolean;
};

type UserDAO = {
  snsId: string;
  name: string;
  nickname: string;
  birthday: string;
  bank: string;
  account: string;
  profileImgSrc: string;
  fcmId: string;
};

type DeleteMyInfoResponse = {
  success: boolean;
};

// Follow
type Follower = {
  id: number;
  name: string;
  nickname: string;
  birthday: Date;
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

// Present
type Present = {
  id: number;
  name: string;
  productLink: string;
  complete: boolean;
  goal: number;
  money: number;
  deadline: Date;
  representImage: string;
  shortComment: string;
  longComment: string;
};

type PresentWithUser = {
  user: User;
  present: Present;
};

type CreatePresentResponse = {
  success: boolean;
};

type UpdatePresentResponse = {
  success: boolean;
};

type DeletePresentResponse = {
  success: boolean;
};

// PresentImage
type PresentImage = {
  id: number;
  src: string;
};

export type {
  AccessToken,
  Tokens,
  NicknameValidationResponse,
  User,
  UserDAO,
  DeleteMyInfoResponse,
  Follower,
  FollowResponse,
  UnFollowResponse,
  Present,
  PresentWithUser,
  CreatePresentResponse,
  UpdatePresentResponse,
  DeletePresentResponse,
  PresentImage,
};
