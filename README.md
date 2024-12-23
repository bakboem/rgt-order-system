
### This is a skill test question before an interview, from RGT company


## 동영상.
<video controls>
  <source src="./assets/images/play.mp4" type="video/mp4">
</video>


## 개발버전 -> 배포버전 전환시 파일 수정해야 할 때
- 전체 프로젝트 “#NEED CHANGE” 검색 후 해당 파일에서 주석 해제 요망.

## 계정 관련
- 사용자 계정 id pw 동일 rgt1  rgt2
- Biz 계정 id pw 동일 biz1 biz2

## Frontend 사용설명

### 사용자구분 
- user -> 일반계정 사용자
- bizUser -> 비즈니스계정 사용자.

### 로그인 관련
- user 와 bizUser JWT 세션 각별 관리
- JWT 유효기한 만료 후 API 요청 시 로그인 화면으로 라우팅.

### 계정전환
- 화면 우측 상단 Change 버튼 누르면 로그인 방식 선택 화면으로 이동.

### 메인 Page 위치 
- src > pages > EntryPage.tsx

### WebSocket 통신 관련

*  Socket Message 
```
{
  "type": string,
  "data": [object]
}
```
- 현재 message type은 "order_update", "menu_update", "menu_delete", "menu_add"으로 구분된다.

*  Socket Callback 
- Page에서 type 별로 callback 지정 Register 가능하며, 여러 개 추가도 가능하다.
- Callback에서 상태 관리 가능하다.

* Socket Buffering Layer 
- 동시다발 대비하여 생산자 소비자 비즈니스 모듈로 Buffering Layer 추가.


## Backend 사용설명

### JWT 관련
- JWT 만료시간은 15분이다.
- JWT 갱신 로직 포함되지 않음.

### WebSocket 관련 
- 연결했던 소켓 자원 재사용하기 위해 Socket Pool 도입.
- 동시 처리 능력 상향하기 위해 Rabbit Task 도입.
- Rabbit Task는 확장과 병렬처리 가능한 다중 소비자로 구현됨.
  
### DB 관련
- 비동기 처리에 강한 PostgreSQL Driver 선택했음.

## 인프라 설명
- 시간상 인프라까지 CI/CD에 추가하지 못했음.
- AWS 기반 Terraform 자동 자원 관리 배포 로직 포함됨.


## 환경 세팅
- Install Docker, Node.js
- pip install poetry

### RUN 
- git clone https://github.com/bakboem/rgt-order-system.git
- cd rgt-order-system

- docker-compose -f ./docker-compose-dev.yml up --build -d

- poetry install --no-root
- poetry shell
- uvicorn main:app --reload --host 0.0.0.0 --port 8000
  

- cd frontend/react-app
- yarn start


