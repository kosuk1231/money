# 개발자 문서
## 2026 사회복지사 급여 시뮬레이터

이 문서는 프로젝트의 코드 구조, API, 주요 함수 및 개발 가이드라인을 설명합니다.

---

## 목차

1. [프로젝트 구조](#1-프로젝트-구조)
2. [기술 스택](#2-기술-스택)
3. [데이터 모델](#3-데이터-모델)
4. [핵심 함수 API](#4-핵심-함수-api)
5. [컴포넌트 구조](#5-컴포넌트-구조)
6. [스타일 가이드](#6-스타일-가이드)
7. [개발 환경 설정](#7-개발-환경-설정)
8. [테스트](#8-테스트)
9. [배포](#9-배포)

---

## 1. 프로젝트 구조

```
money/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── CalculatorLayout.jsx   # 메인 레이아웃 및 폼
│   │   ├── SalaryResult.jsx       # 급여 결과 표시
│   │   ├── AnnualReportTable.jsx  # 연간 리포트
│   │   ├── MonthlyDetailModal.jsx # 월별 시뮬레이션 모달
│   │   └── Tooltip.jsx            # 툴팁 컴포넌트
│   ├── data/
│   │   └── salaryData.js    # 급여 데이터 및 계산 로직
│   ├── App.jsx              # 루트 컴포넌트
│   ├── main.jsx             # 엔트리 포인트
│   └── index.css            # 글로벌 스타일
├── docs/                    # 문서
│   ├── USER_GUIDE.md
│   └── DEVELOPER.md
├── public/                  # 정적 파일
├── index.html               # HTML 템플릿
├── package.json             # 의존성 관리
├── vite.config.js           # Vite 설정
├── tailwind.config.js       # Tailwind 설정
└── verifySalary.mjs         # 급여 검증 스크립트
```

---

## 2. 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| UI Library | React | 19.x |
| Build Tool | Vite | 7.x |
| CSS Framework | TailwindCSS | 4.x |
| Language | JavaScript (ES6+) | - |
| Package Manager | npm | - |

### 의존성

```json
{
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "@vitejs/plugin-react": "^5.1.2",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4"
  }
}
```

---

## 3. 데이터 모델

### 3.1 급여 테이블 (`SALARY_TABLE`)

```javascript
// 직급별 호봉에 따른 기본급
export const SALARY_TABLE = {
  "1급": { 16: 4912000, 17: 4969000, ... },
  "2급": { 1: 3169000, 2: 3239000, ... },
  "3급": { ... },
  "4급": { ... },
  "5급": { ... },
  "관리직": { ... },
  "기능직": { ... }
};
```

### 3.2 공제율 (`DEDUCTION_RATES`)

```javascript
export const DEDUCTION_RATES = {
  PENSION: 0.0475,      // 국민연금 4.75%
  HEALTH: 0.03595,      // 건강보험 3.595%
  CARE: 0.1314,         // 장기요양 (건강보험의 13.14%)
  EMPLOYMENT: 0.009     // 고용보험 0.9%
};
```

### 3.3 수당 규정 (`ALLOWANCE_RULES`)

```javascript
export const ALLOWANCE_RULES = {
  MEAL: 140000,              // 식대
  MANAGER: 220000,           // 관리자수당
  WELFARE_POINT_HIGH: 400000, // 10호봉 이상 복지포인트
  WELFARE_POINT_LOW: 300000,  // 10호봉 미만 복지포인트
  FAMILY: {
    SPOUSE: 40000,           // 배우자
    CHILD_1: 50000,          // 첫째 자녀
    CHILD_2: 80000,          // 둘째 자녀
    CHILD_3_PLUS: 120000,    // 셋째 이상 (1인당)
    OTHERS: 20000            // 기타 부양가족 (1인당)
  },
  CHILD_UNDER_6_TAX_EXEMPT_MAX: 200000  // 만 6세 이하 비과세 한도
};
```

### 3.4 입력 옵션 타입

```typescript
// TypeScript 형식으로 표현
interface SalaryOptions {
  isManager?: boolean;
  hasSpouse?: boolean;
  numChildren?: number | ChildrenDetail;
  numOthers?: number;
  additionalAllowances?: {
    corporation?: { amount: number; type: 'monthly' | 'yearly' };
    district?: {
      type: 'none' | 'point' | 'allowance';
      amount: number;
      frequency: 'monthly' | 'yearly';
    };
  };
  holidayBonusMonths?: number[];
}

interface ChildrenDetail {
  first: boolean;
  firstUnder6: boolean;
  second: boolean;
  secondUnder6: boolean;
  thirdPlus: number;
  thirdPlusUnder6: number;
}
```

---

## 4. 핵심 함수 API

### 4.1 `calculateSalary(grade, hobong, options)`

월간 급여를 계산합니다.

**매개변수:**
| 이름 | 타입 | 설명 |
|------|------|------|
| `grade` | `string` | 직급 ("1급", "2급", ..., "기능직") |
| `hobong` | `number` | 호봉 (1~31) |
| `options` | `object` | 추가 옵션 (위 참조) |

**반환값:**
```javascript
{
  baseSalary: number,        // 기본급
  mealAllowance: number,     // 식대
  managerAllowance: number,  // 관리자수당
  familyAllowance: number,   // 가족수당
  childUnder6TaxExempt: number, // 만 6세 이하 비과세
  corporationAllowance: number, // 법인 수당
  districtAllowance: number,    // 자치구 수당
  ordinaryWage: number,         // 통상임금
  monthlyTotal: number,         // 월 총 지급액
  deductions: {
    nationalPension: number,
    healthInsurance: number,
    longTermCare: number,
    employmentInsurance: number,
    incomeTax: number,
    localIncomeTax: number,
    total: number
  },
  netPay: number,            // 실수령액
  annualHoliday: number,     // 연간 명절휴가비
  welfarePoints: number,     // 복지포인트
  annualTotal: number,       // 연간 총액 (세전)
  annualNetPay: number       // 연간 총액 (세후)
}
```

**예시:**
```javascript
import { calculateSalary } from './data/salaryData';

const result = calculateSalary("5급", 10, {
  isManager: false,
  hasSpouse: true,
  numChildren: { first: true, firstUnder6: true, second: false },
  numOthers: 0
});

console.log(result.netPay); // 실수령액
```

---

### 4.2 `generateAnnualReport(startGrade, startHobong, promotionMonth, options)`

12개월 연간 리포트를 생성합니다.

**매개변수:**
| 이름 | 타입 | 설명 |
|------|------|------|
| `startGrade` | `string` | 직급 |
| `startHobong` | `number` | 시작 호봉 |
| `promotionMonth` | `number|null` | 승급월 (null이면 승급 없음) |
| `options` | `object` | 추가 옵션 |

**반환값:**
```javascript
{
  months: [
    {
      month: 1,
      baseSalary: number,
      hobong: number,
      isPromotionMonth: boolean,
      mealAllowance: number,
      managerAllowance: number,
      familyAllowance: number,
      corporationAllowance: number,
      districtAllowance: number,
      holidayBonus: number,
      welfarePointsPayment: number,
      monthlyTotal: number,
      taxable: number,
      deductions: { ... },
      netPay: number
    },
    // ... 12개월
  ],
  promotionMonth: number|null,
  summary: {
    annualPreTax: number,
    annualPostTax: number,
    annualHoliday: number,
    welfarePoints: number,
    annualDistrict: number
  }
}
```

---

### 4.3 `calculateFamilyAllowance(hasSpouse, numChildren, numOthers)`

가족수당을 계산합니다.

**매개변수:**
| 이름 | 타입 | 설명 |
|------|------|------|
| `hasSpouse` | `boolean` | 배우자 유무 |
| `numChildren` | `number|object` | 자녀 수 또는 상세 객체 |
| `numOthers` | `number` | 기타 부양가족 수 |

**반환값:** `number` - 총 가족수당

---

### 4.4 `calculateChildUnder6TaxExempt(numChildren)`

만 6세 이하 자녀 비과세 금액을 계산합니다.

**매개변수:**
| 이름 | 타입 | 설명 |
|------|------|------|
| `numChildren` | `object` | 자녀 상세 객체 |

**반환값:** `number` - 비과세 금액 (최대 200,000원)

---

### 4.5 `calculateIncomeTax(taxableMonthly, numPeople)`

간이세액표 기반 소득세를 계산합니다.

**매개변수:**
| 이름 | 타입 | 설명 |
|------|------|------|
| `taxableMonthly` | `number` | 월 과세 소득 |
| `numPeople` | `number` | 부양가족 수 (본인 포함) |

**반환값:** `number` - 소득세

---

### 4.6 `calculate2025AnnualSalary(grade, hobong, options)`

2025년 기준 연봉을 계산합니다 (YoY 비교용).

**반환값:**
```javascript
{
  annualTotal: number,
  baseSalary: number,
  monthlyTotal: number,
  annualHoliday: number,
  welfarePoints: number
}
```

---

## 5. 컴포넌트 구조

### 5.1 컴포넌트 계층

```
App
└── CalculatorLayout
    ├── SalaryResult
    │   └── Tooltip
    ├── AnnualReportTable
    │   └── MonthCard (모바일)
    └── MonthlyDetailModal
        └── Tooltip
```

### 5.2 컴포넌트 설명

#### `CalculatorLayout.jsx`
- **역할**: 메인 레이아웃, 입력 폼, 상태 관리
- **상태**:
  - `formData`: 모든 입력값
  - `result`: 계산 결과
  - `annualReport`: 연간 리포트
  - `showDetailModal`: 모달 표시 여부
- **주요 함수**:
  - `handleInputChange()`: 입력 변경 처리
  - `handleHolidayBonusChange()`: 명절휴가비 월 토글
  - `getChildrenObject()`: 자녀 정보 객체 변환

#### `SalaryResult.jsx`
- **역할**: 급여 결과 표시, 선택적 공제 입력
- **Props**:
  - `result`: 계산 결과 객체
  - `grade`, `hobong`: 직급/호봉
  - `salary2025`: 2025년 비교 데이터
  - `reportSummary`: 연간 요약
  - `optionalDeductions`: 선택적 공제
  - `onOptionalDeductionChange`: 공제 변경 핸들러

#### `AnnualReportTable.jsx`
- **역할**: 12개월 리포트 테이블, 내보내기
- **Props**:
  - `annualReport`: 연간 리포트 데이터
  - `promotionMonth`: 승급월
  - `holidayBonusMonths`: 명절휴가비 월
  - `optionalDeductions`: 선택적 공제
- **주요 함수**:
  - `handleDownloadCSV()`: CSV 다운로드
  - `handlePdfExport()`: PDF 내보내기
  - `handlePrint()`: 인쇄

#### `MonthlyDetailModal.jsx`
- **역할**: 월별 상세 시뮬레이션
- **Props**:
  - `isOpen`: 모달 표시 여부
  - `onClose`: 닫기 핸들러
  - `baseData`: 기본 데이터 (급여 정보)
- **로컬 상태**:
  - `selectedMonth`: 선택된 월
  - `overtimeHours`: 시간외근무 시간

#### `Tooltip.jsx`
- **역할**: 정보 툴팁 표시
- **Props**:
  - `children`: 툴팁 내용
- **Export**: `Tooltip`, `InfoIcon`

---

## 6. 스타일 가이드

### 6.1 CSS 구조
- TailwindCSS 유틸리티 클래스 사용
- 커스텀 스타일은 `index.css`에 정의

### 6.2 색상 팔레트
```css
/* 주요 색상 */
--primary: #3b82f6;    /* blue-500 */
--success: #22c55e;    /* green-500 */
--warning: #f59e0b;    /* amber-500 */
--danger: #ef4444;     /* red-500 */
--neutral: #6b7280;    /* gray-500 */
```

### 6.3 반응형 브레이크포인트
```css
/* Tailwind 기본값 */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### 6.4 코딩 컨벤션
- 컴포넌트: PascalCase (`SalaryResult.jsx`)
- 함수: camelCase (`calculateSalary`)
- 상수: UPPER_SNAKE_CASE (`DEDUCTION_RATES`)
- CSS 클래스: Tailwind 유틸리티 우선

---

## 7. 개발 환경 설정

### 7.1 설치

```bash
# 저장소 클론
git clone [repository-url]
cd money

# 의존성 설치
npm install
```

### 7.2 개발 서버

```bash
npm run dev
```
- 기본 포트: http://localhost:5173
- Hot Module Replacement (HMR) 지원

### 7.3 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 7.4 환경 변수
현재 환경 변수는 사용하지 않음 (클라이언트 사이드 전용)

---

## 8. 테스트

### 8.1 급여 검증 스크립트

```bash
node verifySalary.mjs
```

이 스크립트는 급여 계산 로직을 검증합니다.

### 8.2 수동 테스트 체크리스트

- [ ] 모든 직급/호봉 조합에서 기본급 정상 표시
- [ ] 가족수당 계산 정확성
- [ ] 만 6세 이하 비과세 적용
- [ ] 4대보험 공제액 계산
- [ ] 소득세/지방소득세 계산
- [ ] 승급월 반영
- [ ] 명절휴가비 지급월 변경
- [ ] CSV 다운로드
- [ ] PDF 내보내기
- [ ] 모바일 반응형

---

## 9. 배포

### 9.1 빌드 결과물

```bash
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.

### 9.2 배포 옵션

#### Vercel (권장)
```bash
# Vercel CLI 사용
npx vercel
```

#### Netlify
```bash
# Netlify CLI 사용
npx netlify deploy --prod --dir=dist
```

#### 정적 호스팅
`dist/` 폴더의 내용을 정적 호스팅 서비스에 업로드합니다.

### 9.3 배포 체크리스트

- [ ] `npm run build` 성공
- [ ] 빌드 결과물 크기 확인
- [ ] 브라우저 호환성 테스트
- [ ] 모바일 테스트

---

## 추가 리소스

- [React 문서](https://react.dev/)
- [Vite 문서](https://vitejs.dev/)
- [TailwindCSS 문서](https://tailwindcss.com/)
- [서울시 사회복지시설 인건비 가이드라인](https://welfare.seoul.go.kr/)

---

*문서 버전: 1.0*  
*최종 수정일: 2026-01-15*
