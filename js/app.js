import { store } from './store.js';
import { sounds } from './audio.js';
import { fireConfetti } from './confetti.js';

// ============================================================
// 애플리케이션 상태 (State)
// ============================================================
let currentMode = 'select'; // 'select' | 'teacher' | 'student-select' | 'student'
let currentStudentId = null;
let activeStudentSubTab = 'shop';
let activeTeacherTab = 'students';
const selectedStudentIds = new Set();
let adjustType = 'plus'; // 'plus' | 'minus'

// ============================================================
// DOM 요소 캐시
// ============================================================
const elements = {
  // 헤더
  brandHomeBtn: document.getElementById('brand-home-btn'),
  headerModeBadge: document.getElementById('header-mode-badge'),
  headerModeIcon: document.getElementById('header-mode-icon'),
  headerModeText: document.getElementById('header-mode-text'),
  quickStudentSwitcher: document.getElementById('quick-student-switcher'),
  btnSoundToggle: document.getElementById('btn-sound-toggle'),
  soundIcon: document.getElementById('sound-icon'),
  btnHeaderSwitchMode: document.getElementById('btn-header-switch-mode'),
  btnSwitchModeText: document.getElementById('btn-switch-mode-text'),

  // 뷰 섹션들
  viewRoleSelect: document.getElementById('view-role-select'),
  viewStudentSelect: document.getElementById('view-student-select'),
  viewStudentDashboard: document.getElementById('view-student-dashboard'),
  viewTeacherDashboard: document.getElementById('view-teacher-dashboard'),

  // 진입 화면
  btnEnterTeacher: document.getElementById('btn-enter-teacher'),
  btnEnterTeacherAction: document.getElementById('btn-enter-teacher-action'),
  btnEnterStudent: document.getElementById('btn-enter-student'),
  btnEnterStudentAction: document.getElementById('btn-enter-student-action'),
  btnBackToHome: document.getElementById('btn-back-to-home'),
  studentGridCards: document.getElementById('student-grid-cards'),

  // 학생 대시보드
  stuHeroAvatar: document.getElementById('stu-hero-avatar'),
  stuHeroClass: document.getElementById('stu-hero-class'),
  stuHeroName: document.getElementById('stu-hero-name'),
  stuHeroTierBadge: document.getElementById('stu-hero-tier-badge'),
  stuHeroTierTitle: document.getElementById('stu-hero-tier-title'),
  stuHeroBalance: document.getElementById('stu-hero-balance'),
  stuHeroExpCurrent: document.getElementById('stu-hero-exp-current'),
  stuHeroExpNext: document.getElementById('stu-hero-exp-next'),
  stuHeroExpBar: document.getElementById('stu-hero-exp-bar'),

  stuQuestCard: document.getElementById('stu-quest-card'),
  stuQuestRewardGold: document.getElementById('stu-quest-reward-gold'),
  stuQuestRewardExp: document.getElementById('stu-quest-reward-exp'),
  stuQuestIcon: document.getElementById('stu-quest-icon'),
  stuQuestName: document.getElementById('stu-quest-name'),
  stuQuestDesc: document.getElementById('stu-quest-desc'),
  stuQuestActionContainer: document.getElementById('stu-quest-action-container'),
  btnCompleteMyTask: document.getElementById('btn-complete-my-task'),

  stuShopGrid: document.getElementById('stu-shop-grid'),
  stuInventoryGrid: document.getElementById('stu-inventory-grid'),
  stuInventoryCount: document.getElementById('stu-inventory-count'),
  stuHistoryTbody: document.getElementById('stu-history-tbody'),

  // 교사 대시보드
  teaStatTotalCurrency: document.getElementById('tea-stat-total-currency'),
  teaStatTaskProgress: document.getElementById('tea-stat-task-progress'),
  teaStatPendingCoupons: document.getElementById('tea-stat-pending-coupons'),
  teaApprovalBadge: document.getElementById('tea-approval-badge'),

  checkAllStudents: document.getElementById('check-all-students'),
  btnBatchReward: document.getElementById('btn-batch-reward'),
  btnResetAllTasks: document.getElementById('btn-reset-all-tasks'),
  teacherStudentSearch: document.getElementById('teacher-student-search'),
  teaStudentsTbody: document.getElementById('tea-students-tbody'),

  btnAddRole: document.getElementById('btn-add-new-role'),
  teaRolesTbody: document.getElementById('tea-roles-tbody'),
  teaStudentRoleAssignTbody: document.getElementById('tea-student-role-assign-tbody'),

  btnAddShopItem: document.getElementById('btn-add-shop-item'),
  teaShopItemsGrid: document.getElementById('tea-shop-items-grid'),
  teaApprovalsTbody: document.getElementById('tea-approvals-tbody'),
  teaAllLogsTbody: document.getElementById('tea-all-logs-tbody'),

  btnExportJson: document.getElementById('btn-export-json'),
  fileImportJson: document.getElementById('file-import-json'),
  btnTriggerImportJson: document.getElementById('btn-trigger-import-json'),
  btnResetData: document.getElementById('btn-reset-data'),

  // 모달들
  modalAdjustBalance: document.getElementById('modal-adjust-balance'),
  modalAdjustTitle: document.getElementById('modal-adjust-title'),
  adjustStudentId: document.getElementById('adjust-student-id'),
  adjustStudentName: document.getElementById('adjust-student-name'),
  btnTypePlus: document.getElementById('btn-type-plus'),
  btnTypeMinus: document.getElementById('btn-type-minus'),
  adjustAmountInput: document.getElementById('adjust-amount-input'),
  adjustReasonInput: document.getElementById('adjust-reason-input'),
  btnConfirmAdjust: document.getElementById('btn-confirm-adjust'),

  modalBatchReward: document.getElementById('modal-batch-reward'),
  batchTargetDesc: document.getElementById('batch-target-desc'),
  batchAmountInput: document.getElementById('batch-amount-input'),
  batchReasonInput: document.getElementById('batch-reason-input'),
  btnConfirmBatch: document.getElementById('btn-confirm-batch'),

  modalRoleEdit: document.getElementById('modal-role-edit'),
  modalRoleTitle: document.getElementById('modal-role-title'),
  roleEditId: document.getElementById('role-edit-id'),
  roleEditName: document.getElementById('role-edit-name'),
  roleEditIcon: document.getElementById('role-edit-icon'),
  roleEditDesc: document.getElementById('role-edit-desc'),
  roleEditCurrency: document.getElementById('role-edit-currency'),
  roleEditExp: document.getElementById('role-edit-exp'),
  btnSaveRole: document.getElementById('btn-save-role'),

  modalShopEdit: document.getElementById('modal-shop-edit'),
  modalShopTitle: document.getElementById('modal-shop-title'),
  shopEditId: document.getElementById('shop-edit-id'),
  shopEditName: document.getElementById('shop-edit-name'),
  shopEditIcon: document.getElementById('shop-edit-icon'),
  shopEditDesc: document.getElementById('shop-edit-desc'),
  shopEditPrice: document.getElementById('shop-edit-price'),
  shopEditStock: document.getElementById('shop-edit-stock'),
  btnSaveShopItem: document.getElementById('btn-save-shop-item'),

  modalLevelup: document.getElementById('modal-levelup'),
  levelupStudentName: document.getElementById('levelup-student-name'),
  levelupBadgeIcon: document.getElementById('levelup-badge-icon'),
  levelupTierText: document.getElementById('levelup-tier-text'),

  toastContainer: document.getElementById('toast-container')
};

// ============================================================
// 유틸리티 및 토스트
// ============================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function closeModal(modalElement) {
  if (modalElement) modalElement.classList.remove('active');
}

function openModal(modalElement) {
  if (modalElement) modalElement.classList.add('active');
}

// ============================================================
// 뷰 네비게이션 제어
// ============================================================
function switchMode(newMode, studentId = null) {
  currentMode = newMode;
  if (studentId) currentStudentId = studentId;

  // 모든 뷰 숨김
  elements.viewRoleSelect.classList.remove('active');
  elements.viewStudentSelect.classList.remove('active');
  elements.viewStudentDashboard.classList.remove('active');
  elements.viewTeacherDashboard.classList.remove('active');

  // 헤더 컨트롤 업데이트
  if (currentMode === 'select') {
    elements.viewRoleSelect.classList.add('active');
    elements.headerModeBadge.style.display = 'none';
    elements.quickStudentSwitcher.style.display = 'none';
    elements.btnHeaderSwitchMode.style.display = 'none';
  } else if (currentMode === 'student-select') {
    elements.viewStudentSelect.classList.add('active');
    elements.headerModeBadge.style.display = 'inline-flex';
    elements.headerModeBadge.className = 'mode-indicator student';
    elements.headerModeIcon.textContent = '🎒';
    elements.headerModeText.textContent = '학생 선택';
    elements.quickStudentSwitcher.style.display = 'none';
    elements.btnHeaderSwitchMode.style.display = 'inline-flex';
    elements.btnSwitchModeText.textContent = '모드 선택';
    renderStudentSelectGrid();
  } else if (currentMode === 'student') {
    elements.viewStudentDashboard.classList.add('active');
    elements.headerModeBadge.style.display = 'inline-flex';
    elements.headerModeBadge.className = 'mode-indicator student';
    elements.headerModeIcon.textContent = '🎒';
    const curStudent = store.getStudent(currentStudentId);
    elements.headerModeText.textContent = curStudent ? `${curStudent.name} 학생` : '학생 모드';

    // 학생 빠른 전환 드롭다운 표시 및 갱신
    populateQuickStudentSwitcher();
    elements.quickStudentSwitcher.style.display = 'inline-block';
    elements.btnHeaderSwitchMode.style.display = 'inline-flex';
    elements.btnSwitchModeText.textContent = '교사 모드 전환';

    renderStudentDashboard(currentStudentId);
  } else if (currentMode === 'teacher') {
    elements.viewTeacherDashboard.classList.add('active');
    elements.headerModeBadge.style.display = 'inline-flex';
    elements.headerModeBadge.className = 'mode-indicator teacher';
    elements.headerModeIcon.textContent = '👨‍🏫';
    elements.headerModeText.textContent = '선생님 모드';
    elements.quickStudentSwitcher.style.display = 'none';
    elements.btnHeaderSwitchMode.style.display = 'inline-flex';
    elements.btnSwitchModeText.textContent = '학생 모드 전환';

    renderTeacherDashboard();
  }
}

function populateQuickStudentSwitcher() {
  const students = store.getStudents();
  elements.quickStudentSwitcher.innerHTML = '';
  students.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.number}번 ${s.name}`;
    if (s.id === currentStudentId) opt.selected = true;
    elements.quickStudentSwitcher.appendChild(opt);
  });
}

// ============================================================
// 1. 학생 프로필 선택 그리드 렌더링
// ============================================================
function renderStudentSelectGrid() {
  const students = store.getStudents();
  elements.studentGridCards.innerHTML = '';

  students.forEach(student => {
    const levelInfo = store.calculateLevel(student.exp);
    const role = store.getRole(student.roleId);
    const card = document.createElement('div');
    card.className = 'student-select-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    card.innerHTML = `
      <div class="student-card-header">
        <span class="student-number-badge">${student.number}번</span>
        <span class="student-level-badge" style="background: rgba(${levelInfo.level * 30}, 100, 200, 0.2); color: ${levelInfo.color};">
          ${levelInfo.badge} Lv.${levelInfo.level}
        </span>
      </div>
      <div class="student-card-body">
        <div class="student-avatar">${student.avatar}</div>
        <div class="student-meta-info">
          <span class="student-name">${student.name}</span>
          <span class="student-role-text" title="${role ? role.name : '미배정'}">${role ? role.name : '임무 없음'}</span>
        </div>
      </div>
      <div class="student-card-footer">
        <span class="student-balance-chip">💰 ${student.balance} G</span>
        <span class="task-status-pill ${student.todayCompleted ? 'done' : 'pending'}">
          ${student.todayCompleted ? '당번완료' : '할일대기'}
        </span>
      </div>
    `;

    card.addEventListener('click', () => {
      sounds.playClick();
      switchMode('student', student.id);
    });

    elements.studentGridCards.appendChild(card);
  });
}

// ============================================================
// 2. 학생 개인 대시보드 렌더링
// ============================================================
function renderStudentDashboard(studentId) {
  const student = store.getStudent(studentId);
  if (!student) {
    switchMode('student-select');
    return;
  }

  const levelInfo = store.calculateLevel(student.exp);
  const role = store.getRole(student.roleId);

  // 영웅 프로필 카드
  elements.stuHeroAvatar.textContent = student.avatar;
  elements.stuHeroClass.textContent = `6학년 1반 · ${student.number}번`;
  elements.stuHeroName.textContent = student.name;
  elements.stuHeroTierBadge.textContent = levelInfo.badge;
  elements.stuHeroTierTitle.textContent = `Lv.${levelInfo.level} ${levelInfo.title}`;
  elements.stuHeroBalance.textContent = `${student.balance} G`;

  elements.stuHeroExpCurrent.textContent = `현재 경험치: ${student.exp} EXP`;
  if (levelInfo.isMaxLevel) {
    elements.stuHeroExpNext.textContent = '최고 레벨 달성!';
    elements.stuHeroExpBar.style.width = '100%';
  } else {
    elements.stuHeroExpNext.textContent = `다음 레벨까지 ${levelInfo.nextExpNeeded} EXP 남음 (${levelInfo.progressPercent}%)`;
    elements.stuHeroExpBar.style.width = `${levelInfo.progressPercent}%`;
  }

  // 오늘 할 일 (1인 1역)
  if (role) {
    elements.stuQuestIcon.textContent = role.icon;
    elements.stuQuestName.textContent = role.name;
    elements.stuQuestDesc.textContent = role.description;
    elements.stuQuestRewardGold.textContent = `+${role.dailyCurrency} G`;
    elements.stuQuestRewardExp.textContent = `+${role.dailyExp} EXP`;
  } else {
    elements.stuQuestIcon.textContent = '🌟';
    elements.stuQuestName.textContent = '자율 학급 지킴이';
    elements.stuQuestDesc.textContent = '배정된 특정 역할이 없는 날입니다. 교실을 깨끗이 하고 친구를 돕습니다.';
    elements.stuQuestRewardGold.textContent = `+10 G`;
    elements.stuQuestRewardExp.textContent = `+20 EXP`;
  }

  // 완수 상태 여부에 따른 버튼 표시
  elements.stuQuestActionContainer.innerHTML = '';
  if (student.todayCompleted) {
    elements.stuQuestCard.classList.add('completed');
    elements.stuQuestActionContainer.innerHTML = `
      <div class="quest-completed-stamp">
        <span>✅</span> 오늘 임무 완수 완료!
      </div>
    `;
  } else {
    elements.stuQuestCard.classList.remove('completed');
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn-complete-quest';
    completeBtn.id = 'btn-complete-my-task';
    completeBtn.innerHTML = `<span>✨</span> 오늘 임무 완료하기`;
    completeBtn.addEventListener('click', handleCompleteTodayTask);
    elements.stuQuestActionContainer.appendChild(completeBtn);
  }

  // 인벤토리 개수 뱃지
  const activeCoupons = (student.inventory || []).filter(c => c.status !== 'used');
  elements.stuInventoryCount.textContent = activeCoupons.length;

  // 하위 탭 렌더링
  renderStudentShop(student);
  renderStudentInventory(student);
  renderStudentHistory(student);
}

// 학생: 상점 렌더링
function renderStudentShop(student) {
  const shopItems = store.getShopItems();
  elements.stuShopGrid.innerHTML = '';

  if (shopItems.length === 0) {
    elements.stuShopGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">현재 상점에 등록된 상품이 없습니다.</div>`;
    return;
  }

  shopItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-card';
    const isOutOfStock = item.stock !== undefined && item.stock <= 0;
    const isAffordable = student.balance >= item.price;

    card.innerHTML = `
      <div class="shop-card-icon">${item.icon || '🎁'}</div>
      <h4 class="shop-card-title">${item.name}</h4>
      <p class="shop-card-desc">${item.description}</p>
      <div class="shop-card-bottom">
        <div>
          <span class="shop-price-tag">💰 ${item.price} G</span>
          <span class="shop-stock-badge">${item.stock !== undefined ? `남은 수량: ${item.stock}개` : '수량 무제한'}</span>
        </div>
        <button class="btn-buy-item" ${isOutOfStock || !isAffordable ? 'disabled' : ''}>
          ${isOutOfStock ? '품절' : isAffordable ? '구매하기' : '잔액 부족'}
        </button>
      </div>
    `;

    const buyBtn = card.querySelector('.btn-buy-item');
    buyBtn.addEventListener('click', () => {
      handleBuyShopItem(item.id);
    });

    elements.stuShopGrid.appendChild(card);
  });
}

// 학생: 인벤토리(가방) 렌더링
function renderStudentInventory(student) {
  const inventory = student.inventory || [];
  elements.stuInventoryGrid.innerHTML = '';

  if (inventory.length === 0) {
    elements.stuInventoryGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px; background: rgba(255,255,255,0.03); border-radius: var(--radius-xl);">
        <p style="font-size: 32px; margin-bottom: 8px;">🎒</p>
        <p style="font-weight: 700;">가방이 비어있습니다.</p>
        <p style="font-size: 13px;">학급 상점에서 모은 골드로 다양한 보상 쿠폰을 구매해 보세요!</p>
      </div>
    `;
    return;
  }

  inventory.forEach(coupon => {
    const card = document.createElement('div');
    card.className = `coupon-card ${coupon.status}`;

    let statusText = '사용 가능';
    let statusClass = 'unused';
    if (coupon.status === 'pending_approval') {
      statusText = '선생님 승인 대기 중';
      statusClass = 'pending';
    } else if (coupon.status === 'used') {
      statusText = '사용 완료';
      statusClass = 'used';
    }

    card.innerHTML = `
      <div class="coupon-header">
        <span style="font-size: 28px;">${coupon.icon || '🎟️'}</span>
        <span class="coupon-status-tag ${statusClass}">${statusText}</span>
      </div>
      <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">${coupon.name}</h4>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px; flex: 1;">${coupon.description || '선생님께 확인받고 사용하는 쿠폰입니다.'}</p>
      <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 8px;">구매일: ${new Date(coupon.boughtAt).toLocaleDateString()}</div>
      ${
        coupon.status === 'unused'
          ? `<button class="btn-use-coupon" data-instance-id="${coupon.instanceId}">선생님께 보여드리고 사용하기</button>`
          : coupon.status === 'pending_approval'
          ? `<div style="text-align: center; font-size: 12px; color: #fde047; padding: 8px; font-weight: 700;">선생님께서 확인 중입니다... ⏳</div>`
          : `<div style="text-align: center; font-size: 12px; color: var(--text-dim); padding: 8px;">사용 완료됨</div>`
      }
    `;

    const useBtn = card.querySelector('.btn-use-coupon');
    if (useBtn) {
      useBtn.addEventListener('click', () => {
        handleUseCoupon(coupon.instanceId);
      });
    }

    elements.stuInventoryGrid.appendChild(card);
  });
}

// 학생: 화폐 거래 내역 렌더링
function renderStudentHistory(student) {
  const txs = store.getTransactions(student.id);
  elements.stuHistoryTbody.innerHTML = '';

  if (txs.length === 0) {
    elements.stuHistoryTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">아직 거래 내역이 없습니다.</td></tr>`;
    return;
  }

  txs.forEach(t => {
    const tr = document.createElement('tr');
    const isPlus = t.amount >= 0;
    tr.innerHTML = `
      <td style="color: var(--text-muted);">${new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td>
        <span class="task-status-pill ${isPlus ? 'done' : 'pending'}">${isPlus ? '획득' : '차감/지출'}</span>
      </td>
      <td style="font-weight: 600;">${t.reason}</td>
      <td style="font-weight: 800; color: ${isPlus ? '#34d399' : '#fb7185'};">
        ${isPlus ? `+${t.amount}` : t.amount} G
      </td>
      <td style="font-weight: 700; color: var(--gold);">${t.newBalance} G</td>
    `;
    elements.stuHistoryTbody.appendChild(tr);
  });
}

// ============================================================
// 학생 이벤트 핸들러
// ============================================================
function handleCompleteTodayTask() {
  sounds.playClick();
  const res = store.completeTodayTask(currentStudentId);
  if (!res.success) {
    showToast(res.error, 'error');
    return;
  }

  sounds.playStamp();
  setTimeout(() => sounds.playCoin(), 250);
  fireConfetti(2200);

  showToast(`오늘의 1인 1역 임무 완료! +${res.currencyReward}G, +${res.expReward}EXP를 획득했습니다!`, 'success');

  // 레벨업 발생 시 축하 모달
  if (res.leveledUp) {
    setTimeout(() => {
      sounds.playLevelUp();
      fireConfetti(3500);
      elements.levelupStudentName.textContent = `${res.student.name} 학생 축하합니다!`;
      elements.levelupBadgeIcon.textContent = res.newLevelInfo.badge;
      elements.levelupTierText.textContent = `Lv.${res.newLevelInfo.level} ${res.newLevelInfo.title}`;
      openModal(elements.modalLevelup);
    }, 600);
  }

  renderStudentDashboard(currentStudentId);
}

function handleBuyShopItem(itemId) {
  sounds.playClick();
  const res = store.buyShopItem(currentStudentId, itemId);
  if (!res.success) {
    sounds.playDeduct();
    showToast(res.error, 'error');
    return;
  }

  sounds.playCoin();
  showToast(`[${res.item.name}] 쿠폰을 구매했습니다! 내 가방을 확인하세요.`, 'success');
  renderStudentDashboard(currentStudentId);
}

function handleUseCoupon(instanceId) {
  sounds.playClick();
  const res = store.requestUseCoupon(currentStudentId, instanceId);
  if (!res.success) {
    showToast(res.error, 'error');
    return;
  }

  showToast('선생님께 쿠폰 사용 승인을 요청했습니다. 선생님 화면에서 확인을 받아주세요!', 'info');
  renderStudentDashboard(currentStudentId);
}

// ============================================================
// 3. 교사 대시보드 렌더링
// ============================================================
function renderTeacherDashboard() {
  const students = store.getStudents();
  const pendingCoupons = store.getPendingCoupons();

  // 상단 통계 카드
  const totalCurrency = students.reduce((acc, s) => acc + (s.balance || 0), 0);
  const completedCount = students.filter(s => s.todayCompleted).length;
  const progressPercent = Math.round((completedCount / students.length) * 100);

  elements.teaStatTotalCurrency.textContent = `${totalCurrency.toLocaleString()} G`;
  elements.teaStatTaskProgress.textContent = `${completedCount} / ${students.length}명 (${progressPercent}%)`;
  elements.teaStatPendingCoupons.textContent = `${pendingCoupons.length}건`;
  elements.teaApprovalBadge.textContent = pendingCoupons.length;

  // 활성 탭 렌더링
  if (activeTeacherTab === 'students') renderTeacherStudentsTable();
  if (activeTeacherTab === 'roles') renderTeacherRolesTab();
  if (activeTeacherTab === 'shop') renderTeacherShopTab();
  if (activeTeacherTab === 'approvals') renderTeacherApprovalsTab();
  if (activeTeacherTab === 'logs') renderTeacherLogsTab();
}

// 교사: 학생 테이블 렌더링
function renderTeacherStudentsTable() {
  const students = store.getStudents();
  const keyword = (elements.teacherStudentSearch.value || '').trim().toLowerCase();
  elements.teaStudentsTbody.innerHTML = '';

  const filtered = students.filter(s => {
    return s.name.toLowerCase().includes(keyword) || s.number.toString().includes(keyword);
  });

  filtered.forEach(student => {
    const levelInfo = store.calculateLevel(student.exp);
    const role = store.getRole(student.roleId);
    const tr = document.createElement('tr');

    const isChecked = selectedStudentIds.has(student.id);

    tr.innerHTML = `
      <td>
        <input type="checkbox" class="student-row-check" data-id="${student.id}" ${isChecked ? 'checked' : ''}>
      </td>
      <td style="font-weight: 700; color: var(--text-muted);">${student.number}번</td>
      <td>
        <div class="student-table-name" style="cursor: pointer;" title="학생 시점으로 보기">
          <span>${student.avatar}</span>
          <span>${student.name}</span>
        </div>
      </td>
      <td>
        <span style="font-weight: 600;">${role ? role.name : '<span style="color: var(--text-dim);">미배정</span>'}</span>
      </td>
      <td>
        <span style="font-size: 15px; font-weight: 900; color: var(--gold);">💰 ${student.balance} G</span>
      </td>
      <td>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-weight: 700; font-size: 12px; color: ${levelInfo.color};">
            ${levelInfo.badge} Lv.${levelInfo.level} (${student.exp} EXP)
          </span>
          <div class="exp-progress-bar-bg" style="height: 6px; width: 90px;">
            <div class="exp-progress-bar-fill" style="width: ${levelInfo.progressPercent}%;"></div>
          </div>
        </div>
      </td>
      <td>
        <span class="task-status-pill ${student.todayCompleted ? 'done' : 'pending'}" style="cursor: pointer;" title="클릭하여 당번 상태 토글">
          ${student.todayCompleted ? '완료 됨' : '미완료'}
        </span>
      </td>
      <td>
        <div class="quick-amount-buttons">
          <button class="btn-chip btn-chip-plus btn-quick-plus" data-id="${student.id}" title="10 골드 바로 지급">+10G</button>
          <button class="btn-chip btn-chip-minus btn-quick-minus" data-id="${student.id}" title="5 골드 바로 차감">-5G</button>
          <button class="btn-chip btn-chip-custom btn-quick-custom" data-id="${student.id}">직접 조정</button>
        </div>
      </td>
    `;

    // 체크박스 클릭
    const chk = tr.querySelector('.student-row-check');
    chk.addEventListener('change', (e) => {
      if (e.target.checked) selectedStudentIds.add(student.id);
      else selectedStudentIds.delete(student.id);
      updateBatchButtonText();
    });

    // 학생 이름 클릭 시 학생 대시보드로 이동
    tr.querySelector('.student-table-name').addEventListener('click', () => {
      sounds.playClick();
      switchMode('student', student.id);
    });

    // 당번 상태 토글 클릭
    tr.querySelector('.task-status-pill').addEventListener('click', () => {
      if (student.todayCompleted) {
        store.resetStudentDailyTask(student.id);
        showToast(`${student.name} 학생의 오늘 임무를 미완료로 변경했습니다.`, 'info');
      } else {
        store.completeTodayTask(student.id);
        showToast(`${student.name} 학생의 오늘 임무를 완료 처리했습니다.`, 'success');
      }
      renderTeacherDashboard();
    });

    // +10G 빠른 지급
    tr.querySelector('.btn-quick-plus').addEventListener('click', () => {
      sounds.playCoin();
      store.adjustBalance(student.id, 10, "선생님 보너스 화폐 (+10G)");
      showToast(`${student.name} 학생에게 10 골드를 지급했습니다.`, 'success');
      renderTeacherDashboard();
    });

    // -5G 빠른 차감
    tr.querySelector('.btn-quick-minus').addEventListener('click', () => {
      sounds.playDeduct();
      store.adjustBalance(student.id, -5, "학급 규칙 화폐 차감 (-5G)");
      showToast(`${student.name} 학생에게서 5 골드를 차감했습니다.`, 'info');
      renderTeacherDashboard();
    });

    // 직접 조정 모달
    tr.querySelector('.btn-quick-custom').addEventListener('click', () => {
      sounds.playClick();
      openAdjustModal(student);
    });

    elements.teaStudentsTbody.appendChild(tr);
  });

  updateBatchButtonText();
}

function updateBatchButtonText() {
  const count = selectedStudentIds.size;
  elements.btnBatchReward.textContent = count > 0
    ? `🎁 선택한 ${count}명 일괄 지급`
    : `🎁 선택 학생 일괄 지급`;
}

// 교사: 1인 1역 관리 탭
function renderTeacherRolesTab() {
  const roles = store.getRoles();
  const students = store.getStudents();

  // 1. 역할 목록 테이블
  elements.teaRolesTbody.innerHTML = '';
  roles.forEach(role => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size: 24px;">${role.icon}</td>
      <td style="font-weight: 800;">${role.name}</td>
      <td style="color: var(--text-muted);">${role.description}</td>
      <td style="font-weight: 800; color: var(--gold);">+${role.dailyCurrency} G</td>
      <td style="font-weight: 800; color: #c084fc;">+${role.dailyExp} EXP</td>
      <td>
        <button class="btn-chip btn-chip-custom btn-edit-role" data-id="${role.id}">수정</button>
        <button class="btn-chip btn-chip-minus btn-del-role" data-id="${role.id}">삭제</button>
      </td>
    `;

    tr.querySelector('.btn-edit-role').addEventListener('click', () => {
      openRoleModal(role);
    });

    tr.querySelector('.btn-del-role').addEventListener('click', () => {
      if (confirm(`'${role.name}' 역할을 정말 삭제하시겠습니까?`)) {
        store.deleteRole(role.id);
        showToast('역할이 삭제되었습니다.', 'info');
        renderTeacherDashboard();
      }
    });

    elements.teaRolesTbody.appendChild(tr);
  });

  // 2. 학생별 역할 배정 셀렉트 테이블
  elements.teaStudentRoleAssignTbody.innerHTML = '';
  students.forEach(student => {
    const tr = document.createElement('tr');
    let optionsHtml = `<option value="">-- 배정 안 됨 --</option>`;
    roles.forEach(r => {
      optionsHtml += `<option value="${r.id}" ${student.roleId === r.id ? 'selected' : ''}>${r.icon} ${r.name}</option>`;
    });

    tr.innerHTML = `
      <td style="font-weight: 700;">${student.number}번</td>
      <td style="font-weight: 800;">${student.avatar} ${student.name}</td>
      <td>
        <select class="form-select role-select-dropdown" data-student-id="${student.id}" style="padding: 6px 12px; width: 240px;">
          ${optionsHtml}
        </select>
      </td>
    `;

    const select = tr.querySelector('.role-select-dropdown');
    select.addEventListener('change', (e) => {
      store.assignRole(student.id, e.target.value || null);
      showToast(`${student.name} 학생의 1인 1역을 변경했습니다.`, 'success');
    });

    elements.teaStudentRoleAssignTbody.appendChild(tr);
  });
}

// 교사: 상점 관리 탭
function renderTeacherShopTab() {
  const shopItems = store.getShopItems();
  elements.teaShopItemsGrid.innerHTML = '';

  shopItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-card-icon">${item.icon || '🎁'}</div>
      <h4 class="shop-card-title">${item.name}</h4>
      <p class="shop-card-desc">${item.description}</p>
      <div class="shop-card-bottom">
        <div>
          <span class="shop-price-tag">💰 ${item.price} G</span>
          <span class="shop-stock-badge">${item.stock !== undefined ? `재고: ${item.stock}개` : '무제한'}</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn-chip btn-chip-custom btn-edit-shop" data-id="${item.id}">수정</button>
          <button class="btn-chip btn-chip-minus btn-del-shop" data-id="${item.id}">삭제</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-edit-shop').addEventListener('click', () => {
      openShopItemModal(item);
    });

    card.querySelector('.btn-del-shop').addEventListener('click', () => {
      if (confirm(`'${item.name}' 상품을 상점에서 삭제하시겠습니까?`)) {
        store.deleteShopItem(item.id);
        showToast('상품이 삭제되었습니다.', 'info');
        renderTeacherDashboard();
      }
    });

    elements.teaShopItemsGrid.appendChild(card);
  });
}

// 교사: 승인 대기 쿠폰 탭
function renderTeacherApprovalsTab() {
  const pendingList = store.getPendingCoupons();
  elements.teaApprovalsTbody.innerHTML = '';

  if (pendingList.length === 0) {
    elements.teaApprovalsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">현재 승인 대기 중인 학생 쿠폰이 없습니다.</td></tr>`;
    return;
  }

  pendingList.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color: var(--text-muted);">${new Date(item.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td style="font-weight: 800;">${item.studentNumber}번 ${item.studentName}</td>
      <td style="font-weight: 700; color: #fbbf24;">${item.couponName}</td>
      <td>
        <span class="coupon-status-tag pending">승인 대기 중</span>
      </td>
      <td>
        <button class="btn-chip btn-chip-plus btn-approve-coupon" data-instance-id="${item.instanceId}">승인 (사용 완료)</button>
        <button class="btn-chip btn-chip-minus btn-reject-coupon" data-instance-id="${item.instanceId}">반려 (취소)</button>
      </td>
    `;

    tr.querySelector('.btn-approve-coupon').addEventListener('click', () => {
      sounds.playStamp();
      store.approveCoupon(item.instanceId);
      showToast(`${item.studentName} 학생의 [${item.couponName}] 사용을 승인 완료했습니다.`, 'success');
      renderTeacherDashboard();
    });

    tr.querySelector('.btn-reject-coupon').addEventListener('click', () => {
      store.rejectCoupon(item.instanceId);
      showToast(`${item.studentName} 학생의 쿠폰 사용 신청을 반려했습니다.`, 'info');
      renderTeacherDashboard();
    });

    elements.teaApprovalsTbody.appendChild(tr);
  });
}

// 교사: 전체 거래 기록 로그 탭
function renderTeacherLogsTab() {
  const txs = store.getTransactions();
  elements.teaAllLogsTbody.innerHTML = '';

  if (txs.length === 0) {
    elements.teaAllLogsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">기록된 거래 로그가 없습니다.</td></tr>`;
    return;
  }

  txs.forEach(t => {
    const tr = document.createElement('tr');
    const isPlus = t.amount >= 0;
    tr.innerHTML = `
      <td style="color: var(--text-muted);">${new Date(t.timestamp).toLocaleString()}</td>
      <td style="font-weight: 700;">${t.studentNumber}번 ${t.studentName}</td>
      <td>
        <span class="task-status-pill ${isPlus ? 'done' : 'pending'}">${isPlus ? '지급' : '차감/지출'}</span>
      </td>
      <td>${t.reason}</td>
      <td style="font-weight: 800; color: ${isPlus ? '#34d399' : '#fb7185'};">
        ${isPlus ? `+${t.amount}` : t.amount} G
      </td>
      <td style="font-weight: 700; color: var(--gold);">${t.newBalance} G</td>
    `;
    elements.teaAllLogsTbody.appendChild(tr);
  });
}

// ============================================================
// 모달 제어 함수들
// ============================================================
function openAdjustModal(student) {
  elements.adjustStudentId.value = student.id;
  elements.adjustStudentName.value = `${student.number}번 ${student.name} (현재 잔액: ${student.balance}G)`;
  elements.adjustAmountInput.value = '10';
  elements.adjustReasonInput.value = '선생님 칭찬 보상';
  adjustType = 'plus';
  elements.btnTypePlus.classList.add('active');
  elements.btnTypeMinus.classList.remove('active');
  openModal(elements.modalAdjustBalance);
}

function openRoleModal(role = null) {
  if (role) {
    elements.modalRoleTitle.textContent = '1인 1역 수정';
    elements.roleEditId.value = role.id;
    elements.roleEditName.value = role.name;
    elements.roleEditIcon.value = role.icon;
    elements.roleEditDesc.value = role.description;
    elements.roleEditCurrency.value = role.dailyCurrency;
    elements.roleEditExp.value = role.dailyExp;
  } else {
    elements.modalRoleTitle.textContent = '새 1인 1역 만들기';
    elements.roleEditId.value = '';
    elements.roleEditName.value = '';
    elements.roleEditIcon.value = '🧹';
    elements.roleEditDesc.value = '';
    elements.roleEditCurrency.value = '15';
    elements.roleEditExp.value = '25';
  }
  openModal(elements.modalRoleEdit);
}

function openShopItemModal(item = null) {
  if (item) {
    elements.modalShopTitle.textContent = '상점 상품/쿠폰 수정';
    elements.shopEditId.value = item.id;
    elements.shopEditName.value = item.name;
    elements.shopEditIcon.value = item.icon;
    elements.shopEditDesc.value = item.description;
    elements.shopEditPrice.value = item.price;
    elements.shopEditStock.value = item.stock !== undefined ? item.stock : 5;
  } else {
    elements.modalShopTitle.textContent = '새 상점 상품 등록';
    elements.shopEditId.value = '';
    elements.shopEditName.value = '';
    elements.shopEditIcon.value = '🎁';
    elements.shopEditDesc.value = '';
    elements.shopEditPrice.value = '50';
    elements.shopEditStock.value = '5';
  }
  openModal(elements.modalShopEdit);
}

// ============================================================
// 글로벌 이벤트 바인딩
// ============================================================
function initEventListeners() {
  // 브랜드 클릭 -> 첫 화면
  elements.brandHomeBtn.addEventListener('click', () => {
    sounds.playClick();
    switchMode('select');
  });

  // 상단 헤더 모드 전환 버튼
  elements.btnHeaderSwitchMode.addEventListener('click', () => {
    sounds.playClick();
    if (currentMode === 'teacher') {
      switchMode('student-select');
    } else if (currentMode === 'student' || currentMode === 'student-select') {
      switchMode('teacher');
    } else {
      switchMode('select');
    }
  });

  // 학생 퀵 스위처
  elements.quickStudentSwitcher.addEventListener('change', (e) => {
    sounds.playClick();
    switchMode('student', e.target.value);
  });

  // 사운드 토글
  elements.btnSoundToggle.addEventListener('click', () => {
    const muted = sounds.toggleMute();
    elements.soundIcon.textContent = muted ? '🔇' : '🔊';
    showToast(muted ? '효과음이 꺼졌습니다.' : '효과음이 켜졌습니다.', 'info');
  });

  // 첫 화면 카드 클릭
  elements.btnEnterTeacher.addEventListener('click', () => {
    sounds.playClick();
    switchMode('teacher');
  });
  elements.btnEnterStudent.addEventListener('click', () => {
    sounds.playClick();
    switchMode('student-select');
  });
  elements.btnBackToHome.addEventListener('click', () => {
    sounds.playClick();
    switchMode('select');
  });

  // 학생 서브탭 전환
  document.querySelectorAll('[data-stu-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      document.querySelectorAll('[data-stu-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStudentSubTab = btn.getAttribute('data-stu-tab');

      document.querySelectorAll('.stu-tab-pane').forEach(p => p.style.display = 'none');
      document.getElementById(`stu-tab-content-${activeStudentSubTab}`).style.display = 'block';
    });
  });

  // 교사 메인탭 전환
  document.querySelectorAll('[data-tea-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      document.querySelectorAll('[data-tea-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTeacherTab = btn.getAttribute('data-tea-tab');

      document.querySelectorAll('.tea-tab-pane').forEach(p => p.style.display = 'none');
      document.getElementById(`tea-tab-content-${activeTeacherTab}`).style.display = 'block';

      renderTeacherDashboard();
    });
  });

  // 전체 선택 체크박스
  elements.checkAllStudents.addEventListener('change', (e) => {
    const students = store.getStudents();
    if (e.target.checked) {
      students.forEach(s => selectedStudentIds.add(s.id));
    } else {
      selectedStudentIds.clear();
    }
    renderTeacherStudentsTable();
  });

  // 학생 검색 인풋
  elements.teacherStudentSearch.addEventListener('input', () => {
    renderTeacherStudentsTable();
  });

  // 일괄 보상 버튼 클릭
  elements.btnBatchReward.addEventListener('click', () => {
    sounds.playClick();
    let targets = Array.from(selectedStudentIds);
    if (targets.length === 0) {
      // 선택된 학생이 없으면 전체 25명 대상
      targets = store.getStudents().map(s => s.id);
      elements.batchTargetDesc.textContent = `학급 전체 25명 전원 대상`;
    } else {
      elements.batchTargetDesc.textContent = `선택된 ${targets.length}명 대상`;
    }
    openModal(elements.modalBatchReward);
  });

  // 일괄 보상 실행
  elements.btnConfirmBatch.addEventListener('click', () => {
    let targets = Array.from(selectedStudentIds);
    if (targets.length === 0) {
      targets = store.getStudents().map(s => s.id);
    }
    const amount = parseInt(elements.batchAmountInput.value, 10) || 10;
    const reason = elements.batchReasonInput.value.trim() || '선생님 일괄 보상';

    store.adjustBatchBalance(targets, amount, reason);
    sounds.playCoin();
    fireConfetti(2000);
    showToast(`${targets.length}명의 학생에게 각각 ${amount}G를 일괄 지급했습니다!`, 'success');
    closeModal(elements.modalBatchReward);
    renderTeacherDashboard();
  });

  // 오늘 1인 1역 전체 리셋 (새 날 시작)
  elements.btnResetAllTasks.addEventListener('click', () => {
    if (confirm('오늘 1인 1역 임무 상태를 전체 학생 미완료로 리셋하여 새로운 하루를 시작하시겠습니까? (화폐와 레벨은 유지됩니다)')) {
      sounds.playClick();
      store.resetAllDailyTasks();
      showToast('새로운 하루가 시작되었습니다! 25명 학생의 1인 1역이 리셋되었습니다.', 'success');
      renderTeacherDashboard();
    }
  });

  // 화폐 직접 조정 모달 (구분 토글)
  elements.btnTypePlus.addEventListener('click', () => {
    adjustType = 'plus';
    elements.btnTypePlus.classList.add('active');
    elements.btnTypeMinus.classList.remove('active');
  });
  elements.btnTypeMinus.addEventListener('click', () => {
    adjustType = 'minus';
    elements.btnTypeMinus.classList.add('active');
    elements.btnTypePlus.classList.remove('active');
  });

  // 화폐 직접 조정 확인
  elements.btnConfirmAdjust.addEventListener('click', () => {
    const studentId = elements.adjustStudentId.value;
    let amount = parseInt(elements.adjustAmountInput.value, 10) || 0;
    if (adjustType === 'minus') amount = -Math.abs(amount);
    const reason = elements.adjustReasonInput.value.trim() || '선생님 화폐 조정';

    const res = store.adjustBalance(studentId, amount, reason);
    if (res.success) {
      if (amount >= 0) sounds.playCoin();
      else sounds.playDeduct();

      showToast(`${res.student.name} 학생의 화폐가 변경되었습니다 (${amount >= 0 ? '+' : ''}${amount}G).`, 'success');
      closeModal(elements.modalAdjustBalance);
      renderTeacherDashboard();
    }
  });

  // 1인 1역 추가 버튼
  elements.btnAddRole.addEventListener('click', () => {
    sounds.playClick();
    openRoleModal();
  });

  // 1인 1역 저장
  elements.btnSaveRole.addEventListener('click', () => {
    const id = elements.roleEditId.value;
    const name = elements.roleEditName.value.trim();
    if (!name) {
      showToast('역할 이름을 입력해주세요.', 'error');
      return;
    }
    const roleData = {
      name,
      icon: elements.roleEditIcon.value.trim() || '🧹',
      description: elements.roleEditDesc.value.trim() || '학급 당번 임무입니다.',
      dailyCurrency: parseInt(elements.roleEditCurrency.value, 10) || 15,
      dailyExp: parseInt(elements.roleEditExp.value, 10) || 25
    };
    if (id) roleData.id = id;

    store.saveRole(roleData);
    sounds.playClick();
    showToast('1인 1역 역할 정보가 저장되었습니다.', 'success');
    closeModal(elements.modalRoleEdit);
    renderTeacherDashboard();
  });

  // 상점 상품 추가 버튼
  elements.btnAddShopItem.addEventListener('click', () => {
    sounds.playClick();
    openShopItemModal();
  });

  // 상점 상품 저장
  elements.btnSaveShopItem.addEventListener('click', () => {
    const id = elements.shopEditId.value;
    const name = elements.shopEditName.value.trim();
    if (!name) {
      showToast('상품 이름을 입력해주세요.', 'error');
      return;
    }
    const itemData = {
      name,
      icon: elements.shopEditIcon.value.trim() || '🎁',
      description: elements.shopEditDesc.value.trim() || '학급 상점 쿠폰입니다.',
      price: parseInt(elements.shopEditPrice.value, 10) || 30,
      stock: parseInt(elements.shopEditStock.value, 10) || 5
    };
    if (id) itemData.id = id;

    store.saveShopItem(itemData);
    sounds.playClick();
    showToast('상점 상품이 저장되었습니다.', 'success');
    closeModal(elements.modalShopEdit);
    renderTeacherDashboard();
  });

  // 데이터 백업 (JSON 내보내기)
  elements.btnExportJson.addEventListener('click', () => {
    sounds.playClick();
    const jsonStr = store.exportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `우리반_레벨업_백업_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('학급 데이터가 파일로 다운로드되었습니다.', 'success');
  });

  // 데이터 복원 (JSON 가져오기)
  elements.btnTriggerImportJson.addEventListener('click', () => {
    elements.fileImportJson.click();
  });
  elements.fileImportJson.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = store.importJson(event.target.result);
      if (success) {
        sounds.playClick();
        showToast('백업 파일에서 데이터가 성공적으로 복원되었습니다!', 'success');
        renderTeacherDashboard();
      } else {
        showToast('유효하지 않은 백업 파일 형식입니다.', 'error');
      }
    };
    reader.readAsText(file);
  });

  // 데이터 초기화
  elements.btnResetData.addEventListener('click', () => {
    if (confirm('경고: 정말로 모든 학급 데이터를 처음 기본 상태로 초기화하시겠습니까? (되돌릴 수 없습니다)')) {
      store.resetToDefault();
      sounds.playClick();
      showToast('모든 데이터가 기본값으로 초기화되었습니다.', 'info');
      renderTeacherDashboard();
    }
  });

  // 모든 모달 닫기 버튼 공통 처리
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => closeModal(m));
    });
  });

  // 모달 오버레이 배경 클릭 시 닫기
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });
}

// ============================================================
// 초기화 실행
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  switchMode('select');
});
