# Day 09 — 조합논리 설계 실습 (QuestaSim · Visualizer)

조합논리 첫 실습 묶음. 각 프로젝트는 권장 구조(`rtl / testbench / sim / fpga`)를
그대로 따르며, `comp → opt → sim → wave` Makefile 흐름으로 시뮬·파형 검증.

## 프로젝트

| 폴더 | 실습 | 내용 |
|------|------|------|
| [`sw_led/`](sw_led/) | 실습 1 | `assign` 한 줄 — sw 통과(led) + 반전(led_n) |
| [`logic_gates/`](logic_gates/) | 실습 2 | AND / OR / XOR 결과를 RGB LED 두 채널 색으로 표시 |
| [`mux4/`](mux4/) | 실습 3 | `case` 기반 4:1 컬러 MUX — sel 2비트로 R/G/B/W 선택 |

## 공통 실행

```bash
cd <project>/sim
make            # comp → opt → sim 자동 + 콘솔 self-check
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

각 프로젝트 상세는 해당 폴더의 `README.md` 참조.
