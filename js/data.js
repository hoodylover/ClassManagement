// 초기 기본 데이터 및 마스터 테이블

export const INITIAL_ROLES = [
  {
    id: "role_1",
    name: "칠판 도우미 🧹",
    icon: "🧹",
    description: "쉬는 시간마다 칠판을 깨끗이 지우고 분필 가루를 정리합니다.",
    dailyCurrency: 15,
    dailyExp: 25
  },
  {
    id: "role_2",
    name: "우유 배급 반장 🥛",
    icon: "🥛",
    description: "급식 후 우유를 빠짐없이 배부하고 우유갑 정리를 돕습니다.",
    dailyCurrency: 15,
    dailyExp: 25
  },
  {
    id: "role_3",
    name: "환기 및 에너지 지킴이 🍃",
    icon: "🍃",
    description: "쉬는 시간 창문을 열어 환기하고 빈 교실 전등을 끕니다.",
    dailyCurrency: 10,
    dailyExp: 20
  },
  {
    id: "role_4",
    name: "학급 도서관 사서 📚",
    icon: "📚",
    description: "학급 문고 도서 대여 기록을 관리하고 책장을 깔끔히 정돈합니다.",
    dailyCurrency: 20,
    dailyExp: 30
  },
  {
    id: "role_5",
    name: "체육 활동 지원관 ⚽",
    icon: "⚽",
    description: "체육 수업 전후로 공과 체육 교구를 안전하게 운반 및 반납합니다.",
    dailyCurrency: 15,
    dailyExp: 25
  },
  {
    id: "role_6",
    name: "ICT 정보 도우미 💻",
    icon: "💻",
    description: "전자칠판과 태블릿 PC 충전함을 점검하고 수업 준비를 지원합니다.",
    dailyCurrency: 20,
    dailyExp: 30
  },
  {
    id: "role_7",
    name: "출결 및 알림장 기록관 📢",
    icon: "📢",
    description: "오늘의 알림장을 보조 칠판에 적고 전달 사항을 공유합니다.",
    dailyCurrency: 15,
    dailyExp: 25
  },
  {
    id: "role_8",
    name: "식물 및 환경 가꿈이 🌱",
    icon: "🌱",
    description: "교실 화분에 물을 주고 재활용 분리수거함을 관리합니다.",
    dailyCurrency: 15,
    dailyExp: 25
  }
];

export const INITIAL_SHOP_ITEMS = [
  {
    id: "item_seat",
    name: "자리 우선 선택권 💺",
    category: "benefit",
    icon: "💺",
    description: "다음 자리 바꾸기 때 원하는 자리를 1순위로 먼저 선택할 수 있습니다.",
    price: 60,
    stock: 4
  },
  {
    id: "item_homework",
    name: "숙제 1회 면제권 📝",
    category: "benefit",
    icon: "📝",
    description: "일일 과제나 복습 노트 숙제를 1회 기한 연장 또는 면제받습니다.",
    price: 100,
    stock: 5
  },
  {
    id: "item_lunch",
    name: "급식 1등 줄서기권 🍱",
    category: "fun",
    icon: "🍱",
    description: "하루 동안 점심시간 급식 줄을 1등으로 설 수 있는 황금 티켓입니다.",
    price: 45,
    stock: 6
  },
  {
    id: "item_music",
    name: "점심시간 희망곡 신청권 🎵",
    category: "fun",
    icon: "🎵",
    description: "점심시간에 반 전체가 함께 들을 음악 1곡을 직접 신청합니다.",
    price: 30,
    stock: 10
  },
  {
    id: "item_boardgame",
    name: "보드게임 우선 대여권 🎲",
    category: "fun",
    icon: "🎲",
    description: "중간놀이 및 점심시간 인기 보드게임을 1순위로 대여합니다.",
    price: 35,
    stock: 8
  },
  {
    id: "item_tea",
    name: "선생님과 1:1 티타임/상담권 ☕",
    category: "special",
    icon: "☕",
    description: "선생님과 맛있는 간식을 먹으며 편안하게 고민 상담을 나눕니다.",
    price: 25,
    stock: 5
  },
  {
    id: "item_freetime",
    name: "자유시간 10분 쿠폰 ⏱️",
    category: "benefit",
    icon: "⏱️",
    description: "자율활동 시간 또는 창체 시간에 10분간 원하는 자유 활동을 합니다.",
    price: 80,
    stock: 4
  },
  {
    id: "item_snack",
    name: "선생님 간식 보물상자 뽑기 🎁",
    category: "fun",
    icon: "🎁",
    description: "선생님의 보물 간식 상자에서 무작위 간식을 하나 뽑습니다.",
    price: 40,
    stock: 15
  }
];

// 레벨 정의: 레벨, 필요 누적 경험치, 호칭/칭호, 뱃지
export const LEVEL_TIERS = [
  { level: 1, minExp: 0, title: "새싹 모험가", badge: "🌱", color: "#10b981" },
  { level: 2, minExp: 80, title: "성실한 탐험가", badge: "🧭", color: "#06b6d4" },
  { level: 3, minExp: 200, title: "열정의 길잡이", badge: "⭐", color: "#3b82f6" },
  { level: 4, minExp: 380, title: "학급의 수호자", badge: "🛡️", color: "#8b5cf6" },
  { level: 5, minExp: 620, title: "황금빛 리더", badge: "👑", color: "#f59e0b" },
  { level: 6, minExp: 950, title: "전설의 마스터", badge: "🏆", color: "#ec4899" }
];

// 초등 6학년 학생 25명 명단 초기 데이터
export const INITIAL_STUDENTS = [
  { number: 1, name: "강서준", gender: "m", roleId: "role_1", balance: 50, exp: 60, todayCompleted: false, inventory: [] },
  { number: 2, name: "고도현", gender: "m", roleId: "role_2", balance: 75, exp: 90, todayCompleted: true, inventory: [] },
  { number: 3, name: "김민준", gender: "m", roleId: "role_3", balance: 110, exp: 120, todayCompleted: false, inventory: [] },
  { number: 4, name: "김서아", gender: "f", roleId: "role_4", balance: 95, exp: 140, todayCompleted: true, inventory: [] },
  { number: 5, name: "김예준", gender: "m", roleId: "role_5", balance: 40, exp: 50, todayCompleted: false, inventory: [] },
  { number: 6, name: "김지우", gender: "f", roleId: "role_6", balance: 130, exp: 210, todayCompleted: true, inventory: [] },
  { number: 7, name: "박도윤", gender: "m", roleId: "role_7", balance: 60, exp: 80, todayCompleted: false, inventory: [] },
  { number: 8, name: "박시우", gender: "m", roleId: "role_8", balance: 85, exp: 110, todayCompleted: false, inventory: [] },
  { number: 9, name: "박채원", gender: "f", roleId: "role_1", balance: 145, exp: 230, todayCompleted: true, inventory: [] },
  { number: 10, name: "배지훈", gender: "m", roleId: "role_2", balance: 55, exp: 70, todayCompleted: false, inventory: [] },
  { number: 11, name: "서연우", gender: "f", roleId: "role_3", balance: 120, exp: 180, todayCompleted: false, inventory: [] },
  { number: 12, name: "송유진", gender: "f", roleId: "role_4", balance: 90, exp: 130, todayCompleted: false, inventory: [] },
  { number: 13, name: "신태양", gender: "m", roleId: "role_5", balance: 70, exp: 95, todayCompleted: true, inventory: [] },
  { number: 14, name: "안승현", gender: "m", roleId: "role_6", balance: 160, exp: 260, todayCompleted: true, inventory: [] },
  { number: 15, name: "양하은", gender: "f", roleId: "role_7", balance: 65, exp: 85, todayCompleted: false, inventory: [] },
  { number: 16, name: "오지호", gender: "m", roleId: "role_8", balance: 45, exp: 55, todayCompleted: false, inventory: [] },
  { number: 17, name: "윤하윤", gender: "f", roleId: "role_1", balance: 105, exp: 160, todayCompleted: false, inventory: [] },
  { number: 18, name: "이다은", gender: "f", roleId: "role_2", balance: 140, exp: 215, todayCompleted: true, inventory: [] },
  { number: 19, name: "이도현", gender: "m", roleId: "role_3", balance: 50, exp: 65, todayCompleted: false, inventory: [] },
  { number: 20, name: "이준서", gender: "m", roleId: "role_4", balance: 80, exp: 105, todayCompleted: false, inventory: [] },
  { number: 21, name: "정시온", gender: "m", roleId: "role_5", balance: 115, exp: 175, todayCompleted: true, inventory: [] },
  { number: 22, name: "정예린", gender: "f", roleId: "role_6", balance: 190, exp: 320, todayCompleted: true, inventory: [] },
  { number: 23, name: "조은우", gender: "m", roleId: "role_7", balance: 35, exp: 40, todayCompleted: false, inventory: [] },
  { number: 24, name: "최서연", gender: "f", roleId: "role_8", balance: 125, exp: 190, todayCompleted: true, inventory: [] },
  { number: 25, name: "한지민", gender: "f", roleId: "role_1", balance: 100, exp: 150, todayCompleted: false, inventory: [] }
].map(s => ({
  ...s,
  id: `student_${s.number}`,
  avatar: s.gender === 'm' ? '👦' : '👧'
}));
