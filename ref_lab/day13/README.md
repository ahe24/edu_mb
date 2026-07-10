# Day 13 — 재사용 Testbench 구조 · SVA Assertion 기초 (QuestaSim)

Day12 UART 를 DUT 삼아, 모놀리식 TB 를 **계층화(driver/monitor/scoreboard)** 하고
**SVA concurrent assertion** 으로 프로토콜을 상시 감시한다. 모든 DUT RTL 은
Day12 원본 상대참조 — Day13 은 검증 코드만 새로 작성.

## 프로젝트 (순서 무관 · tb_fault 만 실습1·3 산출물 재사용)

| 폴더 | 실습 | 내용 |
|------|------|------|
| [`tb_layered/`](tb_layered/) | 실습 1 | 계층화 TB — driver/monitor/scoreboard 역할 분리 |
| [`sva_uart/`](sva_uart/) | 실습 2 | uart_tx 프로토콜 SVA 4속성 + cover (포트 관찰) |
| [`sva_bind/`](sva_bind/) | 실습 3 | bind 비침습 결합 — RTL 무수정으로 내부 state 감시 |
| [`tb_fault/`](tb_fault/) | 실습 4 | 버그 주입(`ifdef) — scoreboard vs SVA 검출력 매트릭스 |

## 공통 — 시뮬 가속 / 판정

- 시뮬 가속: `CLK_HZ=160, BAUD=10` override → 1비트 = 16클럭 (Day12 와 동일).
- 판정 2계층: TB `RESULT: PASS/FAIL`(scoreboard) + `SVA: n violation`(checker
  final 블록) — 회귀(CI)는 두 라인 모두 확인.
- bind 사용 프로젝트는 `vopt <top> bind_uart_tx` 멀티-top elaboration (Makefile 반영).

## 공통 실행

```bash
cd <project>/sim
make            # comp → opt → sim 자동 + 콘솔 self-check
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```
