# sva_bind — bind 비침습 SVA (내부 state 관찰)

`bind` 로 checker 를 `uart_tx` **모든 인스턴스 내부**에 결합.
RTL 도, Day12 TB 도 한 줄도 수정하지 않고 내부 상태 기반 속성 감시를 얹는다.

```
tb_uart_loop (Day12 TB 무수정 재사용)
 └─ dut : uart_loop
     └─ u_tx : uart_tx  ◀── bind 로 sva_uart_tx_int 삽입 (state/idx 직접 관찰)
```

## 왜 bind 인가 (safety-critical 관점)

- **검증 대상 형상 불변** — 검증 코드를 넣으려고 RTL 을 고치면 그 순간 검증
  대상이 달라진다. bind 는 소스 무수정으로 감시 로직만 결합.
- **일괄 적용** — 모듈명 기준 결합이라 인스턴스가 몇 개든 전부 감시.
- **내부 신호 접근** — 포트 연결명이 uart_tx 스코프에서 해석 → `state`, `idx`
  같은 내부 reg 도 이름 그대로 연결.

## 속성 (checker: `sva_uart_tx_int.sv` 제공 · bind 구문: `bind_uart_tx.sv` 구현 대상)

| 라벨 | 속성 | 의미 |
|------|------|------|
| `A_STARTBIT` | `$past(state)==START \|-> !tx` | START 상태는 start bit(0) 구동 |
| `A_STOPBIT` | `$past(state)==STOP \|-> tx` | STOP 상태는 stop bit(1) 구동 |
| `A_TRANS` | `!$stable(state) \|-> 합법 천이쌍` | IDLE→START→DATA→STOP→IDLE 링만 허용 |
| `C_STOP` | `cover property (state==STOP)` | 프레임 완주 확인 |

> `$past(state)` 인 이유: Moore 등록 출력은 상태 반영이 1클럭 늦다.
> `tx(지금) = f(state 1클럭 전)` — 등록 출력 FSM SVA 의 표준 정렬 기법.

## 실행

```bash
cd sim
make            # RESULT: PASS + " SVA(bind): 0 violation"
make clean
```

> elaboration 주의: `vopt tb_uart_loop bind_uart_tx -o opt` 처럼 bind 모듈을
> top 목록에 **함께** 지정해야 결합된다 (Makefile 반영됨).
