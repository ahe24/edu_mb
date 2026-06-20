# Day 09 — sw → LED (pass-through / invert)

조합논리 첫 실습. `assign` 한 줄로 스위치를 LED 에 연결.
**Visualizer 파형** + **self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
sw_led/
├─ rtl/
│  └─ sw_led.v             설계 RTL (assign)
├─ testbench/
│  └─ tb_sw_led.sv         self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트
└─ fpga/
   └─ arty.xdc             합성·P&R 핀 제약
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계

| 출력 | 식 | 의미 |
|------|----|------|
| `led[3:0]`   | `led = sw`  | 통과(pass-through) — 배선만 |
| `led_n[3:0]` | `led_n = ~sw` | 연산(compute) — 비트 반전 |

- `led` → 단색 녹색 LED (LD4~LD7), `led_n` → RGB LED 파란 채널 (색 구분)

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make comp       # vlib/vmap + vlog -f flist.f
make opt        # vopt -debug +designfile → design.bin
make sim        # vsim -c -qwavedb → qwave.db + 콘솔 self-check
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

`make sim` 콘솔 끝에 `RESULT: PASS (0 mismatch)` 가 나오면 golden 기대값과
전부 일치 (self-checking).

## 파형 비교 팁

Visualizer Wave 창에서 sw 16조합 스윕(0000~1111)에 맞춰 묶어서 확인:

```
sw[3:0]
led[3:0]     ← sw 그대로
led_n[3:0]   ← ~sw (반전)
```

## 보드 구현 (참고)

시뮬레이션 단계에서는 XDC 불필요. Vivado 합성·보드 구현 시 `fpga/arty.xdc` 사용.
sw · led · led_n 핀을 기재해 두었으니, 쓰지 않는 핀은 주석 처리해 재사용.
