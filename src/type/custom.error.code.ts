enum CustomErrorCode {
  // 인증 관련 에러 코드
  INVALID_LOGIN = 1000, // 잘못된 로그인 방식 -> 소셜 아이디로 로컬로그인 하는경우

  // 유저 관련 에러 코드
  USER_NOT_FOUND = 1100,

  // 선물 관련 에러 코드
  PRESENT_NOT_FOUND = 1200, // 존재하지 않는 유저

  // 펀딩 관련 에러 코드
  FUNDING_NOT_FOUND = 1300,

  // 이미지 관련 에러 코드
  IMAGE_NOT_FOUND = 1400,

  // request 요청 에러
  WRONG_REQUEST = 1500,

  // validation 에러
  VALIDATION_ERROR = 1600,

  // 서버 에러
  INTERNAL_SERVER_ERROR = 1700,

  // NOT FOUND 에러
  PAGE_NOT_FOUND = 1800,

  // 예상못한 에러
  UNCATCHED_ERROR = 1900,
}

export default CustomErrorCode;
