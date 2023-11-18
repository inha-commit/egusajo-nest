function createdAtToString(inputDate: Date | string): string {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 맞춤
  const day = String(date.getDate()).padStart(2, '0'); // 날짜를 두 자리로 맞춤

  return `${year}년 ${month}월 ${day}일`;
}

function deadlineToString(inputDate: Date | string): string {
  const today = new Date();
  const deadlineDate = new Date(inputDate);

  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff > 1) {
    return `D-${daysDiff}`;
  } else if (daysDiff === 1) {
    return 'D-1';
  } else if (daysDiff < 1 && daysDiff >= 0) {
    return 'D-day';
  } else {
    return 'END';
  }
}

export { createdAtToString, deadlineToString };
