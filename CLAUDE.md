웹페이지 또는 슬라이드 제작시:
- 페이지 전체 레이아웃을 고려해서 균형있게 각 요소를 배치, 여백이 너무 쓸모없이 크게 발생하지 않도록 할 것.
- 도형이나 카드 같은 그래픽 요소는 입체감과 그림자 효과를 충분히 활용하여 디자인.
- 자료의 첫 대상이 원전 기술자이지만, 방산, 항공, 우주, 원전 전체 공통으로 사용할 수 있도록 각종 용어를 원전으로 한정하지 말고, safety-critical 용어로 가급적 사용할 것.

Siemens EDA 도구 관련 슬라이드/코드 생성시:
- Questa Lint, Questa CDC, Questa Formal 등 Siemens EDA 도구의 명령어와 워크플로우는 반드시 `questa_lint_reference.md` 레퍼런스 문서를 참조하여 정확하게 작성할 것.
- 특히 주의: Questa Lint의 실행 파일은 `qverify`이며, `questa_lint`, `qlint` 같은 명령은 존재하지 않음.
- Lint 분석 명령은 `lint run -d <top_module>`이며, `lint analyze`, `lint check`, `lint start` 같은 명령은 존재하지 않음.
- 컴파일은 `vlog`(Verilog) / `vcom`(VHDL) 명령을 사용하며, `lint compile` 같은 명령은 존재하지 않음.
- Batch 실행: `qverify -c -do "commands"` 또는 `qverify -c -do script.tcl`
- GUI 디버깅: `qverify <output_dir>/lint.db`