# Day 11 — FSM 설계 실습 (QuestaSim · Visualizer)

FSM 설계 실습 묶음. 각 프로젝트는 권장 구조(`rtl / testbench / sim / fpga`)를
따르며, `comp → opt → sim → wave` Makefile 흐름으로 시뮬·파형 검증.

## 프로젝트

| 폴더 | 실습 | 내용 |
|------|------|------|
| [`traffic_light/`](traffic_light/) | 실습 1 | 타이머 기반 신호등 Moore FSM — RED→GRN→YEL 순환, one-hot 출력, FUNC_SIM 타이머 축소 |
| [`pwm_rgb/`](pwm_rgb/) | 실습 2 | 2버튼 밝기 ±5% PWM — top·pwm_gen·debounce·led_driver 분해, 0~100% duty 측정 self-check |
| [`seq_detect/`](seq_detect/) | 실습 3 | "101" 시퀀스 검출 FSM — overlap 처리, found 펄스 집계 self-check |

> 순서 무관 — 주제별로 독립. 신호등·시퀀스는 Moore FSM 정석(상태 reg + 조합 next + 조합 출력),
> pwm_rgb 는 saturating 밝기 카운터 + PWM 비교 + 모듈 분해(통합·계층) 학습.

## 공통 — 100MHz 클럭 다루기

보드 메인 클럭은 100MHz. 느린 동작(신호등 타이머·버튼·직렬 입력)은 **클럭을 분주해
새 클럭을 만들지 말고**(파생 클럭 금지), 단일 clk + **클럭 인에이블(tick)** 로 구현.
Day10 `tick_gen.v` / 디바운서 참고. traffic_light 는 시뮬에서 `+define+FUNC_SIM` 로
타이머를 축소(동일 RTL).

## 공통 실행

```bash
cd <project>/sim
make            # comp → opt → sim 자동 + 콘솔 self-check
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```
