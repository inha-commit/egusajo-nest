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

type CreateUserDAO = {
  snsId: string;
  name: string;
  nickname: string;
  birthday: Date;
  bank: string;
  account: string;
  profileImgSrc: string;
  fcmId: string;
};

type UpdateUserDAO = {
  name: string;
  nickname: string;
  birthday: Date;
  bank: string;
  account: string;
  profileImgSrc: string;
  alarm: boolean;
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
  createdAt: Date;
};

type CreatePresentDAO = {
  name: string;
  productLink: string;
  goal: number;
  deadline: Date;
  presentImages: string[];
  representImage: string;
  shortComment: string;
  longComment: string;
};

type UpdatePresentDAO = {
  name: string;
  productLink: string;
  goal: number;
  deadline: Date;
  presentImages: string[];
  representImage: string;
  shortComment: string;
  longComment: string;
};

type PresentWithUser = {
  user: User;
  present: Present;
};

type PresentWithFund = {
  user: User;
  present: Present;
  presentImages: string[];
  fundings: FundWithUser[];
  isParticipate: boolean;
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

// Fund
type Fund = {
  id: number;
  cost: number;
  comment: string;
  createdAt: Date;
};

type CreateFundDAO = {
  cost: number;
  comment: string;
};

type FundWithUser = {
  funding: Fund;
  user: User;
};

export type {
  AccessToken,
  Tokens,
  NicknameValidationResponse,
  User,
  CreateUserDAO,
  UpdateUserDAO,
  DeleteMyInfoResponse,
  Follower,
  FollowResponse,
  UnFollowResponse,
  Present,
  PresentWithUser,
  CreatePresentDAO,
  UpdatePresentDAO,
  CreatePresentResponse,
  UpdatePresentResponse,
  DeletePresentResponse,
  PresentImage,
  CreateFundDAO,
  PresentWithFund,
  FundWithUser,
};
