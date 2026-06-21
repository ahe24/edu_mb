# Day 11 — Sequence Detector ("101" overlap)

FSM 실습. 직렬 입력 din 에서 패턴 "101" 검출, overlap(101101…) 처리. Moore 출력 found.
**시뮬레이션**(펄스 집계 self-checking TB) + **보드 hands-on**(SW0 + BTN1 step) 양쪽 지원.

## 프로젝트 구조

```
seq_detect/
├─ rtl/
│  ├─ seq_detect.v   ③ FSM 코어 (en 클럭 인에이블, sim·board 공용)
│  ├─ debounce.v     ① 버튼 채터링 제거 + 2FF 동기화 (Day10 재사용)
│  └─ seq_top.v      보드 최상위 (② 엣지검출 + 배선)
├─ testbench/
│  └─ tb_seq_detect.sv   펄스 집계 self-checking TB (en=1 스트리밍)
├─ sim/
│  ├─ Makefile           comp → opt → sim → wave
│  └─ flist.f            시뮬 파일리스트 (seq_detect + tb)
└─ fpga/
   ├─ arty.xdc           보드 핀 (clk · rst · step_btn · din · found)
   └─ board_flist.f      합성 파일리스트 (debounce + seq_detect + seq_top)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — 상태 천이

| 상태 | din=0 | din=1 | found |
|:----:|:-----:|:-----:|:-----:|
| S0   | S0    | S1    | 0 |
| S1   | S10   | S1    | 0 |
| S10  | S0    | S101  | 0 |
| S101 | S10   | S1    | **1** |

- `found = (state==S101)` Moore 출력. `default` 는 S0 으로 안전 복구.
- **overlap 핵심**: S101 에서 din=1 이면 S0 이 아니라 **S1** 로 — 101101… 연속 패턴을
  놓치지 않음. 이 화살표를 S0 으로 잘못 두면 연속 검출 실패.

## 왜 보드용 래퍼(seq_top)가 필요한가 — 초보자용 설명

FSM 코어만으로는 **보드에서 손으로 못 돌린다.** 코어는 `clk` 엣지마다 din 을 샘플하는데
보드 clk 은 100MHz → 스위치를 손으로 1초 올려두면 "비트 1개"가 아니라 "1이 1억 번"
들어간다. "101"은 **연속 3비트에 한 비트씩** 와야 하므로 손 박자로는 못 맞춘다.

그래서 비트 **값**과 비트 **투입 시점**을 분리한다. 구성요소 3단계:

```
BTN1(raw) ─►[① debounce]─► step_lvl ─►[② edge detect]─► step(1clk) ─► en
SW0 ──────────────────────────────────────────────────────────────► din
                                       [③ seq_detect FSM] ─► found ─► LD4
```

| # | 블록 | 하는 일 | 없으면? |
|:-:|------|---------|---------|
| ① | `debounce` | 기계 접점 채터링 제거 + 비동기 버튼 2FF 동기화 | 한 번 눌러도 펄스가 여러 번 → 비트가 여러 개 들어감 |
| ② | edge detect (`seq_top` 내부) | 안정 레벨의 0→1 전이를 잡아 **1클럭짜리 step** 생성 | 누르고 있는 동안 en=1 유지 → 또 1비트/클럭 폭주 |
| ③ | `seq_detect` (en) | step 인 클럭에서만 din 1비트 샘플·전진 | 손 박자로 비트 정렬 불가 |

- found 는 `state==S101` 조합 출력. en=0 동안 상태가 안 바뀌므로 **다음 step 전까지 LED
  가 그대로 켜져** 눈에 보인다(별도 래치 불필요). clk 자체는 분주하지 않음.

### 보드 조작 순서

1. BTN0(rst)로 S0 초기화.
2. SW0 = 1 설정 → BTN1 누름  (비트 1 투입, state S0→S1)
3. SW0 = 0 설정 → BTN1 누름  (비트 0, S1→S10)
4. SW0 = 1 설정 → BTN1 누름  (비트 1, S10→**S101**) → **LD4 점등**
5. 이어서 1,0,1 더 넣으면 overlap 으로 LD4 가 한 번 더 점등(101101).

## self-checking (시뮬)

알려진 스트림 `1011011` 을 MSB-first 로, en=1 연속 인가:
`S0→S1→S10→S101*→S1→S10→S101*→S1` → found **2회**(overlap 덕분).
TB 가 found 펄스를 집계해 기대값 2 와 비교, 불일치 시 `$error`. 추가로 reset 구간
동안 found 가 1 이 되면 `$error`. 콘솔 끝 `RESULT: PASS (0 mismatch)` = 검출·overlap 일치.

## 실행

### 시뮬 (sim/ 에서)
```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```
시뮬은 FSM 코어(seq_detect)만 검증 — XDC·seq_top·debounce 불필요.

### 보드 합성 (Vivado, 참고)
- top = **seq_top**. 소스: `fpga/board_flist.f`(debounce + seq_detect + seq_top).
- 핀: `fpga/arty.xdc` — clk(100MHz, create_clock) · rst(BTN0) · step_btn(BTN1) ·
  din(SW0) · found(LD4).
