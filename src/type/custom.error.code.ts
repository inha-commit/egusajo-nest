enum CustomErrorCode {
  // 인증 관련 에러 코드
  INVALID_LOGIN = 1000, // 잘못된 로그인 방식 -> 소셜 아이디로 로컬로그인 하는경우

  // 토큰 관련 코드
  NO_ACCESS_TOKEN = 2000,
  EXPIRED_ACCESS_TOKEN = 2001,
  INVALID_ACCESS_TOKEN = 2002,

  NO_REFRESH_TOKEN = 2100,
  EXPIRED_REFRESH_TOKEN = 2101,
  INVALID_REFRESH_TOKEN = 2102,

  // 유저 관련 에러 코드
  USER_NOT_FOUND = 3000,

  // 선물 관련 에러 코드
  PRESENT_NOT_FOUND = 4000,

  // 펀딩 관련 에러 코드
  FUNDING_NOT_FOUND = 5000,

  // 이미지 관련 에러 코드
  IMAGE_NOT_FOUND = 6000,

  // request 요청 에러
  WRONG_REQUEST = 7000,

  // validation 에러
  VALIDATION_ERROR = 8000,

  // 서버 에러
  INTERNAL_SERVER_ERROR = 9000,

  // NOT FOUND 에러
  PAGE_NOT_FOUND = 10000,

  // 예상못한 에러
  UNCATCHED_ERROR = 99999,
}

export default CustomErrorCode;
