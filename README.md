# 📍 핀잇
<p align="center">
  <img src="https://github.com/user-attachments/assets/89019269-0d03-4534-9f08-2fdcacc9a41b">
</p>


- 배포 URL : http://goorm-pin-it.s3-website.ap-northeast-2.amazonaws.com/
- Test ID : hyoju123@naver.com
- Test PW : 123456

## ✨ 프로젝트 소개
- Pinterest를 클론 코딩한 팀 프로젝트로, 핵심 기능을 구현하고 사용자 경험을 개선할 새로운 기능을 추가했습니다.
- 개인 프로필 페이지에서 자신이 업로드한 이미지와 저장한 핀들을 보드 별로 확인 및 관리할 수 있습니다.
- 다른 사용자를 팔로우하고 핀에 좋아요를 누르거나 댓글을 작성할 수 있습니다.
- 실시간 채팅 기능을 통해 다른 사용자들과 자유롭게 대화할 수 있습니다.
- 새로운 핀을 업로드하거나 기존 핀을 꾸밀 수 있습니다.
- 스토리를 추가해 24시간 동안 팔로워들과 특별한 순간을 공유할 수 있습니다.

## 👥 팀원 구성

<div align="center">

| **황효주** | **김가영** | **안주현** | **조은영** | **조하은** |
| :------: |  :------: | :------: | :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/u/105642658?v=4" height=150 width=150> <br/> @hjoo830](https://github.com/hjoo830) | [<img src="https://avatars.githubusercontent.com/u/155832049?v=4" height=150 width=150> <br/> @gouoy](https://github.com/gouoy) | [<img src="https://avatars.githubusercontent.com/u/105899818?v=4" height=150 width=150> <br/> @AnJuHyeon](https://github.com/AnJuHyeon) | [<img src="https://avatars.githubusercontent.com/u/106731103?v=4" height=150 width=150> <br/> @cho-eun-young](https://github.com/cho-eun-young) | [<img src="https://avatars.githubusercontent.com/u/108499120?v=4" height=150 width=150> <br/> @hani0903](https://github.com/hani0903) | 

</div>

## 1. 개발 환경
- **Frontend:** React, TypeScript, Tailwind.css
- **Backend:** Firebase, Express
- **Design:** Figma
- **Version Control**: Git, GitHub

## 2. 프로젝트 구조
```
src/
├── components/    # UI 컴포넌트
├── pages/         # 주요 페이지
├── hooks/         # 커스텀 훅
├── features/      # 기능별 Redux 슬라이스 및 관련 로직
├── utils/         # 공통 유틸리티 함수
└── types/         # TypeScript 타입 정의 및 관리
```

## 3. 역할 분담

- 황효주
    - 프로젝트 관리
    - 프로필 페이지
    - 프로필 수정
    - 팔로우 기능
    - 스토리
- 김가영
    - 메인 페이지
    - 저장 기능
- 안주현
    - 메시지
    - 보드 상세페이지
    - 네비바
    - 핀 꾸미기
- 조은영
    - 로그인 및 회원가입
    - 계정 관리
    - 헤더
    - 핀 꾸미기
- 조하은
    - 핀 생성페이지
    - 핀 상세페이지
    - 핀 꾸미기
 
## 4. 개발 기간 및 작업 관리

### 개발 기간

- **총 개발 기간**: 2024-12-11 ~ 2025-01-10 (총 4주)
- **UI 구현**: 2024-12-16 ~ 2024-12-20
- **기능 구현**: 2024-12-23 ~ 2025-01-10

### 작업 관리

- **노션 활용**
    - 데일리 스크럼 작성을 통한 실시간 진행 상황 공유
    - 각 팀원의 일일 작업 내용, 완료된 작업, 예정된 작업 트래킹
    - 프로젝트 전체 일정 및 개인별 할당 작업 관리
- **디스코드 정기 회의**
    - 최소 주 1회 정기 회의를 통한 프로젝트 전략 논의
    - 진행 상황 점검 및 발생한 이슈 공유
    - 팀원 간 원활한 소통 및 협업 문화 형성

## 5. 페이지별 기능

### [회원가입 및 로그인]
![회원가입 및 로그인 시연](https://github.com/user-attachments/assets/49e4e5c3-81eb-4ca9-b824-24e58e83bd73)
- 랜딩페이지
- 회원가입
- 로그인
- 로그아웃
  
### [핀 생성 및 상세페이지]
![핀 생성 및 상세 시연](https://github.com/user-attachments/assets/11d17557-3cb4-4d28-9c26-b836b89522c6)

- 핀 이미지 업로드
    - 파일 선택 또는 드래그 앤 드롭으로 이미지 업로드
    - 이미지 미리보기
    - 이미지 수정 버튼
- 제목, 설명, 링크 입력
- 보드 선택 드롭다운
    - 각 보드의 첫 번째 핀의 `imageURL`을 사용해 보드 이미지 렌더링
    - 저장할 보드 선택
    - 이름을 통한 보드 검색 기능
    - 보드 생성 기능 추가
- 태그 관리
    - 검색을 통한 태그 필터링
    - 추가된 태그를 다양한 색상코드로 렌더링
    - 태그 삭제 기능
- 핀 저장
    - 생성된 핀 ID를 보드와 사용자 데이터에 업데이트
- 핀 상세 페이지
    - 핀 데이터 렌더링
    - 핀에 작성된 댓글 렌더링
    - 유저 프로필/닉네임 클릭 시 해당 유저의 마이 페이지로 연결

### [보드에 핀 저장기능]
![보드에 핀 저장 시연](https://github.com/user-attachments/assets/81e321cb-47f6-4076-aefb-f1435d123cd1)

- 보드 선택 및 드롭다운
    - 보드의 첫 번째 핀의 `imageURL`을 사용해 보드 이미지 렌더링
    - 보드 목록에서 아이템 선택 시 핀 저장
    - 드롭다운 외의 영역 클릭 시 드롭다운 제거

### [마이페이지]
![마이페이지 시연](https://github.com/user-attachments/assets/94a85436-747a-4182-ae4b-36ab9a1db84d)

- 프로필 공유
  - 링크 복사
  - WhatsApp 공유
  - Facebook Messenger 공유
  - Facebook 공유
  - X(Twitter) 공유
- 팔로우
- 생성한 핀 목록
- 저장된 핀 목록
- 보드 목록
  - 최신순 / 알파벳순 정렬
- 보드 만들기
  - 비밀 보드로 유지
  - 참여자 초대

### [보드 상세페이지]
![보드 상세페이지 시연](https://github.com/user-attachments/assets/ff8642a0-bfdd-4127-9064-d624b8990ee3)

- 보드 수정
    - 제목 및 설명 수정
- 보드 병합
- 참여자 초대
- 정리하기
    - 드래그앤드롭
    - 선택 후 삭제

### [실시간 채팅]
![실시간 채팅 시연](https://github.com/user-attachments/assets/f5947ee6-1be2-4692-930e-d654f5e7eb9c)

- 실시간 채팅
    - 입력 내용 및 시간
- 새 메시지
- 리로드 후에도 채팅 기록 보존

### [스토리 기능]
![스토리 시연](https://github.com/user-attachments/assets/6b633452-9306-494b-b4f7-fa9ea95d4d12)

- 팔로우 중인 사용자의 스토리만 목록에 표시
- 스토리를 올린 유저의 프로필 클릭 시 업로드한 스토리와 상대 시간 표시
- 한 유저가 여러개의 스토리를 올린 경우 화살표가 나타나며 다음 스토리 조회 가능
- 스토리는 업로드 후 24시간이 지나면 자동 삭제
- 본인이 올린 스토리가 없을 경우, 프로필 클릭 또는 + 버튼으로 스토리 생성
    - 파일 선택 또는 드래그 앤 드롭
    - 사진 수정

### [핀 꾸미기 기능]
![핀 꾸미기 시연](https://github.com/user-attachments/assets/af6107ae-c221-4f23-a8d5-635fd8046b10)

- 사진 불러오기
- 페인트, 드로잉 도구
- 지우개
- 전체 삭제 기능
- 텍스트 추가
- 사진 저장

### [설정 페이지]
![설정 페이지 시연](https://github.com/user-attachments/assets/aad71227-ffb0-4691-942c-07f75dbb5aeb)

- 프로필 수정
    - 프로필 사진 변경
    - 닉네임 변경
    - 소개글 변경
    - 아이디 변경
- 계정 관리
    - 현재 이메일 보여주기
    - 비밀번호 재설정
    - 계정 삭제
 
## 6. 발생 이슈 및 해결
### 1) Windows와 macOS 간 프리티어(Prettier) 코드 포맷팅 충돌

- **문제 원인**: `Prettier`를 사용하여 코드 포맷팅을 진행하던 중, Windows와 macOS의 줄바꿈 방식 차이(LF와 CRLF)로 일부 팀원에게 에러가 발생했습니다.
- **해결 방법**: `.prettierrc`설정 파일에 `endOfLine`옵션을 추가하여 해결하였습니다.

```jsx
{
  "endOfLine": "auto"
}
```

이를 통해 운영체제에 맞는 줄바꿈을 자동으로 적용하여 문제를 해결할 수 있었습니다.

### 2) 현재 로그인한 유저의 UID를 가져오는 코드 반복

- **문제 원인:** `UID`를 가져올때 여러 곳에서 필요하게 되어 여러번 중복되는 코드가 생겼습니다.
- **해결 방법:** 반복되는 작업을 최소화 하기위해 `useCurrentUserUid`를 분리하여 사용하였습니다.

```tsx
import useCurrentUserUid from '../hooks/useCurrentUserUid';
...
const currentUserUid = useCurrentUserUid();
...
onClick={() => navigate(`/profile/${currentUserUid}`)}
```


## 7. 이슈 리포트
🔗 https://sage-fifth-38a.notion.site/6cbc3abc246248d5856efd88ee80798a
