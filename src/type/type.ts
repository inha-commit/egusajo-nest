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
