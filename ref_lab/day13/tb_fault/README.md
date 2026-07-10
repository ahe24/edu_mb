# tb_fault — 버그 주입으로 TB 검출력 확인 (fault injection)

"버그를 못 잡는 TB 는 없는 것과 같다."
실습1(계층화 TB) + 실습3(bind SVA)을 **그대로 재사용**하고, `uart_tx` 만
버그 주입판(`rtl/uart_tx_bug.v`)으로 교체해 TB 가 결함을 실제로 잡는지 검증.

## 결함 2종과 검출 매트릭스

| 실행 | 주입 결함 | scoreboard (값 비교) | bind SVA (프로토콜) |
|------|-----------|----------------------|---------------------|
| `make sim`  | 없음 (정상) | PASS | 0 violation |
| `make bug1` | `BUG_ORDER` — MSB first 송신 | **FAIL** (byte mismatch) | 통과 (타이밍은 정상) |
| `make bug2` | `BUG_STOP` — stop bit=0 | **FAIL** (framing) | **A_STOPBIT 위반** |

- **값 결함**은 scoreboard 만 잡는다 — SVA 는 프로토콜/시계열 전담.
- **프로토콜 결함**은 둘 다 잡지만, SVA 가 위반 시점·원인 속성을 즉시 지목.
- → scoreboard 와 SVA 는 상호 보완. 하나만으로는 검출 사각이 생긴다.

## 관찰 포인트

- `bug1` 에서 8바이트 중 **2바이트는 통과**한다 (`0x3C`, `0x5A` — 비트열이
  좌우대칭인 palindrome). 자극 패턴이 우연히 결함을 가리는 사례 —
  자극 다양성이 검출력을 좌우한다 (Day14 커버리지로 이어짐).
- `+define` 은 컴파일 옵션 — FUNC_SIM 과 같은 패턴 (`make bug1` 이 재컴파일).

## 실행

```bash
cd sim
make            # 정상: RESULT: PASS + SVA(bind): 0 violation
make bug1       # 값 결함:      RESULT: FAIL (6 error) · SVA 통과
make bug2       # 프로토콜 결함: RESULT: FAIL + A_STOPBIT 위반
make clean
```
