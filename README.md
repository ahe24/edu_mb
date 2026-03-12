# MicroBlaze 교육 슬라이드 플랫폼

이 프로젝트는 Arty A7 보드 기반 MicroBlaze 하드웨어 설계 & 소프트웨어 제어 연동 실습 교육을 위한 웹 기반 슬라이드 플랫폼입니다.
Next.js 프레임워크와 Reveal.js, 그리고 커스텀 Node.js + Express 라우팅 서버를 기반으로 구축되었습니다.

## 🚀 1. Rocky Linux 9 배포 가이드 (PM2 연동)

이 가이드는 빈 Rocky 9 서버에서 프로젝트를 클론받아 PM2 데몬으로 무중단 서비스하기까지의 전체 스텝입니다.

### Step 1: 저장소 클론 및 패키지 설치
Rocky Linux 터미널에 SSH 등으로 접속한 후 아래 명령어를 순차적으로 실행하세요.
(만약 서버에 `git`이나 `node(npm)`가 없다면 호스트 관리자에 문의하여 사전 설치가 필요합니다.)

```bash
# 1. 프로젝트 폴더로 이동 및 클론 (원하시는 디렉토리에서 수행)
git clone https://github.com/ahe24/edu_mb.git
cd edu_mb

# 2. 의존성 패키지 설치 (Next.js, Reveal.js, Express 등)
npm install
```

### Step 2: 글로벌 환경 구축 (PM2)
운영 서버 프로세스를 무중단 관리할 전역 PM2를 설치합니다.
```bash
# PM2 글로벌 설치 (필요시 sudo 권한 사용)
npm install -g pm2

# (선택) 서버 재부팅 시 PM2가 자동으로 실행되도록 설정
pm2 startup
pm2 save
```

### Step 3: 프로덕션 빌드 (Production Build)
로컬에서 개발했던 React 코드를 리눅스 서버 환경에 맞춰 가장 빠르고 가볍게 구동되도록 정적/동적 병합 빌드를 수행합니다.

```bash
# 프로덕션 빌드 시작
npm run build
```

### Step 4: PM2 커스텀 서버 백그라운드 구동
프로젝트 내부에 준비된 `ecosystem.config.js`를 사용해 프로덕션 모드 포트(기본 8900)로 데몬을 띄웁니다.

```bash
# 프로덕션 환경 변수를 적용하여 서버 구동
pm2 start ecosystem.config.js --env production
```

이후 `http://<Rocky Linux 서버 IP>:8900` 에 접속하여 **교육 플랫폼 대시보드**가 열리는지 확인합니다.

---

## 🛠 2. PM2 운영/관리 명령어 (유지보수 스니펫)

서버 관리 중 가장 자주 쓰이는 명령어 모음입니다. 문제가 생기면 터미널에 복사해 넣으세요.

```bash
# 1. 구동 중인 서비스 목록과 상태(UP/DOWN) 확인
pm2 list

# 2. 서버 콘솔(에러 등) 실시간 타임라인 로그 감시 (Ctrl+C로 빠져나오기)
pm2 logs edu_mb_slides

# 3. 코드 업데이트(git pull 등) 후 변경 사항 서버에 재접용
npm run build
pm2 restart edu_mb_slides

# 4. 서비스 중지 (내릴 때)
pm2 stop edu_mb_slides
```

---

## 🗂 3. 디렉토리 아키텍처 (어디를 수정하면 되나요?)

신규 과정을 구성하거나 기존 강의를 편집하실 때 참고할 핵심 디렉토리입니다.

- **`src/app/page.tsx`**
  - 최상위 진입점(포털 서버)입니다. 대시보드 화면 및 신규 강의 버튼을 이 파일에서 추가하세요.
- **`src/app/mb/page.tsx`**
  - **[MicroBlaze 과정]** 전용 슬라이드 내용이 전부 담겨있습니다. 내용 수정 시 이곳을 편집하세요.
- **`src/components/...`**
  - `ImagePlaceholder.tsx`나 다이어그램 등 페이지에 들어가는 앱 조각(컴포넌트)을 재사용하기 위해 모아둔 곳입니다.
- **`public/images/`**
  - 캡쳐 이미지나 로고 등 정적 에셋 파일들을 이곳에 넣고 `/images/파일명.png`로 불러와 사용합니다.
- **`server.js`**
  - 기본 Next.js 포트 대신 사용자 지정 포트나 라우팅을 우회할 때 건드리는 Express 서버 엔진 본체입니다. 변경 시 `pm2 restart`가 필요합니다.
