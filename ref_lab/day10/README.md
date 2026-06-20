# Day 10 — 순차논리 설계 실습 (QuestaSim · Visualizer)

순차논리 실습 묶음. 각 프로젝트는 권장 구조(`rtl / testbench / sim / fpga`)를
따르며, `comp → opt → sim → wave` Makefile 흐름으로 시뮬·파형 검증.

## 프로젝트

| 폴더 | 실습 | 내용 |
|------|------|------|
| [`blinker/`](blinker/) | 실습 1 | 클럭 분주 LED 점멸 — 100MHz → 1Hz, parameter override |
| [`counter/`](counter/) | 실습 2 | N-bit 카운터 · enable · wrap + 클럭 인에이블(tick_gen) |
| [`debounce/`](debounce/) | 실습 3 | 버튼 디바운서 — 2FF 동기화 + STABLE 카운터 |

> 실습 4(self-checking TB)는 counter 의 `tb_counter.sv`(reference model)로 다룬다.

## 공통 — 100MHz 클럭 다루기

보드 메인 클럭은 100MHz. 느린 동작(LED 점멸·초당 증가)은 **클럭을 분주해 새 클럭을
만들지 말고**(파생 클럭 금지), 단일 clk + **클럭 인에이블(tick)** 또는 분주 카운터로
구현. counter 의 `tick_gen.v` / `top_counter.v` 참고.

## 공통 실행

```bash
cd <project>/sim
make            # comp → opt → sim 자동 + 콘솔 self-check
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```
