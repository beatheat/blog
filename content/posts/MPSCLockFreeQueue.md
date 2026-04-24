+++
title = "MPSC Lock-Free Queue 구현 정리"
date = 2026-04-22T00:00:00+09:00
description = "Vyukov MPSC 큐의 구조와 링킹 지연 포인트"
categories = ["Tech"]
tags = ["동시성", "락프리", "CSharp"]
+++

멀티 스레드 환경에서 큐 하나를 안전하게 쓰는 일은 생각보다 까다롭다.

이번 글은 Dmitry Vyukov의 MPSC(Multiple Producer, Single Consumer) Lock-Free Queue를 C#으로 구현하면서 정리한 내용이다.

- 원본 아이디어: Dmitry Vyukov (Intel), 1024cores
- 특성: Lock-free, Push는 wait-free, 소비자는 1개로 제한

---


## 핵심 구현 코드

```csharp
using System.Threading;

public class MPSCLockFreeQueue<T> : IDisposable
{
    private class QueueNode
    {
        public T? _data;
        public QueueNode? _next;

        public QueueNode(T? data)
        {
            _data = data;
            _next = null;
        }
    }

    private QueueNode _head;
    private QueueNode _tail;

    public MPSCLockFreeQueue()
    {
        var sentinel = new QueueNode(default(T));
        _head = sentinel;
        _tail = sentinel;
    }

    public void Dispose()
    {
        while (TryPop(out _)) { }
        _head = _tail = null!;
    }

    public void Push(T? obj)
    {
        var node = new QueueNode(obj);
        var beforeHead = Interlocked.Exchange(ref _head, node);
        Interlocked.Exchange(ref beforeHead._next, node);
    }

    public bool TryFront(out T? obj)
    {
        QueueNode? next = Volatile.Read(ref _tail._next);
        if (next == null)
        {
            obj = default(T);
            return false;
        }

        obj = next._data;
        return true;
    }

    public bool TryPop(out T? obj)
    {
        QueueNode? next = Volatile.Read(ref _tail._next);
        if (next == null)
        {
            obj = default(T);
            return false;
        }

        obj = next._data;
        next._data = default(T);
        _tail = next;
        return true;
    }
}
```

---

## 동작 원리

### 1) 초기 상태

더미(sentinel) 노드 1개로 시작한다. head와 tail이 같은 노드를 가리킨다.

### 2) Push (여러 Producer)

Push는 2단계다.

1. head를 새 노드로 원자 교체
2. 이전 head의 next를 새 노드로 연결

CAS 재시도 루프가 없어서 Push 자체는 wait-free 성질을 가진다.

### 3) Pop (단일 Consumer)

consumer는 tail.next를 읽어 실제 데이터를 꺼낸다. 꺼낸 노드를 새 sentinel처럼 사용하면서 tail을 전진시킨다.

---

## 중요한 포인트: 링킹 지연

이 알고리즘에서 처음 헷갈리는 부분은 "Push가 끝났는데 Pop이 실패할 수 있다"는 점이다.

원인은 Push의 2단계 분리 때문이다.

- head 교체는 끝났지만
- 이전 노드의 next 연결이 아직 안 끝난 잠깐의 구간이 생길 수 있다

이때 consumer가 읽으면 next가 null이라 false를 받는다. 버그가 아니라 알고리즘의 정상 동작이다.

![링킹 지연 시나리오](../../images/mpsc-linking-delay.svg)

**실전에서는 consumer 쪽에서 짧은 spin/retry 정책으로 이 구간을 흡수한다.**

---

## 메모리 오더링 요약

| 연산 | API | 의미 |
|------|-----|------|
| Push: head 교체 | Interlocked.Exchange | full fence |
| Push: next 링킹 | Interlocked.Exchange | full fence |
| Pop: tail.next 읽기 | Volatile.Read | acquire |

producer의 release 성격 쓰기와 consumer의 acquire 읽기가 맞물려 데이터 가시성을 보장한다.

---

## 정합성이 깨지지 않는 이유

Push-Push 경합에서 각 producer는 서로 다른 beforeHead를 받기 때문에 서로 다른 next 필드에 쓴다. 즉, 같은 위치에 동시에 덮어쓰는 구조가 아니다.

Pop은 단일 consumer 제약 덕분에 Pop-Pop 경합 자체가 없다. 또한 이 구현은 CAS 기반 포인터 교체가 아니어서 전형적인 ABA 이슈와도 결이 다르다.

---

## 마무리

Vyukov MPSC 큐의 핵심은 단순하다.

- producer 경합을 짧은 원자 연산 2번으로 고정
- consumer는 단일 스레드 전제로 단순화
- 링킹 지연은 실패가 아니라 설계된 일시 상태

락을 줄이면서도 유효한 성능을 원한다면, MPSC 패턴에서 충분히 실전적인 선택지다.
