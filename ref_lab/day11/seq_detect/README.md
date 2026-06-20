# Day 11 — Sequence Detector ("101" overlap)

FSM 실습. 직렬 입력 din 에서 패턴 "101" 검출, overlap(101101…) 처리. Moore 출력 found.
**Visualizer 파형** + **펄스 집계 self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
seq_detect/
├─ rtl/
│  └─ seq_detect.v         설계 RTL (sim 대상, 4상태 Moore FSM)
├─ testbench/
│  └─ tb_seq_detect.sv     펄스 집계 self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (seq_detect + tb)
└─ fpga/
   └─ arty.xdc             보드 핀 (clk create_clock · rst · din · found)
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

## self-checking

알려진 스트림 `1011011` 을 MSB-first 로 인가:
`S0→S1→S10→S101*→S1→S10→S101*→S1` → found **2회**(overlap 덕분).
TB 가 found 펄스를 집계해 기대값 2 와 비교, 불일치 시 `$error`. 추가로 reset 구간
동안 found 가 1 이 되면 `$error`. 콘솔 끝 `RESULT: PASS (0 mismatch)` = 검출·overlap 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 구현 (참고)

- **시뮬**: `seq_detect.v` + `tb_seq_detect.sv` (TB 가 din 을 직접 구동, XDC 불필요).
- **보드 합성**: Vivado 에서 `seq_detect.v` 컴파일, `fpga/arty.xdc` 사용 —
  clk(100MHz, create_clock) · rst(BTN0) · din(SW0) · found(LD4).
- 100MHz 에서 found 는 1클럭(10ns)만 HIGH — 눈으로 보려면 Day10 tick(클럭 인에이블)로
  din 을 천천히 샘플하거나 found 를 래치. clk 분주 금지.
