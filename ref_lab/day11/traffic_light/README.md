# Day 11 — Traffic Light (타이머 기반 Moore FSM)

FSM 실습. RED→GRN→YEL 순환, 각 상태를 타이머로 유지, 출력은 one-hot(3색 동시 점등 불가).
**Visualizer 파형** + **reference-model self-checking TB** 양쪽으로 검증.

핵심 구조는 Day10 `counter`/`seq_detect` 와 동일한 **단일 클럭 + 클럭 인에이블(en)** 패턴:
FSM 코어는 `en` 인 클럭에서만 1틱 전진, 보드에서는 `tick_gen` 의 1Hz tick 을 `en` 으로 연결.

## 프로젝트 구조 (권장 구조 준수)

```
traffic_light/
├─ rtl/
│  ├─ traffic_light.v       FSM 코어 (en 클럭 인에이블 · 틱 단위 타이머, sim 대상)
│  └─ top_traffic_light.v   보드 top (tick_gen 1Hz → traffic_light.en)
├─ testbench/
│  └─ tb_traffic_light.sv   reference 시퀀스/타이머 self-checking TB (en 펄스 구동)
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave (FUNC_SIM 불필요)
│  └─ flist.f              유닛 컴파일 파일리스트 (traffic_light + tb)
└─ fpga/
   ├─ arty.xdc             보드 핀 (clk create_clock · rst · light[2:0])
   └─ board_flist.f        합성 파일리스트 (tick_gen + traffic_light + top)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.
`tick_gen.v` 는 Day10 원본을 `board_flist.f` 에서 상대참조(사본 금지).

## 설계 — 상태 천이 & 출력

| 상태 | 유지(틱) | 다음 | RGB LED (점등) | R G B | mono one-hot |
|:----:|:--------:|:----:|:--------------:|:-----:|:------------:|
| RED  | T_RED=30 | GRN  | LD0 빨강       | 1 0 0 | 100 |
| YEL  | T_YEL=5  | RED  | LD1 **노랑**   | **1 1 0** | 010 |
| GRN  | T_GRN=25 | YEL  | LD2 초록       | 0 1 0 | 001 |

- 타이머 `done` 일 때만 상태 천이 → 시간 제어. `default` 는 항상 **RED**(fail-safe).
- 타이머/상태는 `en=1` 인 클럭에서만 전진 — `en=0` 이면 그대로 유지.
- 한 번에 한 램프(한 RGB LED)만 점등 — 상충(적+녹 동시) 방지. 상태 `mono_led` 는 one-hot.

## RGB LED 색 — 노랑 = R + G (중요)

램프 3개를 보드 **RGB LED 3개(LD0/LD1/LD2)** 로 독립 구동. RGB LED 는 빨강·초록·파랑
3채널의 **가산혼합** — **"노랑" 전용 핀이 없다.**

- RED 램프 = LD0 → R 채널만 (`rgb_led_r[0]`)
- **YEL 램프 = LD1 → R+G 두 채널 동시** (`rgb_led_r[1]` + `rgb_led_g[1]`) = 노랑
- GRN 램프 = LD2 → G 채널만 (`rgb_led_g[2]`)
- 파랑(B)은 미사용 → 항상 0. `mono_led[2:0]`(LD4~6)에 상태 one-hot 을 따로 미러(디버그).

출력 포트: `rgb_led_r/g/b[2:0]`(인덱스=LD 번호) + `mono_led[2:0]`. 핀 매핑은 `fpga/arty.xdc`.

## en — 클럭 인에이블 (핵심)

`clk` 을 분주해 새 클럭을 만들지 않고(파생 클럭 금지), **단일 클럭 + en 펄스**로 느린 동작을 구현.
`T_*` 는 "틱 단위" — en 1펄스 = 1틱. 같은 RTL 한 벌이 sim/board 동일.

- **보드**: `top_traffic_light` 안의 `tick_gen` 이 100MHz→1Hz en 펄스를 생성 →
  FSM 이 초당 한 칸 전진 → 30/25/5 틱 = 30s/25s/5s 로 눈에 보임.
- **시뮬**: 유닛 TB 가 `en` 을 EN_DIV(=4) 클럭마다 직접 펄스 → 분주기(1억) 없이
  수백 클럭이면 순환 완료. **FUNC_SIM 같은 타이머 축소가 불필요.**
- 1Hz 분주기(DIV=1억)는 절대 사이클 단위로 시뮬하지 않음 — 합성 전용.

## self-checking

DUT 와 동일 규칙의 기대 모델(상태+타이머)을 같은 `en` 으로 병렬 구동, 매 클럭
`{rgb_led_r,g,b, mono_led}` 를 기대값과 비교해 다르면 `$error` — **YEL=R+G 색까지** 검증.
추가로 매 클럭 `mono_led`(상태)가 **one-hot** 인지, `en=0` 인 클럭에 멈춰 있는지(게이팅) 확인.
콘솔 끝 `RESULT: PASS (0 mismatch)` = 순서·타이밍·RGB 색·one-hot·게이팅 전부 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 구현 (참고)

- **시뮬**: `traffic_light.v` + `tb_traffic_light.sv` (XDC 불필요). FSM 코어만 검증.
- **보드 합성**: Vivado 에서 `fpga/board_flist.f`(tick_gen + traffic_light +
  top_traffic_light) 컴파일, top = `top_traffic_light`, `fpga/arty.xdc` 사용 —
  clk(100MHz, create_clock) · rst(BTN0) · RGB LED LD0/LD1/LD2 · mono LD4~6(디버그).
- 100MHz 를 그대로 카운트하면 30틱=300ns 라 LED 변화가 안 보임 → `tick_gen`(클럭
  인에이블)으로 1Hz en 을 만들어 `done` 을 세는 것이 정석. clk 분주 금지.
