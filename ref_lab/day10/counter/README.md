# Day 10 — N-bit Counter (enable · wrap-around)

순차논리 실습. 클럭 엣지마다 `en` 이면 +1, W비트 한계에서 자동 wrap.
**Visualizer 파형** + **reference-model self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
counter/
├─ rtl/
│  ├─ counter.v            설계 RTL (sim 대상)
│  ├─ tick_gen.v           100MHz → 1Hz tick(클럭 인에이블) 생성 (보드용)
│  └─ top_counter.v        보드 top — clk + tick_gen → counter.en (보드용)
├─ testbench/
│  └─ tb_counter.sv        reference model self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (counter + tb)
└─ fpga/
   └─ arty.xdc             top_counter 핀 (clk create_clock · rst · en_sw · cnt)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — 제어 동작

| rst | en | 다음 cnt |
|:---:|:--:|:--------|
| 1 | – | 0 (리셋) |
| 0 | 1 | cnt + 1 |
| 0 | 0 | cnt (유지) |

- `rst` 는 **동기** — 클럭 엣지에서만 0. W=4 → 15 다음은 0 (overflow wrap).

## self-checking

DUT 와 동일 규칙의 기대 모델(`model`)을 병렬 구동, 매 클럭 `cnt !== model` 이면
`$error`. 콘솔 끝 `RESULT: PASS (0 mismatch)` = 전 구간 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드에서 100MHz 쓰기 — 클럭 인에이블 (중요)

보드 메인 클럭은 **100MHz**. counter 를 이 클럭으로 매 엣지 +1 하면 초당 1억 증가
→ LED 로 변화를 볼 수 없다.

- ❌ 클럭을 분주해 counter 의 clk 으로 사용 = 파생 클럭(gated/divided) → 스큐·타이밍·CDC
  문제, safety-critical 금기.
- ✅ 단일 100MHz 클럭 유지 + 1클럭 폭 **tick(클럭 인에이블)** 을 만들어 `en` 에 연결.

`tick_gen.v` 가 DIV 클럭마다 tick 을 1클럭 HIGH → `top_counter.v` 에서
`counter.en = tick & en_sw` 로 연결. counter 는 여전히 100MHz 로 동작하되 tick 일 때만 +1.

```verilog
tick_gen #(.DIV(100_000_000)) u_tick (.clk(clk), .rst(rst), .tick(tick));
counter  #(.W(4)) u_cnt (.clk(clk), .rst(rst), .en(tick & en_sw), .cnt(cnt));
```

## 보드 구현 (참고)

- **시뮬**: `counter.v` + `tb_counter.sv` (TB 가 en 을 직접 구동, XDC 불필요).
- **보드 합성**: Vivado 에서 `counter.v` + `tick_gen.v` + `top_counter.v` 컴파일,
  `fpga/arty.xdc`(top_counter) 사용 — clk(100MHz, create_clock) · rst(BTN0) ·
  en_sw(SW0) · cnt[3:0](LD4~LD7).
