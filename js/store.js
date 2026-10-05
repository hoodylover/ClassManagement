import { INITIAL_STUDENTS, INITIAL_ROLES, INITIAL_SHOP_ITEMS, LEVEL_TIERS } from './data.js';

const STORAGE_KEY = 'LEVELUP_CLASS_DATA_V1';

export class ClassStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('LocalStorage load failed:', e);
    }

    // 기본 초기 데이터 구조
    const initialData = {
      className: "6학년 1반",
      currencyName: "골드(G)",
      students: JSON.parse(JSON.stringify(INITIAL_STUDENTS)),
      roles: JSON.parse(JSON.stringify(INITIAL_ROLES)),
      shopItems: JSON.parse(JSON.stringify(INITIAL_SHOP_ITEMS)),
      transactions: [],
      couponApprovals: [] // 교사 승인 대기 쿠폰 목록
    };
    this.saveData(initialData);
    return initialData;
  }

  saveData(customData = null) {
    const toSave = customData || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  }

  // 기본값으로 전체 초기화
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.loadData();
    return this.data;
  }

  // JSON 백업 내보내기 & 불러오기
  exportJson() {
    return JSON.stringify(this.data, null, 2);
  }

  importJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.students && parsed.roles && parsed.shopItems) {
        this.data = parsed;
        this.saveData();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import:', e);
    }
    return false;
  }

  // --- 학생 관련 ---
  getStudents() {
    return this.data.students;
  }

  getStudent(id) {
    return this.data.students.find(s => s.id === id);
  }

  // 레벨 및 진행률 계산
  calculateLevel(exp) {
    let currentTier = LEVEL_TIERS[0];
    let nextTier = null;

    for (let i = 0; i < LEVEL_TIERS.length; i++) {
      if (exp >= LEVEL_TIERS[i].minExp) {
        currentTier = LEVEL_TIERS[i];
        nextTier = LEVEL_TIERS[i + 1] || null;
      } else {
        break;
      }
    }

    let progressPercent = 100;
    let nextExpNeeded = 0;
    let currentTierExp = exp - currentTier.minExp;

    if (nextTier) {
      const tierRange = nextTier.minExp - currentTier.minExp;
      progressPercent = Math.min(100, Math.max(0, Math.floor((currentTierExp / tierRange) * 100)));
      nextExpNeeded = nextTier.minExp - exp;
    }

    return {
      level: currentTier.level,
      title: currentTier.title,
      badge: currentTier.badge,
      color: currentTier.color,
      currentExp: exp,
      nextTierMinExp: nextTier ? nextTier.minExp : null,
      nextExpNeeded,
      progressPercent,
      isMaxLevel: !nextTier
    };
  }

  // --- 화폐 지급 / 차감 ---
  adjustBalance(studentId, amount, reason = "선생님 보상") {
    const student = this.getStudent(studentId);
    if (!student) return { success: false, error: "학생을 찾을 수 없습니다." };

    const oldBalance = student.balance;
    const newBalance = Math.max(0, oldBalance + amount);
    student.balance = newBalance;

    // 거래 내역 기록
    const tx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      studentId: student.id,
      studentName: student.name,
      studentNumber: student.number,
      type: amount >= 0 ? 'earn' : 'deduct',
      amount,
      oldBalance,
      newBalance,
      reason,
      timestamp: new Date().toISOString()
    };
    this.data.transactions.unshift(tx);
    // 최대 300개 유지
    if (this.data.transactions.length > 300) {
      this.data.transactions.pop();
    }

    this.saveData();
    return { success: true, student, tx };
  }

  // 여러 학생에게 일괄 지급
  adjustBatchBalance(studentIds, amount, reason = "학급 전체 보상") {
    const results = [];
    studentIds.forEach(id => {
      const res = this.adjustBalance(id, amount, reason);
      if (res.success) results.push(res);
    });
    return results;
  }

  // 경험치 직접 부여 (보너스 경험치 등)
  addExp(studentId, expAmount, reason = "선생님 칭찬 경험치") {
    const student = this.getStudent(studentId);
    if (!student) return { success: false };

    const oldLevelInfo = this.calculateLevel(student.exp);
    student.exp += expAmount;
    const newLevelInfo = this.calculateLevel(student.exp);
    const leveledUp = newLevelInfo.level > oldLevelInfo.level;
    student.level = newLevelInfo.level;

    this.saveData();
    return { success: true, student, leveledUp, oldLevelInfo, newLevelInfo };
  }

  // --- 1인 1역 (오늘 할 일) ---
  getRoles() {
    return this.data.roles;
  }

  getRole(roleId) {
    return this.data.roles.find(r => r.id === roleId);
  }

  assignRole(studentId, roleId) {
    const student = this.getStudent(studentId);
    if (student) {
      student.roleId = roleId;
      this.saveData();
      return true;
    }
    return false;
  }

  saveRole(roleData) {
    if (roleData.id) {
      const idx = this.data.roles.findIndex(r => r.id === roleData.id);
      if (idx !== -1) {
        this.data.roles[idx] = { ...this.data.roles[idx], ...roleData };
      }
    } else {
      const newRole = {
        ...roleData,
        id: `role_${Date.now()}`
      };
      this.data.roles.push(newRole);
    }
    this.saveData();
    return true;
  }

  deleteRole(roleId) {
    this.data.roles = this.data.roles.filter(r => r.id !== roleId);
    // 학생 중 해당 역할을 가진 경우 빈값 처리
    this.data.students.forEach(s => {
      if (s.roleId === roleId) s.roleId = null;
    });
    this.saveData();
    return true;
  }

  // 학생이 '오늘 할 일' 완료 체크
  completeTodayTask(studentId) {
    const student = this.getStudent(studentId);
    if (!student) return { success: false, error: "학생 정보를 찾을 수 없습니다." };
    if (student.todayCompleted) {
      return { success: false, error: "이미 오늘 임무를 완료했습니다!" };
    }

    const role = this.getRole(student.roleId);
    const currencyReward = role ? role.dailyCurrency : 10;
    const expReward = role ? role.dailyExp : 20;

    // 화폐 지급
    const oldBalance = student.balance;
    student.balance += currencyReward;

    // 경험치 지급 및 레벨업 체크
    const oldLevelInfo = this.calculateLevel(student.exp);
    student.exp += expReward;
    const newLevelInfo = this.calculateLevel(student.exp);
    const leveledUp = newLevelInfo.level > oldLevelInfo.level;
    student.level = newLevelInfo.level;

    student.todayCompleted = true;

    // 거래 내역
    this.data.transactions.unshift({
      id: `tx_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentNumber: student.number,
      type: 'earn',
      amount: currencyReward,
      oldBalance,
      newBalance: student.balance,
      reason: `1인 1역 완수 (${role ? role.name : '기본 임무'}) +${expReward}EXP`,
      timestamp: new Date().toISOString()
    });

    this.saveData();
    return {
      success: true,
      student,
      currencyReward,
      expReward,
      leveledUp,
      newLevelInfo
    };
  }

  // 교사용: 오늘 할 일 전체 리셋(새로운 하루 시작)
  resetAllDailyTasks() {
    this.data.students.forEach(s => {
      s.todayCompleted = false;
    });
    this.saveData();
    return true;
  }

  // 특정 학생 오늘 할 일 리셋
  resetStudentDailyTask(studentId) {
    const student = this.getStudent(studentId);
    if (student) {
      student.todayCompleted = false;
      this.saveData();
      return true;
    }
    return false;
  }

  // --- 상점 & 인벤토리 ---
  getShopItems() {
    return this.data.shopItems;
  }

  saveShopItem(itemData) {
    if (itemData.id) {
      const idx = this.data.shopItems.findIndex(i => i.id === itemData.id);
      if (idx !== -1) {
        this.data.shopItems[idx] = { ...this.data.shopItems[idx], ...itemData };
      }
    } else {
      const newItem = {
        ...itemData,
        id: `item_${Date.now()}`
      };
      this.data.shopItems.push(newItem);
    }
    this.saveData();
    return true;
  }

  deleteShopItem(itemId) {
    this.data.shopItems = this.data.shopItems.filter(i => i.id !== itemId);
    this.saveData();
    return true;
  }

  buyShopItem(studentId, itemId) {
    const student = this.getStudent(studentId);
    const item = this.data.shopItems.find(i => i.id === itemId);

    if (!student || !item) {
      return { success: false, error: "상품 또는 학생 정보가 유효하지 않습니다." };
    }
    if (item.stock !== undefined && item.stock <= 0) {
      return { success: false, error: "준비된 재고가 모두 소진되었습니다!" };
    }
    if (student.balance < item.price) {
      return { success: false, error: `잔액이 부족합니다! (필요: ${item.price}G, 보유: ${student.balance}G)` };
    }

    // 잔액 차감 & 재고 감소
    const oldBalance = student.balance;
    student.balance -= item.price;
    if (item.stock !== undefined) {
      item.stock = Math.max(0, item.stock - 1);
    }

    // 인벤토리에 쿠폰 추가
    if (!student.inventory) student.inventory = [];
    const couponInstance = {
      instanceId: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      itemId: item.id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      boughtAt: new Date().toISOString(),
      status: 'unused' // 'unused' | 'pending_approval' | 'used'
    };
    student.inventory.unshift(couponInstance);

    // 거래 내역
    this.data.transactions.unshift({
      id: `tx_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentNumber: student.number,
      type: 'spend',
      amount: -item.price,
      oldBalance,
      newBalance: student.balance,
      reason: `상점 쿠폰 구매: ${item.name}`,
      timestamp: new Date().toISOString()
    });

    this.saveData();
    return { success: true, student, item, coupon: couponInstance };
  }

  // 학생: 쿠폰 사용 요청 (선생님 승인 대기 모드로 전환)
  requestUseCoupon(studentId, instanceId) {
    const student = this.getStudent(studentId);
    if (!student || !student.inventory) return { success: false, error: "쿠폰을 찾을 수 없습니다." };

    const coupon = student.inventory.find(c => c.instanceId === instanceId);
    if (!coupon) return { success: false, error: "쿠폰이 존재하지 않습니다." };
    if (coupon.status === 'used') return { success: false, error: "이미 사용된 쿠폰입니다." };

    coupon.status = 'pending_approval';
    coupon.requestedAt = new Date().toISOString();

    // 교사 승인 목록에도 동기화
    if (!this.data.couponApprovals) this.data.couponApprovals = [];
    const existingIndex = this.data.couponApprovals.findIndex(a => a.instanceId === instanceId);
    const approvalItem = {
      instanceId,
      studentId: student.id,
      studentName: student.name,
      studentNumber: student.number,
      couponName: coupon.name,
      requestedAt: coupon.requestedAt
    };
    if (existingIndex >= 0) {
      this.data.couponApprovals[existingIndex] = approvalItem;
    } else {
      this.data.couponApprovals.unshift(approvalItem);
    }

    this.saveData();
    return { success: true, coupon };
  }

  // 교사: 쿠폰 승인 처리(사용 완료)
  approveCoupon(instanceId) {
    let targetCoupon = null;
    let targetStudent = null;

    for (const student of this.data.students) {
      if (student.inventory) {
        const found = student.inventory.find(c => c.instanceId === instanceId);
        if (found) {
          found.status = 'used';
          found.usedAt = new Date().toISOString();
          targetCoupon = found;
          targetStudent = student;
          break;
        }
      }
    }

    if (this.data.couponApprovals) {
      this.data.couponApprovals = this.data.couponApprovals.filter(a => a.instanceId !== instanceId);
    }

    this.saveData();
    return { success: !!targetCoupon, coupon: targetCoupon, student: targetStudent };
  }

  // 교사: 쿠폰 승인 반려/취소 (다시 unused 상태로)
  rejectCoupon(instanceId) {
    for (const student of this.data.students) {
      if (student.inventory) {
        const found = student.inventory.find(c => c.instanceId === instanceId);
        if (found) {
          found.status = 'unused';
          delete found.requestedAt;
          break;
        }
      }
    }
    if (this.data.couponApprovals) {
      this.data.couponApprovals = this.data.couponApprovals.filter(a => a.instanceId !== instanceId);
    }
    this.saveData();
    return true;
  }

  // 승인 대기 중인 쿠폰 목록 조회
  getPendingCoupons() {
    return this.data.couponApprovals || [];
  }

  // 거래 내역 조회
  getTransactions(studentId = null) {
    if (studentId) {
      return this.data.transactions.filter(t => t.studentId === studentId);
    }
    return this.data.transactions;
  }
}

export const store = new ClassStore();
