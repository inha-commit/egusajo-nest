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
  birthday: string;
  bank: string;
  account: string;
  profileImgSrc: string;
  alarm: boolean;
  fundingNum?: number;
  fundedNum?: number;
  isFollowing?: boolean;
};

type CreateUserDAO = {
  snsId: string;
  name: string;
  nickname: string;
  birthday: string;
  bank: string;
  account: string;
  profileImgSrc: string;
};

type UpdateUserDAO = {
  name: string;
  nickname: string;
  birthday: string;
  // bank: string;
  // account: string;
  profileImgSrc: string;
  alarm: boolean;
};

type UpdateMyInfoResponse = {
  success: boolean;
};

type DeleteMyInfoResponse = {
  success: boolean;
};

// Follow
type Follower = {
  id: number;
  name: string;
  nickname: string;
  birthday: string;
  profileImgSrc: string;
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
  deadline: string;
  representImage: string;
  shortComment: string;
  longComment: string;
  createdAt: Date;
};

type CreatePresentDAO = {
  name: string;
  productLink: string;
  goal: number;
  deadline: string;
  presentImages: string[];
  representImage: string;
  shortComment: string;
  longComment: string;
};

type UpdatePresentDAO = {
  name: string;
  productLink: string;
  goal: number;
  deadline: string;
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
  participateStatus: 'TRUE' | 'FALSE' | 'MINE';
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

type CreateFundResponse = {
  success: true;
};

type DeleteFundResponse = {
  success: true;
};

// fcm
type FcmMessage = {
  data: {
    title: string; // 알림 메세지 제목
    body: string; // 알림 메세지 내용
    code: string; // 알림 메세지 구분 코드
  };
  token: string; // 사용자 Fcm Token
};

export type {
  AccessToken,
  Tokens,
  NicknameValidationResponse,
  User,
  CreateUserDAO,
  UpdateUserDAO,
  UpdateMyInfoResponse,
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
  FcmMessage,
  CreateFundResponse,
  DeleteFundResponse,
};
