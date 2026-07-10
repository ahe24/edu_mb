# sva_uart — uart_tx 프로토콜 SVA (포트 관찰 checker)

Day12 `uart_tx` 의 **외부 프로토콜**을 concurrent assertion 4개로 상시 감시.
checker 는 DUT 포트만 관찰(비침습) — TB 레벨에서 인스턴스로 결합.

## 속성 (구현 대상: `sva_uart_tx.sv`)

| 라벨 | 속성 | 의미 |
|------|------|------|
| `A_START` | `(start && !busy) \|-> ##[1:BIT_CLK+1] busy` | 요청은 반드시 수락된다 (bounded response) |
| `A_IDLE` | `!busy \|-> tx` | 전송 중이 아니면 라인은 idle(1) 유지 |
| `A_FELL` | `$fell(tx) \|-> busy` | 라인 하강(start bit)은 전송 중에만 |
| `A_ROSE` | `$rose(busy) \|-> !tx` | 수락 클럭엔 start bit(0) 구동 |
| `C_REQ` | `cover property (start && !busy)` | 요청 이벤트 발생 확인 (Day14 예고) |

- `disable iff (rst)` — 리셋 구간 평가 제외.
- `A_START` 상한이 `BIT_CLK+1` 인 이유: start 는 `pend` 로 래치 후
  **다음 tick 경계**에서 수락 — 최악 대기 = tick 직후 요청.
- scoreboard(값 비교)와 SVA(프로토콜·시계열)는 **상호 보완** — 실습4 에서 확인.

## 실행

```bash
cd sim
make            # RESULT: PASS (SVA 0 violation)
make wave       # Visualizer 파형 (start/busy/tx)
make clean
```
