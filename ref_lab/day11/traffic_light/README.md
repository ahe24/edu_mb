# Day 11 — Traffic Light (타이머 기반 Moore FSM)

FSM 실습. RED→GRN→YEL 순환, 각 상태를 타이머로 유지, 출력은 one-hot(3색 동시 점등 불가).
**Visualizer 파형** + **reference-model self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
traffic_light/
├─ rtl/
│  └─ traffic_light.v       설계 RTL (sim 대상, `ifdef FUNC_SIM 타이머 분기)
├─ testbench/
│  └─ tb_traffic_light.sv   reference 시퀀스/타이머 self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave (+define+FUNC_SIM)
│  └─ flist.f              컴파일 파일리스트 (traffic_light + tb)
└─ fpga/
   └─ arty.xdc             보드 핀 (clk create_clock · rst · light[2:0])
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — 상태 천이

| 상태 | 유지(틱) | 다음 | light [R Y G] |
|:----:|:--------:|:----:|:-------------:|
| RED  | T_RED    | GRN  | 100 |
| GRN  | T_GRN    | YEL  | 001 |
| YEL  | T_YEL    | RED  | 010 |

- 타이머 `done` 일 때만 상태 천이 → 시간 제어. `default` 는 항상 **RED**(fail-safe).
- 출력 `light` 는 항상 **one-hot** — 3색 동시 점등 불가.

## FUNC_SIM — 타이머 축소 (중요)

타이머 값 `T_RED/T_GRN/T_YEL` 은 `+define+FUNC_SIM` 컴파일이면 축소(3/2/1, 시뮬),
없으면 실제 값(30/25/5, 합성). 같은 RTL 한 벌. blinker 의 `DIV` 와 동일한 패턴.

- **sim 은 FUNC_SIM 필수** — Makefile 이 `VLOG_OPT := +define+FUNC_SIM` 로 컴파일.
  안 그러면 한 바퀴 도는 데 클럭이 너무 많이 걸림.
- TB 도 같은 define 으로 컴파일돼 golden 모델의 T_* 가 DUT 와 일치.

## self-checking

DUT 와 동일 규칙의 기대 모델(상태+타이머)을 병렬 구동, 매 클럭 `light !== mlight` 이면
`$error`. 추가로 매 클럭 `light` 가 **one-hot** 인지(100/010/001 중 하나) 검사.
콘솔 끝 `RESULT: PASS (0 mismatch)` = 순서·타이밍·one-hot 전부 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동, +define+FUNC_SIM)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 구현 (참고)

- **시뮬**: `traffic_light.v` + `tb_traffic_light.sv` (XDC 불필요, FUNC_SIM 컴파일).
- **보드 합성**: Vivado 에서 `traffic_light.v` 컴파일, `fpga/arty.xdc` 사용 —
  clk(100MHz, create_clock) · rst(BTN0) · light[2:0](LD4~LD6).
- 실제 100MHz 에서는 타이머가 즉시 끝나 LED 변화를 볼 수 없음 → Day10 `tick_gen`
  (클럭 인에이블)을 추가해 느린 틱으로 `done` 을 세는 것이 정석. clk 분주 금지.
