# Tech Notes (Hugo)

Hugo로 만든 개인 블로그 템플릿입니다. 개발 글뿐 아니라 일상, 생각 정리 글도 함께 기록할 수 있습니다.

## 로컬 실행

1. Hugo Extended를 설치합니다.
2. 아래 명령으로 개발 서버를 실행합니다.

```powershell
hugo server
```

기본 주소는 `http://localhost:1313`입니다.

로컬 실행 시 주요 경로:

- `http://localhost:1313/posts/`
- `http://localhost:1313/tags/`
- `http://localhost:1313/categories/`

배치파일로 쉽게 실행하려면:

- `run-blog.bat` 실행: 개발 서버 시작 + 브라우저 자동 열기
- `build-blog.bat` 실행: 배포용 정적 파일 빌드

## 새 글 추가 방법

1. `content/posts` 아래에 Markdown 파일을 추가합니다.
2. 각 글의 front matter에 `title`, `date`, `description`, `category`, `tags`를 입력합니다.
3. 권장 카테고리:
	- `Tech` (기술)
	- `Thoughts` (생각)
	- `Life` (일상)
	- `PixelArt` (픽셀아트)

예시:

```md
+++
title = "새 글 제목"
date = 2026-04-01T09:00:00+09:00
description = "글 요약"
categories = ["Life"]
tags = ["일상", "메모"]
+++

본문 내용
```

## 빌드

```powershell
hugo
```

빌드 결과물은 `public` 폴더에 생성됩니다.

## GitHub Pages 배포

이 저장소에는 GitHub Actions 배포 워크플로가 포함되어 있습니다.

1. 저장소를 GitHub에 푸시합니다.
2. GitHub 저장소의 `Settings > Pages`로 이동합니다.
3. Source를 `GitHub Actions`로 선택합니다.
4. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

저장소 주소가 `username.github.io`가 아니라면 보통 아래 URL로 배포됩니다.

- `https://username.github.io/repository-name/`

## SEO 기본 설정

이 프로젝트에는 아래 SEO 기본 설정이 포함되어 있습니다.

- `sitemap.xml` 생성
- `robots.txt` 생성
- 페이지별 `title`, `description`, `canonical` 설정
- Open Graph, Twitter 카드 메타 태그
- 기본 공유 이미지
- RSS 피드
- 구조화 데이터(schema.org)

추가로 실제 검색 등록을 위해 아래 값을 수정하면 됩니다.

1. `hugo.toml`의 `baseURL`을 실제 배포 주소로 변경
2. 필요하면 `googleSiteVerification`, `naverSiteVerification` 값 입력
3. Google Search Console, 네이버 서치어드바이저에 사이트맵 제출
