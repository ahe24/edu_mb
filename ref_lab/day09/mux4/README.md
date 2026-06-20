# Day 09 — 4:1 Color MUX (case → RGB LED)

`case` 문 기반 4:1 MUX 실습. 슬라이드 스위치 2개(`sel`)로 미리 정의한 4색 중
하나를 골라 RGB LED 로 출력. **Visualizer 파형** + **self-checking TB** 양쪽으로
검증하고, full-case / latch 회피(Day 06) 원칙을 확인.

## 프로젝트 구조 (권장 구조 준수)

```
mux4/
├─ rtl/
│  └─ mux4.v               설계 RTL (case 기반)
├─ testbench/
│  └─ tb_mux4.sv           self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트
└─ fpga/
   └─ arty.xdc             합성·P&R 핀 제약
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — sel → 선택 색

| sel (sw1 sw0) | 색 | rgb {R,G,B} |
|:-------------:|:--:|:-----------:|
| 00 | R 빨강 | `100` |
| 01 | G 초록 | `010` |
| 10 | B 파랑 | `001` |
| 11 | W 흰색 | `111` |

채널 규약: `rgb[2:0] = {R, G, B}`.

## full-case 와 latch (Day 06 연결)

조합 `always @*` 는 **모든 입력 조합**에 출력을 대입해야 한다. `sel` 2비트의
4 조합(`00·01·10·11`)을 다 기술하면 그 자체로 **full-case** → `default` 가 없어도
latch 는 추론되지 않는다. latch 는 case 가 **불완전**하고 `default` 도 없을 때
(미기술 값에서 직전 값 유지) 생긴다.

본 설계의 `default` 는 latch 방지가 아니라 **① 향후 case 누락 방지 ② `sel` 의
X/Z 시뮬 방어**용 안전망 — safety-critical 에서 권장하는 방어적 습관.

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

`make sim` 콘솔 끝에 `RESULT: PASS (0 mismatch)` 가 나오면 golden 기대 색과
전부 일치 (self-checking).

## 파형 비교 팁

Visualizer Wave 창에서 sel 스윕(00→01→10→11)에 맞춰 확인:

```
sw[1:0]
rgb[2:0]   ← 100(R) → 010(G) → 001(B) → 111(W)
```

## 보드 구현 (참고)

시뮬레이션 단계에서는 XDC 불필요. Vivado 합성·보드 구현 시 `fpga/arty.xdc` 사용.
sw(sel) · RGB LED 핀을 기재해 두었으니, 쓰지 않는 핀은 주석 처리해 재사용.
