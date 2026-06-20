# Day 10 — Blinker (클럭 분주 LED)

순차논리 첫 실습. 100MHz 클럭을 카운터로 분주해 LED 를 토글.
**Visualizer 파형** + **reference-model self-checking TB** 로 검증.

## 프로젝트 구조

```
blinker/
├─ rtl/blinker.v             설계 RTL
├─ testbench/tb_blinker.sv   reference model self-checking TB (DIV override)
├─ sim/{Makefile, flist.f}   comp → opt → sim → wave
└─ fpga/arty.xdc             clk(create_clock) · rst · led
```

## 핵심 — 분주는 클럭 인에이블 개념, 새 클럭 아님

- LED 주기 = `2 × DIV × Tclk`. DIV=50M, Tclk=10ns → 1초 ON / 1초 OFF.
- 단일 100MHz clk 로 카운터를 돌려 `cnt==DIV-1` 마다 `led` 반전 — **새 클럭을
  만들지 않는다**(파생 클럭 금지). 같은 분주 카운터가 Day10 counter 실습의
  tick(클럭 인에이블) 으로 재사용된다.
- 시뮬은 `tb_blinker` 에서 `DIV` 를 작게 override 해 빨리 확인, 합성은 실제 값.

## 실행

```bash
cd sim
make            # comp→opt→sim + 콘솔 self-check (RESULT: PASS)
make wave       # Visualizer
make clean
```

## 보드 구현 (참고)

Vivado 합성·보드 구현 시 `fpga/arty.xdc` 사용 — clk(100MHz, **create_clock**) ·
rst(BTN0) · led(LD4). DIV 는 합성 시 실제 값(50_000_000).
