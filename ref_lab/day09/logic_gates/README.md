# Day 09 — Logic Gates (AND / OR / XOR → RGB LED)

조합논리 기초 실습. 두 스위치의 AND / OR / XOR 결과를 각 RGB LED 의 두 채널
색으로 표시, **Visualizer 파형** + **self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
logic_gates/
├─ rtl/
│  └─ logic_gates.v        설계 RTL
├─ testbench/
│  └─ tb_logic_gates.sv    self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트
└─ fpga/
   └─ arty.xdc             합성·P&R 핀 제약
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 목표

| 신호 | 연결 | 동작 |
|------|------|------|
| `sw[1:0]` → `led[1:0]` | 단색 녹색 LED LD4,LD5 | 입력 그대로 통과 (pass-through) |
| AND → `rgb0` | RGB LED LD0 | `sw[0] & sw[1]` → R+B 점등 (자홍) |
| OR  → `rgb1` | RGB LED LD1 | `sw[0] \| sw[1]` → G+B 점등 (청록) |
| XOR → `rgb2` | RGB LED LD2 | `sw[0] ^ sw[1]` → R+G 점등 (노랑) |

채널 규약: `rgb*[2:0] = {R, G, B}`. 결과가 1 일 때만 두 채널을 점등, 0 이면 소등.

## 진리표 · 기대값

| sw1 sw0 | led | AND rgb0 | OR rgb1 | XOR rgb2 |
|:-------:|:---:|:--------:|:-------:|:--------:|
| 0 0 | 00 | `000` | `000` | `000` |
| 0 1 | 01 | `000` | `011` | `110` |
| 1 0 | 10 | `000` | `011` | `110` |
| 1 1 | 11 | `101` | `011` | `000` |

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

## 4단계 산출물

| 단계 | 명령 | 산출물 | 의미 |
|------|------|--------|------|
| comp | `vlog -f flist.f` | `work/` | 컴파일된 라이브러리 |
| opt  | `vopt -debug +designfile` | `design.bin` | 설계 계층·신호 구조 |
| sim  | `vsim -c -qwavedb` | `qwave.db` | 시간축 신호 값 |
| wave | `visualizer` | — | post-sim 파형 디버그 GUI |

## 파형 비교 팁

Visualizer Wave 창에서 sw 4 조합 스윕(00→01→10→11)에 맞춰 묶어서 확인:

```
sw[1:0]
led[1:0]
rgb0[2:0]   ← AND (R+B)
rgb1[2:0]   ← OR  (G+B)
rgb2[2:0]   ← XOR (R+G)
```

## 보드 구현 (참고)

시뮬레이션 단계에서는 XDC 불필요. Vivado 합성·보드 구현 시 `fpga/arty.xdc` 사용.
sw · 단색 LED · RGB LED 핀을 전부 기재해 두었으니, 쓰지 않는 핀은 주석 처리해
이후 실습에서 계속 재사용.
