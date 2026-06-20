# Day 12 — UART 송수신 설계·검증 실습 (QuestaSim · Visualizer)

UART 직렬 통신 실습 묶음. 각 프로젝트는 권장 구조(`rtl / testbench / sim / fpga`)를
따르며, `comp → opt → sim → wave` Makefile 흐름으로 시뮬·파형 검증. 모든 TB 는
self-checking — 콘솔 끝 `RESULT: PASS (0 mismatch)` 로 회귀(CI) 판정.

## 프로젝트 (빌드 순서)

| 폴더 | 실습 | 내용 |
|------|------|------|
| [`baud_gen/`](baud_gen/) | 실습 1 | baud tick 생성 — `DIV=CLK_HZ/BAUD` 분주, 1× / 16× tick |
| [`uart_tx/`](uart_tx/) | 실습 2 | 송신기 — start→data→stop FSM + shift register(LSB first) |
| [`uart_rx/`](uart_rx/) | 실습 3 | 수신기 — 2FF 동기화 + 16× oversample 비트 중앙 샘플 |
| [`uart_loop/`](uart_loop/) | 실습 4 | echo 루프백 통합 + scoreboard 검증(TX+RX+baud_gen×2) |

> 빌드 순서: **baud_gen → uart_tx / uart_rx → uart_loop**. baud_gen 이 TX·RX 의 tick
> 의존이며, uart_loop 가 셋을 통합. uart_tx / uart_rx 는 baud_gen 만 있으면 서로 무관하게
> 진행 가능.

## 공통 — baud 타이밍 / 시뮬 가속

- TX 는 1× tick, RX 는 16× tick(`BAUD×16`)으로 비트 **중앙** 샘플 — clock recovery 없는
  비동기 UART 의 핵심.
- 실제 `DIV` 는 100MHz/115200 ≈ 868 로 시뮬이 느림 → TB 에서 작은 `CLK_HZ/BAUD`(예:
  160/10 → DIV=16)로 인스턴스해 빠른 회귀. RTL 기본 파라미터는 실제 값 유지(합성 동일).

## 공통 실행

```bash
cd <project>/sim
make            # comp → opt → sim 자동 + 콘솔 self-check
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```
