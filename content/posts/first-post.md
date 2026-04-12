+++
title = "Node.js API 응답속도 38% 개선한 과정"
date = 2026-03-28T09:00:00+09:00
description = "측정 지표부터 병목 제거까지, 실제로 적용했던 방법을 단계별로 정리했습니다."
categories = ["Tech"]
tags = ["nodejs", "api", "performance", "redis"]
keywords = ["Node.js API 성능 개선", "Redis 캐시", "N+1 쿼리", "응답속도 개선"]
+++

이번 글은 실제 운영 API의 평균 응답 시간을 줄인 과정을 정리한 내용입니다.

먼저 APM으로 구간별 시간을 측정하고 DB 쿼리 호출 횟수를 확인했습니다. 그 후 캐시 키를 세분화해 불필요한 재계산을 줄였습니다.

## 핵심 변경

- N+1 쿼리 제거
- 응답 직렬화 방식 단순화
- 핫패스 캐싱 적용

```js
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const result = await service.getData();
await redis.set(cacheKey, JSON.stringify(result), { EX: 60 });
return result;
```

적용 후 p95 지표가 890ms에서 550ms로 감소했습니다.
