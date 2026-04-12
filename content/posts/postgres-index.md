+++
title = "PostgreSQL 인덱스 전략 실험 노트"
date = 2026-03-10T09:00:00+09:00
description = "실행 계획을 기준으로 인덱스를 추가하고 회귀를 검증한 기록입니다."
categories = ["Tech"]
tags = ["postgresql", "database", "index", "query-tuning"]
keywords = ["PostgreSQL 인덱스", "실행 계획", "쿼리 튜닝", "DB 성능"]
+++

인덱스는 추가보다 검증이 더 중요합니다. 실행 계획과 실제 데이터 분포를 같이 확인해야 회귀를 막을 수 있습니다.

## 체크 포인트

- 쿼리 패턴 기준으로 복합 인덱스 순서 설계
- EXPLAIN ANALYZE로 실제 행 수 비교
- 쓰기 성능 저하 여부 점검

단일 조건에선 이점이 없던 인덱스가 정렬과 필터 조건 조합에서 큰 차이를 만들었습니다.
